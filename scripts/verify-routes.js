// Smoke-checks every built route against an in-process Vite preview server
// using headless Chrome over CDP. Verifies raw SSR HTML (before JS), route CSS,
// real React hydration via interactive controls, zero hydration warnings,
// zero theme/font flash on seeded reloads, and #navigation lazy map loading.
import { spawn } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { preview } from 'vite'
import { ROUTES_META } from '../src/seo/routesMeta.js'

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const routes = ROUTES_META.map((entry) => entry.route)

const findChrome = () => {
  const candidates = [
    process.env.CHROME_BIN,
    'google-chrome',
    'google-chrome-stable',
    'chromium',
    'chromium-browser',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ].filter(Boolean)
  for (const candidate of candidates) {
    if (candidate.includes('/')) {
      if (existsSync(candidate)) return candidate
      continue
    }
    for (const dir of (process.env.PATH || '').split(':')) {
      if (existsSync(join(dir, candidate))) return join(dir, candidate)
    }
  }
  throw new Error('Chrome not found. Set CHROME_BIN to a Chrome or Chromium executable.')
}

const waitForFile = async (path, timeoutMs) => {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    if (existsSync(path)) {
      const contents = readFileSync(path, 'utf8')
      if (contents.includes('\n')) return contents
    }
    await new Promise((resolve) => setTimeout(resolve, 50))
  }
  throw new Error(`Timed out waiting for ${path}`)
}

const stopChild = (child, timeoutMs = 2000) => new Promise((resolve) => {
  if (!child || child.exitCode !== null || child.signalCode !== null) return resolve()
  const timer = setTimeout(() => {
    try { child.kill('SIGKILL') } catch { /* already exited */ }
  }, timeoutMs)
  child.once('exit', () => {
    clearTimeout(timer)
    resolve()
  })
  try { child.kill('SIGTERM') } catch { clearTimeout(timer); resolve() }
})

const connect = (url) => new Promise((resolve, reject) => {
  const socket = new WebSocket(url)
  let nextId = 0
  const pending = new Map()
  const exceptions = []
  const consoleErrors = []
  socket.addEventListener('message', ({ data }) => {
    const message = JSON.parse(data)
    if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params)
    if (message.method === 'Runtime.consoleAPICalled') {
      const { type, args = [] } = message.params
      const text = args.map((arg) => arg.value ?? arg.description ?? '').join(' ')
      if (type === 'error' || /hydrat|did not match/i.test(text)) {
        consoleErrors.push({ type, text })
      }
    }
    if (message.id && pending.has(message.id)) {
      const { resolve: done, reject: fail } = pending.get(message.id)
      pending.delete(message.id)
      if (message.error) fail(new Error(message.error.message))
      else done(message.result)
    }
  })
  socket.addEventListener('error', () => reject(new Error(`Could not connect to ${url}`)))
  socket.addEventListener('open', () => resolve({
    send: (method, params = {}, sessionId) => new Promise((done, fail) => {
      const id = ++nextId
      pending.set(id, { resolve: done, reject: fail })
      socket.send(JSON.stringify({ id, method, params, sessionId }))
    }),
    exceptions,
    consoleErrors,
    close: () => socket.close(),
  }))
})

const server = await preview({
  root: repoRoot,
  preview: { host: '127.0.0.1', port: 0, strictPort: false },
})
const address = server.httpServer.address()
const baseUrl = `http://127.0.0.1:${address.port}`
const profileDir = mkdtempSync(join(tmpdir(), 'site-verify-'))
let chrome

