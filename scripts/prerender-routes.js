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
    description: 'Software engineer building omalo, a pocket companion running ichr, with Pokémon Emerald and an AI handoff for gameplay goals.',
    image: 'https://btuckerc.dev/media/omalo/share.jpg',
    imageAlt: 'omalo, a pocket companion running ichr, with Pokémon Emerald on omalo.',
    type: 'website'
  },
  {
    route: '/about',
    title: 'About — Tucker Craig',
    description: "Tucker Craig's software and hardware projects, from handheld games to music tools.",
    image: 'https://btuckerc.dev/og-image.jpg',
    imageAlt: 'Technical project card for s3-amoled, covering Pokémon, an AI handoff, and Grain.',
    type: 'website'
  },
  {
    route: '/projects',
    title: 'Projects — Tucker Craig',
    description: 'Selected public projects by Tucker Craig, with code and context where available.',
    image: 'https://btuckerc.dev/og-image.jpg',
    imageAlt: 'Technical project card for s3-amoled, covering Pokémon, an AI handoff, and Grain.',
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
    title: 's3-amoled — Pokémon, an AI handoff, and Grain',
    description: 'Technical notes for omalo, a pocket companion running ichr, with Pokémon gameplay, an AI handoff, and Grain.',
    image: 'https://btuckerc.dev/media/s3-amoled/share.jpg',
    imageAlt: 'Technical project card for s3-amoled, covering Pokémon, an AI handoff, and Grain.',
    type: 'article'
  },
  {
    route: '/contact',
    title: 'Contact — Tucker Craig',
    description: 'Get in touch with Tucker Craig via email, GitHub, LinkedIn, or the contact form.',
    image: 'https://btuckerc.dev/og-image.jpg',
    imageAlt: 'Technical project card for s3-amoled, covering Pokémon, an AI handoff, and Grain.',
    type: 'website'
  },
  {
    route: '/privacy/flipping-seven-calculator',
    title: 'Privacy Policy — Flipping Seven Calculator',
    description: 'Privacy policy for Flipping Seven Calculator, an offline scorekeeping utility that does not collect personal data.',
    image: 'https://btuckerc.dev/og-image.jpg',
    imageAlt: 'Technical project card for s3-amoled, covering Pokémon, an AI handoff, and Grain.',
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
