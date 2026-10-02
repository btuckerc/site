import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(scriptDirectory, '..')
const distRoot = join(repoRoot, 'dist')
const templatePath = join(distRoot, 'index.html')
const template = readFileSync(templatePath, 'utf8')

const pages = [
  {
    route: '/',
    title: 'Tucker Craig — Software Engineer',
    description: 'Software engineer who likes building things that make everyday life a little easier. Right now: omalo, a pocket companion with Pokémon and an AI handoff.',
    image: 'https://btuckerc.dev/og/home.jpg',
    imageAlt: 'Tucker Craig, software engineer. I like building things that make everyday life a little easier.',
    type: 'website'
  },
  {
    route: '/about',
    title: 'About — Tucker Craig',
    description: "Hello, world! I'm Tucker. I build apps for my AI usage, my own voice-to-text, and AI agents on my phone, plus firmware for omalo.",
    image: 'https://btuckerc.dev/og/about.jpg',
    imageAlt: "Tucker Craig, about. Hello, world! I'm Tucker.",
    type: 'website'
  },
  {
    route: '/projects',
    title: 'Projects — Tucker Craig',
    description: 'Things Tucker Craig has built, big and small: Pace Bar, Herdwick, Dictation, CenterSeat, and more.',
    image: 'https://btuckerc.dev/og/projects.jpg',
    imageAlt: 'Tucker Craig, projects: Pace Bar, Herdwick, Dictation, CenterSeat, earcandy, and more.',
    type: 'website'
  },
  {
    route: '/projects/omalo',
    title: 'omalo — a pocket companion running ichr',
    description: 'omalo is a pocket companion running ichr. Pokémon Emerald runs on the device with an AI handoff for gameplay goals.',
    image: 'https://btuckerc.dev/media/omalo/share.jpg',
    imageAlt: 'omalo, a pocket companion running ichr, with Pokémon Emerald on omalo.',
    type: 'article'
  },
  {
    route: '/projects/s3-amoled',
    title: 'What happens when you hand Pokémon to an AI?',
    description: 'Inside omalo: a Pokémon battle handoff, checking what an agent actually did, and a tiny motion-controlled game.',
    image: 'https://btuckerc.dev/og/s3-amoled.jpg',
    imageAlt: 'omalo notes, s3-amoled: what happens when you hand Pokémon to an AI?',
    type: 'article'
  },
  {
    route: '/contact',
    title: 'Contact — Tucker Craig',
    description: 'Get in touch with Tucker Craig via email, GitHub, LinkedIn, or the contact form.',
    image: 'https://btuckerc.dev/og/contact.jpg',
    imageAlt: 'Tucker Craig, contact. Say hello at btuckerc.dev@gmail.com.',
    type: 'website'
  },
  {
    route: '/privacy/flipping-seven-calculator',
    title: 'Privacy Policy — Flipping Seven Calculator',
    description: 'Privacy policy for Flipping Seven Calculator, an offline scorekeeping utility that does not collect personal data.',
    image: 'https://btuckerc.dev/og/flipping-seven-privacy.jpg',
    imageAlt: 'Flipping Seven privacy: simple app, simple privacy.',
    type: 'website'
  },
  {
    route: '/privacy/herdwick',
    title: 'Privacy Policy — Herdwick',
    description: 'Privacy policy for Herdwick, an iOS client that connects over SSH to your own machines. The developer collects no data.',
    image: 'https://btuckerc.dev/og/herdwick-privacy.jpg',
    imageAlt: 'Herdwick privacy: your agents stay on your machines.',
    type: 'website'
  },
  {
    route: '/herdwick/support',
    title: 'Support — Herdwick',
    description: 'Help for Herdwick, the iPhone and iPad app for reading and answering coding agents on your own machines.',
    image: 'https://btuckerc.dev/og/herdwick-support.jpg',
    imageAlt: 'Herdwick support: coding agents on your phone.',
    type: 'website'
  }
]

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const replaceTag = (html, pattern, tag) => {
  if (!pattern.test(html)) {
    throw new Error(`Could not replace metadata tag: ${pattern}`)
  }
  return html.replace(pattern, tag)
}

