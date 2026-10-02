// Renders the Open Graph / Twitter share cards in public/og/ from
// scripts/share-cards/card.html with headless Chrome over the DevTools protocol.
// Not part of `npm run build`: run it after changing card copy, then commit the JPGs.
//
//   CHROME_BIN=/path/to/chrome node scripts/render-share-cards.js
// Set CHROME_NO_SANDBOX=1 where Chrome's sandbox is unavailable (e.g. Ubuntu with
// AppArmor user-namespace restrictions); the page is a trusted local template.
import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const outputDir = join(repoRoot, 'public', 'og')
const templateUrl = pathToFileURL(join(repoRoot, 'scripts', 'share-cards', 'card.html')).href
const projects = JSON.parse(readFileSync(join(repoRoot, 'data', 'projects.json'), 'utf8'))

const featuredProjects = ['pace-bar', 'herdwick', 'dictation', 'center-seat', 'earcandy']
const projectTitle = (id) => {
  const project = projects.find(entry => entry.id === id)
  if (!project) throw new Error(`Unknown featured project: ${id}`)
  return project.title
}

const cards = [
  {
    slug: 'home',
    path: '/',
    title: 'Tucker Craig',
    tag: 'Software Engineer',
    context: [
      { text: 'I like building things that make everyday life a little easier.', strong: true },
      { text: 'Right now: firmware for omalo, a pocket companion with Pokémon and an AI handoff.' }
    ],
    hint: 'say hi →'
  },
  {
    slug: 'about',
    path: '/about',
    title: 'Tucker Craig',
    bracket: 'about',
    context: [
      { text: 'Hello, world! I’m Tucker.', strong: true },
      { text: 'Apps for my AI usage, my own voice-to-text, and AI agents on my phone.' },
      { text: 'I stream on Twitch and sang acapella at Davidson.' }
    ],
    hint: 'more about me →'
  },
  {
    slug: 'projects',
    path: '/projects',
    title: 'Tucker Craig',
    bracket: 'projects',
    context: [{ text: 'Things I’ve built, big and small.', strong: true }],
    list: [
      ...featuredProjects.map(id => ({ text: projectTitle(id) })),
      { text: `+ ${projects.length - featuredProjects.length} more`, more: true }
    ],
    hint: 'browse →'
  },
  {
    slug: 'contact',
    path: '/contact',
    title: 'Tucker Craig',
    bracket: 'contact',
    context: [
      { text: 'Say hello.', strong: true },
      { text: 'btuckerc.dev@gmail.com' },
      { text: 'GitHub · LinkedIn · or the contact form' }
    ],
    hint: 'get in touch →'
  },
  {
    slug: 's3-amoled',
    path: '/projects/s3-amoled',
    eyebrow: 'Tucker Craig',
    title: 'omalo notes',
    bracket: 's3-amoled',
    context: [
      { text: 'What happens when you hand Pokémon to an AI?', strong: true },
      { text: 'A battle handoff, checking what the agent actually did, and a tiny motion-controlled game.' }
    ],
    hint: 'read →'
  },
  {
    slug: 'herdwick-support',
    path: '/herdwick/support',
    eyebrow: 'Tucker Craig',
    title: 'Herdwick',
    bracket: 'support',
    context: [
      { text: 'Coding agents on your phone.', strong: true },
      { text: 'Read what they did and answer them from your iPhone or iPad.' }
    ],
    hint: 'get help →'
  },
  {
    slug: 'herdwick-privacy',
    path: '/privacy/herdwick',
    eyebrow: 'Tucker Craig',
    title: 'Herdwick',
    bracket: 'privacy',
    context: [
      { text: 'Your agents stay on your machines.', strong: true },
      { text: 'Herdwick connects to them directly over SSH. The developer collects and stores no data.' }
    ],
    hint: 'read the policy →'
  },
  {
    slug: 'flipping-seven-privacy',
    path: '/privacy/flipping-seven-calculator',
    eyebrow: 'Tucker Craig',
    title: 'Flipping Seven',
    bracket: 'privacy',
    context: [
      { text: 'Simple app. Simple privacy.', strong: true },
      { text: 'An offline scorekeeper. No personal data is collected, transmitted, or shared.' }
    ],
    hint: 'read the policy →'
  }
]

