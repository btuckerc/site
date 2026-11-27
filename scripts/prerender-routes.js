import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import {
  HUB_URL,
  PERSON_ENTITY,
  ROUTES_META,
  SITE_URL,
  compareFeaturedProjects,
  getCanonicalUrl,
} from '../src/seo/routesMeta.js'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(scriptDirectory, '..')
const distRoot = join(repoRoot, 'dist')
const ssrRoot = join(repoRoot, 'dist-ssr')
const manifestPath = join(distRoot, '.vite', 'manifest.json')
const templatePath = join(distRoot, 'index.html')
const template = readFileSync(templatePath, 'utf8')
const projectsData = JSON.parse(readFileSync(join(repoRoot, 'data', 'projects.json'), 'utf8'))
const viteManifest = existsSync(manifestPath)
  ? JSON.parse(readFileSync(manifestPath, 'utf8'))
  : {}

const ROUTE_PAGE_ENTRIES = {
  '/': 'src/pages/Home.jsx',
  '/workflow': 'src/pages/Workflow.jsx',
  '/about': 'src/pages/About.jsx',
  '/projects': 'src/pages/Projects.jsx',
  '/projects/omalo': 'src/pages/Omalo.jsx',
  '/projects/s3-amoled': 'src/pages/S3Amoled.jsx',
  '/contact': 'src/pages/Contact.jsx',
  '/privacy/flipping-seven-calculator': 'src/pages/FlippingSevenPrivacy.jsx',
  '/privacy/herdwick': 'src/pages/HerdwickPrivacy.jsx',
  '/herdwick/support': 'src/pages/HerdwickSupport.jsx',
  '/privacy/inkjoin': 'src/pages/InkjoinPrivacy.jsx',
  '/inkjoin/support': 'src/pages/InkjoinSupport.jsx',
}

const collectRouteCss = (route) => {
  const entryKey = ROUTE_PAGE_ENTRIES[route]
  if (!entryKey || !viteManifest[entryKey]) return []
  const visited = new Set()
  const cssFiles = new Set()
  const walk = (key) => {
    if (!key || visited.has(key)) return
    visited.add(key)
    const chunk = viteManifest[key]
    if (!chunk) return
    for (const css of chunk.css || []) {
      cssFiles.add(`/${css.replace(/^\/+/, '')}`)
    }
    for (const imp of chunk.imports || []) {
      walk(imp)
    }
  }
  walk(entryKey)
  return [...cssFiles].filter((href) => !template.includes(`href="${href}"`))
}

const { render } = await import(pathToFileURL(join(ssrRoot, 'entry-server.js')).href)

const HEAD_BLOCK_RE = /<!--head-meta-start-->[\s\S]*?<!--head-meta-end-->/
const ROOT_DIV_RE = /<div id="root"><\/div>/

if (!HEAD_BLOCK_RE.test(template)) {
  throw new Error('Could not find <!--head-meta-start-->...<!--head-meta-end--> markers in dist/index.html')
}
if (!ROOT_DIV_RE.test(template)) {
  throw new Error('Could not find empty <div id="root"></div> in dist/index.html')
}

const decodeEntities = (text) =>
  text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&nbsp;/g, ' ')

const toAbsoluteUrl = (href) => {
  if (!href) return ''
  if (/^(?:https?:|mailto:|#)/i.test(href)) return href
  if (href.startsWith('/')) return `${SITE_URL}${href}`
  return `${SITE_URL}/${href}`
}

// Keep HTML entities intact during tag conversion so literal angle brackets
// such as "herdwick-&lt;random&gt;" are never mistaken for HTML tags.
const stripInlineEncoded = (html) =>
  html
    .replace(/<img\b[^>]*>/gi, (tag) => {
      const altMatch = tag.match(/\balt="([^"]+)"/i)
      const srcMatch = tag.match(/\bsrc="([^"]+)"/i)
      if (!altMatch || !altMatch[1].trim()) return ''
      const alt = altMatch[1].trim()
      const src = srcMatch ? toAbsoluteUrl(srcMatch[1]) : ''
      return src ? `![${alt}](${src})` : alt
    })
    .replace(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_m, href, label) => {
      const cleanLabel = stripInlineEncoded(label).trim()
      const target = toAbsoluteUrl(href)
      if (!cleanLabel) return ''
      if (!target || target.startsWith('#')) return cleanLabel
      return `[${cleanLabel}](${target})`
    })
    .replace(/<code\b[^>]*>([\s\S]*?)<\/code>/gi, (_m, inner) => `\`${stripInlineEncoded(inner).trim()}\``)
    .replace(/<strong\b[^>]*>([\s\S]*?)<\/strong>/gi, (_m, inner) => `**${stripInlineEncoded(inner).trim()}**`)
    .replace(/<em\b[^>]*>([\s\S]*?)<\/em>/gi, (_m, inner) => `*${stripInlineEncoded(inner).trim()}*`)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const convertTableToMarkdown = (tableHtml) => {
  const rows = [...tableHtml.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)]
    .map((match) =>
      [...match[1].matchAll(/<t[hd]\b[^>]*>([\s\S]*?)<\/t[hd]>/gi)].map((cell) =>
        stripInlineEncoded(cell[1]).replace(/\|/g, '\\|')
      )
    )
    .filter((row) => row.length > 0)

  if (rows.length === 0) return ''
  const [header, ...body] = rows
  const lines = [
    `| ${header.join(' | ')} |`,
    `| ${header.map(() => '---').join(' | ')} |`,
    ...body.map((row) => `| ${row.join(' | ')} |`),
  ]
  return `\n\n${lines.join('\n')}\n\n`
}