const buildRouteHtml = (page) => {
  const canonical = `https://btuckerc.dev${page.route === '/' ? '/' : page.route}`
  const title = escapeHtml(page.title)
  const description = escapeHtml(page.description)
  const imageAlt = escapeHtml(page.imageAlt)
  const image = escapeHtml(page.image)
  const canonicalValue = escapeHtml(canonical)

  let html = template
  html = replaceTag(html, /<title(?: data-rh="true")?>[^<]*<\/title>/, `<title data-rh="true">${title}</title>`)
  html = replaceTag(html, /<meta name="title"[^>]*\/>/, `<meta name="title" content="${title}" data-rh="true" />`)
  html = replaceTag(html, /<meta name="description"[^>]*\/>/, `<meta name="description" content="${description}" data-rh="true" />`)
  html = replaceTag(html, /<meta property="og:type"[^>]*\/>/, `<meta property="og:type" content="${page.type}" data-rh="true" />`)
  html = replaceTag(html, /<meta property="og:url"[^>]*\/>/, `<meta property="og:url" content="${canonicalValue}" data-rh="true" />`)
  html = replaceTag(html, /<meta property="og:title"[^>]*\/>/, `<meta property="og:title" content="${title}" data-rh="true" />`)
  html = replaceTag(html, /<meta property="og:description"[^>]*\/>/, `<meta property="og:description" content="${description}" data-rh="true" />`)
  html = replaceTag(html, /<meta property="og:image"[^>]*\/>/, `<meta property="og:image" content="${image}" data-rh="true" />`)
  html = replaceTag(html, /<meta property="og:image:width"[^>]*\/>/, '<meta property="og:image:width" content="1200" data-rh="true" />')
  html = replaceTag(html, /<meta property="og:image:height"[^>]*\/>/, '<meta property="og:image:height" content="630" data-rh="true" />')
  html = replaceTag(html, /<meta property="og:image:alt"[^>]*\/>/, `<meta property="og:image:alt" content="${imageAlt}" data-rh="true" />`)
  html = replaceTag(html, /<meta name="twitter:card"[^>]*\/>/, '<meta name="twitter:card" content="summary_large_image" data-rh="true" />')
  html = replaceTag(html, /<meta name="twitter:url"[^>]*\/>/, `<meta name="twitter:url" content="${canonicalValue}" data-rh="true" />`)
  html = replaceTag(html, /<meta name="twitter:title"[^>]*\/>/, `<meta name="twitter:title" content="${title}" data-rh="true" />`)
  html = replaceTag(html, /<meta name="twitter:description"[^>]*\/>/, `<meta name="twitter:description" content="${description}" data-rh="true" />`)
  html = replaceTag(html, /<meta name="twitter:image"[^>]*\/>/, `<meta name="twitter:image" content="${image}" data-rh="true" />`)
  html = replaceTag(html, /<meta name="twitter:image:alt"[^>]*\/>/, `<meta name="twitter:image:alt" content="${imageAlt}" data-rh="true" />`)
  html = replaceTag(html, /<link rel="canonical"[^>]*\/>/, `<link rel="canonical" href="${canonicalValue}" data-rh="true" />`)
  return html
}

for (const page of pages) {
  const html = buildRouteHtml(page)
  const outputPaths = page.route === '/'
    ? [templatePath]
    : [
        join(distRoot, page.route.slice(1), 'index.html'),
        join(distRoot, `${page.route.slice(1)}.html`)
      ]

  outputPaths.forEach((outputPath) => {
    mkdirSync(dirname(outputPath), { recursive: true })
    writeFileSync(outputPath, html)
    console.log(`✓ prerendered ${page.route} → ${outputPath}`)
  })
}