const findChrome = () => {
  const candidates = [
    process.env.CHROME_BIN,
    'google-chrome',
    'google-chrome-stable',
    'chromium',
    'chromium-browser',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
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
    await new Promise(resolve => setTimeout(resolve, 50))
  }
  throw new Error(`Timed out waiting for ${path}`)
}

const connect = (url) => new Promise((resolve, reject) => {
  const socket = new WebSocket(url)
  let nextId = 0
  const pending = new Map()
  const listeners = new Set()
  socket.addEventListener('message', ({ data }) => {
    const message = JSON.parse(data)
    if (message.id && pending.has(message.id)) {
      const { resolve: done, reject: fail } = pending.get(message.id)
      pending.delete(message.id)
      if (message.error) fail(new Error(`${message.error.message} (${message.error.code})`))
      else done(message.result)
      return
    }
    listeners.forEach(listener => listener(message))
  })
  socket.addEventListener('error', () => reject(new Error(`Could not connect to ${url}`)))
  socket.addEventListener('open', () => resolve({
    send: (method, params = {}, sessionId) => new Promise((done, fail) => {
      const id = ++nextId
      pending.set(id, { resolve: done, reject: fail })
      socket.send(JSON.stringify({ id, method, params, sessionId }))
    }),
    once: (method, sessionId) => new Promise((done) => {
      const listener = (message) => {
        if (message.method === method && message.sessionId === sessionId) {
          listeners.delete(listener)
          done(message.params)
        }
      }
      listeners.add(listener)
    }),
    close: () => socket.close()
  }))
})

const profileDir = mkdtempSync(join(tmpdir(), 'share-cards-'))
const chrome = spawn(findChrome(), [
  '--headless=new',
  '--remote-debugging-port=0',
  `--user-data-dir=${profileDir}`,
  '--allow-file-access-from-files',
  '--hide-scrollbars',
  '--no-first-run',
  '--no-default-browser-check',
  ...(process.env.CHROME_NO_SANDBOX === '1' ? ['--no-sandbox'] : [])
], { stdio: 'ignore' })

try {
  const [port, browserPath] = (await waitForFile(join(profileDir, 'DevToolsActivePort'), 15000)).trim().split('\n')
  const cdp = await connect(`ws://127.0.0.1:${port}${browserPath}`)
  const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' })
  const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true })
  await cdp.send('Page.enable', {}, sessionId)
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false }, sessionId)

  const loaded = cdp.once('Page.loadEventFired', sessionId)
  await cdp.send('Page.navigate', { url: templateUrl }, sessionId)
  await loaded

  mkdirSync(outputDir, { recursive: true })
  for (const card of cards) {
    const { result, exceptionDetails } = await cdp.send('Runtime.evaluate', {
      expression: `window.renderCard(${JSON.stringify(card)})`,
      awaitPromise: true,
      returnByValue: true
    }, sessionId)
    if (exceptionDetails) throw new Error(`Rendering ${card.slug} failed: ${exceptionDetails.text}`)
    if (result.value !== true) throw new Error(`Rendering ${card.slug}: PP Neue Montreal did not load`)

    const { data } = await cdp.send('Page.captureScreenshot', {
      format: 'jpeg',
      quality: 88,
      clip: { x: 0, y: 0, width: 1200, height: 630, scale: 1 }
    }, sessionId)
    const outputPath = join(outputDir, `${card.slug}.jpg`)
    writeFileSync(outputPath, Buffer.from(data, 'base64'))
    console.log(`✓ ${card.path} → public/og/${card.slug}.jpg`)
  }
  cdp.close()
} finally {
  chrome.kill()
  rmSync(profileDir, { recursive: true, force: true })
}
