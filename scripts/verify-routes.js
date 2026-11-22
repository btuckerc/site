// Smoke-checks every built route against an in-process Vite preview server
// using headless Chrome over CDP. Using Vite's JS API avoids spawning `npx`
// wrappers that can orphan preview servers and hold pipes open.
import { spawn } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { preview } from 'vite'

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const routeSource = readFileSync(join(repoRoot, 'src', 'routeLoaders.js'), 'utf8')
const routes = [...routeSource.matchAll(/^\s*'([^']+)':/gm)].map(([, route]) => route)

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
  socket.addEventListener('message', ({ data }) => {
    const message = JSON.parse(data)
    if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params)
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

  let failed = 0
  for (const route of routes) {
    await cdp.send('Page.navigate', { url: `${baseUrl}${route}` }, sessionId)
    let page = { title: '', h1: '', brokenImages: 0 }
    const deadline = Date.now() + 3000
    while (Date.now() < deadline) {
      const { result } = await cdp.send('Runtime.evaluate', {
        expression: `(() => ({
          title: document.title,
          h1: document.querySelector('h1')?.innerText?.trim() || '',
          brokenImages: [...document.querySelectorAll('img')].filter(i => i.complete && i.naturalWidth === 0).length,
        }))()`,
        returnByValue: true,
      }, sessionId)
      page = result.value
      if (page.h1) break
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
    const ok = Boolean(page.title && page.h1 && page.brokenImages === 0)
    if (!ok) failed++
    console.log(`${ok ? '✓' : '✗'} ${route} (${page.title})`)
  }

  cdp.close()
  if (cdp.exceptions.length) {
    console.error('Runtime exceptions:', JSON.stringify(cdp.exceptions))
    failed++
  }
  if (failed) process.exitCode = 1
} finally {
  await stopChild(chrome)
  server.httpServer.closeAllConnections?.()
  await new Promise((resolve) => server.httpServer.close(resolve))
  rmSync(profileDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 })
}