try {
  let failed = 0

  // 1. Raw HTTP checks (no JavaScript): verify SSR body, route CSS, project links, JSON-LD, and .md twins
  for (const meta of ROUTES_META) {
    const htmlResp = await fetch(`${baseUrl}${meta.route}`)
    const html = await htmlResp.text()
    const hasBodyH1 = /<h1\b[^>]*>[\s\S]+?<\/h1>/i.test(html)
    const hasJsonLd = html.includes('application/ld+json') && html.includes('https://tuckercraig.com/#person')
    const hasError = html.includes('This page could not load')
    const mdResp = await fetch(`${baseUrl}${meta.mdPath}`)
    const mdText = await mdResp.text()
    const mdOk =
      mdResp.ok &&
      mdText.trim().startsWith('# ') &&
      !mdText.includes('Your browser does not support this video.')

    if (!htmlResp.ok || !hasBodyH1 || !hasJsonLd || hasError || !mdOk) {
      console.error(`✗ raw SSR/MD check failed for ${meta.route}`, {
        status: htmlResp.status,
        hasBodyH1,
        hasJsonLd,
        hasError,
        mdStatus: mdResp.status,
        mdOk,
      })
      failed++
    }
    if (meta.route === '/projects' && !html.includes('https://github.com/btuckerc/angl-browser')) {
      console.error('✗ raw /projects HTML missing project repository links')
      failed++
    }
    if (meta.route === '/projects/s3-amoled' && !/project-navigation-[^"]+\.css/.test(html)) {
      console.error('✗ raw /projects/s3-amoled HTML missing route stylesheet link')
      failed++
    }
    if (meta.route === '/privacy/herdwick' && !mdText.includes('`herdwick-<random>`')) {
      console.error('✗ /privacy/herdwick.md missing inline-code wrapped herdwick-<random> literal')
      failed++
    }
    if (meta.route === '/' && (!mdText.includes('center-seat') || !mdText.includes('boilerplate'))) {
      console.error('✗ /index.md missing homepage project kickers (center-seat / boilerplate)')
      failed++
    }
    if (meta.route === '/about' && !mdText.includes('Software Engineer')) {
      console.error('✗ /about.md missing Software Engineer kicker')
      failed++
    }
    if (
      meta.route === '/workflow' &&
      !['GPT-6.2 Sol', 'Claude Opus 5.5', 'Claude Fable', 'GPT-6.2 Astra', 'Gemini 4 Neon'].every((seat) =>
        mdText.includes(seat)
      )
    ) {
      console.error('✗ /workflow.md missing one or more council seat descriptions')
      failed++
    }
  }

  for (const staticFile of ['/llms.txt', '/llms-full.txt', '/sitemap.xml', '/robots.txt']) {
    const resp = await fetch(`${baseUrl}${staticFile}`)
    const text = await resp.text()
    if (!resp.ok || text.trim().length < 40) {
      console.error(`✗ static AEO/SEO file check failed for ${staticFile} (${resp.status})`)
      failed++
    }
  }

  // 2. Headless Chrome hydration checks across all routes (requiring live React interaction)
  chrome = spawn(findChrome(), [
    '--headless=new',
    '--remote-debugging-port=0',
    `--user-data-dir=${profileDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    ...(process.env.CHROME_NO_SANDBOX === '1' ? ['--no-sandbox'] : []),
  ], { stdio: 'ignore' })

  const [port, browserPath] = (await waitForFile(join(profileDir, 'DevToolsActivePort'), 15000)).trim().split('\n')
  const cdp = await connect(`ws://127.0.0.1:${port}${browserPath}`)
  const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' })
  const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true })
  await cdp.send('Page.enable', {}, sessionId)
  await cdp.send('Runtime.enable', {}, sessionId)

  for (const route of routes) {
    await cdp.send('Page.navigate', { url: `${baseUrl}${route}` }, sessionId)
    let page = { title: '', h1: '', brokenImages: 0, jsonLdCount: 0, interactive: false }
    const deadline = Date.now() + 4000
    while (Date.now() < deadline) {
      const { result } = await cdp.send('Runtime.evaluate', {
        expression: `(async () => {
          const btn = document.querySelector('.tui-theme-toggle');
          const before = btn?.getAttribute('aria-label') || '';
          let interactive = false;
          if (btn && before) {
            btn.click();
            await new Promise((r) => setTimeout(r, 50));
            const after = btn.getAttribute('aria-label') || '';
            if (after && after !== before) {
              interactive = true;
              // Cycle back to original theme (dark -> light -> amber -> dark)
              btn.click();
              await new Promise((r) => setTimeout(r, 20));
              btn.click();
              await new Promise((r) => setTimeout(r, 20));
            }
          }
          return {
            title: document.title,
            h1: document.querySelector('h1')?.innerText?.trim() || '',
            brokenImages: [...document.querySelectorAll('img')].filter(i => i.complete && i.naturalWidth === 0).length,
            jsonLdCount: document.querySelectorAll('script[type="application/ld+json"]').length,
            interactive,
          };
        })()`,
        awaitPromise: true,
        returnByValue: true,
      }, sessionId)
      page = result.value
      if (page.h1 && page.jsonLdCount > 0 && page.interactive) break
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
    const ok = Boolean(
      page.title &&
      page.h1 &&
      !page.h1.includes('This page could not load') &&
      page.brokenImages === 0 &&
      page.jsonLdCount >= 1 &&
      page.interactive
    )
    if (!ok) {
      console.error(`✗ ${route} failed check:`, page)
      failed++
    } else {
      console.log(`✓ ${route} (${page.title})`)
    }
  }

  // 2b. Verify /projects cards start collapsed in CSS (display: none) and toggle cleanly
  await cdp.send('Page.navigate', { url: `${baseUrl}/projects` }, sessionId)
  await new Promise((resolve) => setTimeout(resolve, 400))
  const { result: projectsToggleResult } = await cdp.send('Runtime.evaluate', {
    expression: `(async () => {
      const detail = document.querySelector('.tui-project-detail');
      const trigger = document.querySelector('.tui-project-trigger');
      if (!detail || !trigger) return { ok: false, reason: 'missing-elements' };
      const initialHidden = detail.hidden;
      const initialDisplay = getComputedStyle(detail).display;
      trigger.click();
      await new Promise((r) => setTimeout(r, 80));
      const openHidden = detail.hidden;
      const openDisplay = getComputedStyle(detail).display;
      trigger.click();
      await new Promise((r) => setTimeout(r, 80));
      const closedHidden = detail.hidden;
      const closedDisplay = getComputedStyle(detail).display;
      return {
        ok: initialHidden === true && initialDisplay === 'none' &&
            openHidden === false && openDisplay === 'grid' &&
            closedHidden === true && closedDisplay === 'none',
        initialHidden, initialDisplay, openHidden, openDisplay, closedHidden, closedDisplay,
      };
    })()`,
    awaitPromise: true,
    returnByValue: true,
  }, sessionId)
  if (!projectsToggleResult.value?.ok) {
    console.error('✗ /projects collapse/expand CSS check failed:', projectsToggleResult.value)
    failed++
  } else {
    console.log('✓ /projects cards start collapsed (display: none) and toggle to grid/none cleanly')
  }

  // 3. Seeded localStorage preference check with MutationObserver + storage write spy (zero flash / zero default overwrite)
  const { identifier: spyScriptId } = await cdp.send('Page.addScriptToEvaluateOnNewDocument', {
    source: `(() => {
      window.__prefViolations = [];
      window.__seenLightClass = false;
      const origSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = function(key, val) {
        if ((key === 'theme-mode' && val === 'dark') || (key === 'font-family' && val === 'neue-montreal')) {
          window.__prefViolations.push('wrote:' + key + '=' + val);
        }
        return origSetItem.apply(this, arguments);
      };
      const checkRoot = () => {
        const root = document.documentElement;
        if (!root) return;
        if (root.classList.contains('light')) {
          window.__seenLightClass = true;
        } else if (window.__seenLightClass) {
          window.__prefViolations.push('lost-light-class');
        }
        const fontVar = root.style.getPropertyValue('--font-family');
        if (fontVar && fontVar.includes('Neue Montreal')) {
          window.__prefViolations.push('reverted-font-style:' + fontVar);
        }
      };
      const obs = new MutationObserver(checkRoot);
      const attach = () => {
        if (document.documentElement) {
          obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] });
          checkRoot();
        } else {
          new MutationObserver((_, self) => {
            if (document.documentElement) {
              self.disconnect();
              obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] });
              checkRoot();
            }
          }).observe(document, { childList: true });
        }
      };
      attach();
    })()`,
  }, sessionId)

  await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      localStorage.setItem('theme-mode', 'light');
      localStorage.setItem('font-family', 'jetbrains');
      return true;
    })()`,
    returnByValue: true,
  }, sessionId)
  await cdp.send('Page.navigate', { url: `${baseUrl}/about` }, sessionId)
  await new Promise((resolve) => setTimeout(resolve, 600))
  const { result: prefResult } = await cdp.send('Runtime.evaluate', {
    expression: `(() => ({
      isLight: document.documentElement.classList.contains('light'),
      savedTheme: localStorage.getItem('theme-mode'),
      savedFont: localStorage.getItem('font-family'),
      computedFont: getComputedStyle(document.documentElement).getPropertyValue('--font-family').trim(),
      violations: window.__prefViolations || [],
    }))()`,
    returnByValue: true,
  }, sessionId)
  await cdp.send('Page.removeScriptToEvaluateOnNewDocument', { identifier: spyScriptId }, sessionId)

  if (
    !prefResult.value.isLight ||
    prefResult.value.savedTheme !== 'light' ||
    prefResult.value.savedFont !== 'geist-mono' ||
    !prefResult.value.computedFont.includes('Geist Mono') ||
    prefResult.value.violations.length > 0
  ) {
    console.error('✗ Preference hydration check failed:', prefResult.value)
    failed++
  } else {
    console.log('✓ Seeded theme/font preferences preserved with zero flash or default writes')
  }

  // 4. Verify /projects/s3-amoled#navigation loads the deferred interactive map cleanly
  await cdp.send('Page.navigate', { url: `${baseUrl}/projects/s3-amoled#navigation` }, sessionId)
  let navLoaded = false
  const navDeadline = Date.now() + 4000
  while (Date.now() < navDeadline) {
    const { result } = await cdp.send('Runtime.evaluate', {
      expression: `Boolean(document.querySelector('.navigation-demo'))`,
      returnByValue: true,
    }, sessionId)
    if (result.value) {
      navLoaded = true
      break
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  if (!navLoaded) {
    console.error('✗ /projects/s3-amoled#navigation did not mount .navigation-demo')
    failed++
  } else {
    console.log('✓ /projects/s3-amoled#navigation mounted interactive map cleanly')
  }

  cdp.close()
  if (cdp.exceptions.length) {
    console.error('Runtime exceptions:', JSON.stringify(cdp.exceptions))
    failed++
  }
  if (cdp.consoleErrors.length) {
    console.error('Console/hydration errors:', JSON.stringify(cdp.consoleErrors))
    failed++
  }
  if (failed) process.exitCode = 1
} finally {
  await stopChild(chrome)
  server.httpServer.closeAllConnections?.()
  await new Promise((resolve) => server.httpServer.close(resolve))
  rmSync(profileDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 })
}