const dropEmptyHeadings = (markdown) => {
  const blocks = markdown.split(/\n{2,}/)
  const kept = []
  for (let i = 0; i < blocks.length; i += 1) {
    const block = blocks[i].trim()
    if (!block) continue
    const headingMatch = block.match(/^(#{1,6})\s+/)
    if (headingMatch) {
      const next = blocks[i + 1]?.trim()
      const nextHeadingMatch = next?.match(/^(#{1,6})\s+/)
      if (!next || (nextHeadingMatch && nextHeadingMatch[1].length <= headingMatch[1].length)) {
        continue
      }
    }
    if (kept[kept.length - 1] === block) continue
    kept.push(block)
  }
  return kept.join('\n\n')
}

const escapeRawAnglePlaceholders = (markdown) =>
  markdown
    .split(/(`[^`]*`)/g)
    .map((part, idx) => (idx % 2 === 1 ? part : part.replace(/<([a-zA-Z][a-zA-Z0-9_-]*)>/g, '\\<$1\\>')))
    .join('')

const htmlMainToMarkdown = (ssrHtml) => {
  const mainMatch = ssrHtml.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)
  if (!mainMatch) {
    throw new Error('SSR output missing <main> landmark')
  }

  let body = mainMatch[1]
  // Remove non-content UI chrome and media fallback text before converting tags.
  // Only strip leaf aria-hidden elements so inactive tab panels (e.g. workflow layers)
  // keep their full text in the Markdown twin.
  body = body
    .replace(/<nav\b[^>]*aria-label="Breadcrumb"[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<aside\b[^>]*class="story-nav-desktop"[^>]*>[\s\S]*?<\/aside>/gi, '')
    .replace(/<details\b[^>]*class="story-nav-mobile"[^>]*>[\s\S]*?<\/details>/gi, '')
    .replace(/<search\b[^>]*>[\s\S]*?<\/search>/gi, '')
    .replace(/<form\b[^>]*>[\s\S]*?<\/form>/gi, '')
    .replace(/<video\b[^>]*>[\s\S]*?<\/video>/gi, '')
    .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, '')
    .replace(/<button\b[^>]*>[\s\S]*?<\/button>/gi, '')
    .replace(/<([a-z0-9]+)\b[^>]*aria-hidden="true"[^>]*>[^<]*<\/\1>/gi, '')
    .replace(/<p\b[^>]*class="[^"]*(?:case-study-kicker|case-study-eyebrow|omalo-kicker|starter-capture-label)[^"]*"[^>]*>[\s\S]*?<\/p>/gi, '')

  // Convert tables before stripping tags
  body = body.replace(/<table\b[^>]*>[\s\S]*?<\/table>/gi, (match) => convertTableToMarkdown(match))

  // Convert headings (demote inner h1 since the Markdown document opens with # page.title)
  body = body.replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_m, level, inner) => {
    const text = stripInlineEncoded(inner)
    const mdLevel = Math.min(6, Number(level) === 1 ? 2 : Number(level))
    return text ? `\n\n${'#'.repeat(mdLevel)} ${text}\n\n` : ''
  })

  // Convert definition lists
  body = body.replace(/<dt\b[^>]*>([\s\S]*?)<\/dt>\s*<dd\b[^>]*>([\s\S]*?)<\/dd>/gi, (_m, dt, dd) => {
    const term = stripInlineEncoded(dt)
    const val = stripInlineEncoded(dd)
    return term && val ? `\n- **${term}**: ${val}` : ''
  })

  // Convert list items
  body = body.replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (_m, inner) => {
    const text = stripInlineEncoded(inner)
    return text ? `\n- ${text}` : ''
  })

  // Convert paragraphs and figcaptions
  body = body.replace(/<(?:p|figcaption)\b[^>]*>([\s\S]*?)<\/(?:p|figcaption)>/gi, (_m, inner) => {
    const text = stripInlineEncoded(inner)
    return text ? `\n\n${text}\n\n` : ''
  })

  // Preserve remaining standalone links (e.g. action link rows outside <p>)
  body = body.replace(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_m, href, label) => {
    const cleanLabel = stripInlineEncoded(label).trim()
    const target = toAbsoluteUrl(href)
    if (!cleanLabel || !target || target.startsWith('#')) return ''
    return `\n- [${cleanLabel}](${target})\n`
  })

  // Preserve informative standalone images with alt text
  body = body.replace(/<img\b[^>]*>/gi, (tag) => {
    const altMatch = tag.match(/\balt="([^"]+)"/i)
    const srcMatch = tag.match(/\bsrc="([^"]+)"/i)
    if (!altMatch || !altMatch[1].trim()) return ''
    const alt = altMatch[1].trim()
    const src = srcMatch ? toAbsoluteUrl(srcMatch[1]) : ''
    return src ? `\n\n![${alt}](${src})\n\n` : `\n\n${alt}\n\n`
  })

  // Strip remaining HTML tags FIRST, THEN decode entities so literal "<random>" survives intact.
  body = body
    .replace(/<\/(?:div|section|article|header|footer|ul|ol|dl|figure|blockquote)>/gi, '\n\n')
    .replace(/<\/(?:span|strong|em|code|small|label|dd|dt)>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')

  body = decodeEntities(body)

  const normalized = body
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  return escapeRawAnglePlaceholders(dropEmptyHeadings(normalized))
}

const buildProjectsCatalogMarkdown = () => {
  const sorted = [...projectsData].sort(compareFeaturedProjects)
  const lines = [
    '# Projects — Tucker Craig',
    '',
    `> Complete reviewed catalog of ${sorted.length} software, systems, iOS, macOS, Windows, and hardware projects by Tucker Craig.`,
    '',
    `Canonical: ${SITE_URL}/projects`,
    '',
  ]

  for (const project of sorted) {
    lines.push(`## ${project.title} (${project.year})`)
    lines.push('')
    lines.push(project.blurb)
    if (project.overview) {
      lines.push('')
      lines.push(project.overview)
    }
    if (project.stack?.length) {
      lines.push('')
      lines.push(`- **Stack**: ${project.stack.join(', ')}`)
    }
    if (project.features?.length) {
      lines.push('- **Highlights**:')
      for (const feature of project.features) {
        lines.push(`  - ${feature}`)
      }
    }
    const links = Object.entries(project.links || {}).filter(([, url]) => Boolean(url))
    if (links.length) {
      lines.push(`- **Links**: ${links.map(([label, url]) => `[${label}](${url})`).join(' · ')}`)
    }
    lines.push('')
  }

  return lines.join('\n').trim() + '\n'
}

const buildRouteMarkdown = (page, ssrHtml) => {
  if (page.route === '/projects') {
    return buildProjectsCatalogMarkdown()
  }

  const canonical = getCanonicalUrl(page.route)
  const extracted = htmlMainToMarkdown(ssrHtml)
  const lines = [
    `# ${page.title}`,
    '',
    `> ${page.description}`,
    '',
    `Canonical: ${canonical}`,
    '',
    extracted,
    '',
  ]
  return lines.join('\n').replace(/\n{3,}/g, '\n\n')
}

const buildLlmsTxt = () => {
  const projectCount = projectsData.length
  const sections = ['Core Pages', 'Case Studies', 'App Support & Privacy']
  const lines = [
    '# Tucker Craig — btuckerc.dev',
    '',
    '> Software engineering portfolio of Tucker Craig (Davidson College alumnus, GitHub @btuckerc, X @btuckercdev) featuring macOS, Windows, iOS, and ESP32-S3 hardware projects plus his multi-model coding-agent workflow.',
    '',
    '## Identity & Official Hub',
    `- [Tucker Craig Official Site & Bio](${HUB_URL}/): Canonical site, biography, verified profiles, and web archive (including /dino/ and /DIG101/).`,
    `- [tuckercraig.com llms.txt](${HUB_URL}/llms.txt): Agent index for tuckercraig.com.`,
    `- [Full Site Markdown Export](${SITE_URL}/llms-full.txt): Single-file Markdown corpus of all core pages and the complete ${projectCount}-project catalog.`,
    '',
  ]

  for (const section of sections) {
    const entries = ROUTES_META.filter((page) => page.llmsSection === section)
    if (!entries.length) continue
    lines.push(`## ${section}`)
    for (const page of entries) {
      const canonical = getCanonicalUrl(page.route)
      const mdUrl = `${SITE_URL}${page.mdPath}`
      const summary =
        page.route === '/projects'
          ? `Reviewed catalog of ${projectCount} software, systems, iOS, macOS, Windows, and music/hardware projects (open-source repos and local builds).`
          : page.llmsSummary
      lines.push(`- [${page.title}](${canonical}) ([Markdown](${mdUrl})): ${summary}`)
    }
    lines.push('')
  }

  lines.push('## Verified Profiles')
  lines.push(`- Official Site: ${HUB_URL}/`)
  lines.push('- GitHub: https://github.com/btuckerc')
  lines.push('- LinkedIn: https://www.linkedin.com/in/tucker-craig/')
  lines.push('- X: https://x.com/btuckercdev')
  lines.push('- Email: hello@tuckercraig.com (primary), btuckerc.dev@gmail.com (projects)')
  lines.push('')

  return lines.join('\n')
}

const buildSitemapXml = () => {
  const entries = ROUTES_META.map((page) => {
    const canonical = getCanonicalUrl(page.route)
    const lastmodLine = page.updated ? `\n    <lastmod>${page.updated}</lastmod>` : ''
    return `  <url>\n    <loc>${canonical}</loc>${lastmodLine}\n  </url>`
  })
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`
}

const markdownByRoute = new Map()

try {
  for (const page of ROUTES_META) {
    const { html, helmet } = await render(page.route)
    if (!html || !/<h1\b/i.test(html)) {
      throw new Error(`SSR render for ${page.route} produced no <h1>`)
    }
    if (html.includes('This page could not load')) {
      throw new Error(`SSR render for ${page.route} hit RouteErrorBoundary`)
    }
    const plainText = decodeEntities(html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
    if (plainText.length < 80) {
      throw new Error(`SSR render for ${page.route} produced unexpectedly thin text (${plainText.length} chars)`)
    }
    if (!helmet) {
      throw new Error(`SSR render for ${page.route} produced no Helmet metadata`)
    }

    const routeCssLinks = collectRouteCss(page.route).map(
      (href) => `<link rel="stylesheet" crossorigin href="${href}" />`
    )

    const headTags = [
      helmet.title.toString(),
      helmet.meta.toString(),
      helmet.link.toString(),
      helmet.script.toString(),
      ...routeCssLinks,
    ]
      .filter(Boolean)
      .join('\n    ')

    if (!headTags.includes('application/ld+json')) {
      throw new Error(`SSR render for ${page.route} missing JSON-LD structured data`)
    }

    const finalHtml = template
      .replace(HEAD_BLOCK_RE, () => `<!--head-meta-start-->\n    ${headTags}\n    <!--head-meta-end-->`)
      .replace(ROOT_DIV_RE, () => `<div id="root">${html}</div>`)

    // Emit single canonical HTML artifact per route so Cloudflare Pages
    // automatically 308-redirects trailing-slash variants to the canonical URL.
    const outputPath =
      page.route === '/'
        ? templatePath
        : join(distRoot, `${page.route.slice(1)}.html`)

    mkdirSync(dirname(outputPath), { recursive: true })
    writeFileSync(outputPath, finalHtml)

    // Emit sibling Markdown twin directly from rendered HTML / reviewed data
    const markdown = buildRouteMarkdown(page, html)
    markdownByRoute.set(page.route, markdown)
    const mdOutputPath = join(distRoot, page.mdPath.slice(1))
    mkdirSync(dirname(mdOutputPath), { recursive: true })
    writeFileSync(mdOutputPath, markdown)

    console.log(`✓ prerendered ${page.route} → ${outputPath} (+ ${page.mdPath})`)
  }

  // Emit llms.txt, llms-full.txt, and sitemap.xml
  const llmsTxt = buildLlmsTxt()
  writeFileSync(join(distRoot, 'llms.txt'), llmsTxt)

  const corpusHeader = [
    `# ${PERSON_ENTITY.name} — Complete Site Corpus (${SITE_URL})`,
    '',
    `> ${PERSON_ENTITY.description}`,
    '',
    `- Official Site: ${HUB_URL}/`,
    `- Portfolio: ${SITE_URL}/`,
    '- Email: hello@tuckercraig.com (primary), btuckerc.dev@gmail.com (projects)',
    `- Verified Profiles: ${PERSON_ENTITY.sameAs.join(', ')}`,
  ].join('\n')

  const llmsFullSections = [
    corpusHeader,
    ...ROUTES_META.map((page) => markdownByRoute.get(page.route)?.trim()).filter(Boolean),
  ]
  writeFileSync(join(distRoot, 'llms-full.txt'), llmsFullSections.join('\n\n---\n\n') + '\n')

  const sitemapXml = buildSitemapXml()
  writeFileSync(join(distRoot, 'sitemap.xml'), sitemapXml)

  console.log('✓ generated dist/llms.txt, dist/llms-full.txt, dist/sitemap.xml')
} finally {
  rmSync(ssrRoot, { recursive: true, force: true })
  rmSync(join(distRoot, '.vite'), { recursive: true, force: true })
}
