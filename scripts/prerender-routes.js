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
    title: 'Tucker Craig - Software Engineer',
    description: 'Software engineer building my own tools with coding agents across Mac, Windows, iOS, and hardware: angl browser, winstream, Herdwick, Pace Bar, Dictation, Inkjoin, and omalo.',
    image: 'https://btuckerc.dev/og/home.jpg',
    imageAlt: 'Tucker Craig, software engineer. Building my own tools with coding agents.',
    type: 'website'
  },
  {
    route: '/workflow',
    title: 'How I build with AI - Tucker Craig',
    description: 'How I use coding agents to build and test my own apps across Mac, Windows, iOS, and hardware.',
    image: 'https://btuckerc.dev/og/workflow.jpg',
    imageAlt: 'Tucker Craig, workflow: how I build with AI.',
    type: 'article'
  },
  {
    route: '/about',
    title: 'About - Tucker Craig',
    description: "Hello, world! I'm Tucker. I build my own macOS browser, an iOS app for coding agents, local voice-to-text, quota tools, and firmware for omalo.",
    image: 'https://btuckerc.dev/og/about.jpg',
    imageAlt: "Tucker Craig, about. Hello, world! I'm Tucker.",
    type: 'website'
  },
  {
    route: '/projects',
    title: 'Projects - Tucker Craig',
    description: "Things I've built, big and small: angl browser, winstream, Herdwick, Inkjoin, Pace Bar, Dictation, CenterSeat, and more.",
    image: 'https://btuckerc.dev/og/projects.jpg',
    imageAlt: 'Tucker Craig, projects: angl browser, winstream, Herdwick, Inkjoin, Pace Bar, and more.',
    type: 'website'
  },
  {
    route: '/projects/omalo',
    title: 'omalo - a pocket companion running ichr',
    description: 'omalo is a pocket companion running ichr. Play Pokémon Emerald yourself, or hand off goals to an AI.',
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
    title: 'Contact - Tucker Craig',
    description: 'Get in touch with Tucker Craig via email, GitHub, LinkedIn, or the contact form.',
    image: 'https://btuckerc.dev/og/contact.jpg',
    imageAlt: 'Tucker Craig, contact. Say hello at btuckerc.dev@gmail.com.',
    type: 'website'
  },
  {
    route: '/privacy/flipping-seven-calculator',
    title: 'Privacy Policy - Flipping Seven Calculator',
    description: 'Privacy policy for Flipping Seven Calculator, an offline scorekeeper that collects no personal data.',
    image: 'https://btuckerc.dev/og/flipping-seven-privacy.jpg',
    imageAlt: 'Flipping Seven privacy: simple app, simple privacy.',
    type: 'website'
  },
  {
    route: '/privacy/herdwick',
    title: 'Privacy Policy - Herdwick',
    description: 'Privacy policy for Herdwick, an iOS client that connects over SSH to your own machines. I collect no data.',
    image: 'https://btuckerc.dev/og/herdwick-privacy.jpg',
    imageAlt: 'Herdwick privacy: your agents stay on your machines.',
    type: 'website'
  },
  {
    route: '/herdwick/support',
    title: 'Support - Herdwick',
    description: 'Help for Herdwick, the iPhone and iPad app for reading and answering coding agents on your own machines.',
    image: 'https://btuckerc.dev/og/herdwick-support.jpg',
    imageAlt: 'Herdwick support: coding agents on your phone.',
    type: 'website'
  },
  {
    route: '/privacy/inkjoin',
    title: 'Privacy Policy - Inkjoin',
    description: 'Privacy policy for Inkjoin, an iPhone logic puzzle game.',
    image: 'https://btuckerc.dev/og/inkjoin-privacy.jpg',
    imageAlt: 'Inkjoin privacy policy.',
    type: 'website'
  },
  {
    route: '/inkjoin/support',
    title: 'Support - Inkjoin',
    description: 'Help for Inkjoin, an iPhone logic puzzle game.',
    image: 'https://btuckerc.dev/og/inkjoin-support.jpg',
    imageAlt: 'Inkjoin support.',
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
