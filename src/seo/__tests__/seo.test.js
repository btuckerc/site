// @vitest-environment node
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { wantsMarkdown } from '../acceptMarkdown'
import {
  HUB_URL,
  PERSON_ID,
  ROUTES_META,
  WEBSITE_ID,
  buildStructuredData,
  getCanonicalUrl,
} from '../entity'
import { render } from '../../entry-server.jsx'
import { onRequest } from '../../../functions/_middleware.js'

const repoRoot = join(fileURLToPath(new URL('../../..', import.meta.url)))

describe('wantsMarkdown Accept negotiation (RFC 9110)', () => {
  it('defaults to HTML for empty, wildcard, lower-priority, and malformed Accept headers', () => {
    expect(wantsMarkdown('')).toBe(false)
    expect(wantsMarkdown(null)).toBe(false)
    expect(wantsMarkdown('*/*')).toBe(false)
    expect(wantsMarkdown('text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8')).toBe(false)
    expect(wantsMarkdown('text/markdown;q=0, */*;q=1')).toBe(false)
    expect(wantsMarkdown('text/html;q=0.9, text/markdown;q=0.5')).toBe(false)
    expect(wantsMarkdown('text/markdown;q=0.2, text/*;q=1')).toBe(false)
    expect(wantsMarkdown('text/markdown;q=0.1, */*')).toBe(false)
    expect(wantsMarkdown('text/markdown;q=1e0')).toBe(false)
    expect(wantsMarkdown('text/markdown;q=')).toBe(false)
    expect(wantsMarkdown('text/markdown;q=invalid')).toBe(false)
    expect(wantsMarkdown('application/json; profile="before,text/markdown,after", text/html')).toBe(false)
    expect(wantsMarkdown('text/markdown;charset=utf-8;q=0, text/markdown;q=1, text/html;q=0.5')).toBe(false)
    expect(wantsMarkdown('text/markdown;charset=iso-8859-1, text/html;q=0.5')).toBe(false)
    expect(wantsMarkdown('text/markdown;variant=GFM, text/html;q=0.9')).toBe(false)
  })

  it('selects Markdown only when text/markdown is explicitly accepted with valid q >= effective htmlQ', () => {
    expect(wantsMarkdown('text/markdown')).toBe(true)
    expect(wantsMarkdown('text/markdown, text/html;q=0.8')).toBe(true)
    expect(wantsMarkdown('text/html;q=0.8, text/markdown;q=0.8')).toBe(true)
    expect(wantsMarkdown('text/markdown;q=0.9, text/*;q=0.5')).toBe(true)
    expect(wantsMarkdown('text/markdown; charset=utf-8; q=0.9, text/html; q=0.5')).toBe(true)
    expect(wantsMarkdown('text/markdown;q=1., text/html;q=0.5')).toBe(true)
  })
})

describe('Structured data entity graph', () => {
  it('connects all 12 routes to the shared canonical Person @id and WebSite @id', () => {
    expect(ROUTES_META).toHaveLength(12)
    for (const meta of ROUTES_META) {
      const data = buildStructuredData(meta.route)
      expect(data['@context']).toBe('https://schema.org')
      const graph = data['@graph']
      const person = graph.find((node) => node['@id'] === PERSON_ID)
      const website = graph.find((node) => node['@id'] === WEBSITE_ID)
      expect(person).toBeTruthy()
      expect(person.url).toBe(`${HUB_URL}/`)
      expect(person.sameAs).toContain('https://btuckerc.dev/')
      expect(website).toBeTruthy()
      expect(website.author['@id']).toBe(PERSON_ID)
      if (meta.breadcrumbs?.length) {
        const breadcrumb = graph.find((node) => node['@type'] === 'BreadcrumbList')
        expect(breadcrumb).toBeTruthy()
        expect(breadcrumb.itemListElement.length).toBe(meta.breadcrumbs.length)
      }
    }
  })

  it('classifies Inkjoin consistently as GameApplication across /projects and /inkjoin/support', () => {
    const projectsGraph = buildStructuredData('/projects')['@graph']
    const collection = projectsGraph.find((node) => node['@type'] === 'CollectionPage')
    const inkjoinInCatalog = collection.mainEntity.itemListElement.find(
      (el) => el.item.name === 'Inkjoin'
    )
    const supportGraph = buildStructuredData('/inkjoin/support')['@graph']
    const inkjoinSupportApp = supportGraph.find((node) => node['@type'] === 'SoftwareApplication')
    expect(inkjoinInCatalog.item.applicationCategory).toBe('GameApplication')
    expect(inkjoinSupportApp.applicationCategory).toBe('GameApplication')

    const musicInCatalog = collection.mainEntity.itemListElement.find((el) => el.item.name === 'Music')
    expect(musicInCatalog.item.url).toBe('https://soundcloud.com/tuxix')
  })
})

describe('Cloudflare Pages config hygiene', () => {
  it('uses only valid Cloudflare Pages _routes.json patterns (no suffix wildcards)', () => {
    const routesJson = JSON.parse(readFileSync(join(repoRoot, 'public', '_routes.json'), 'utf8'))
    for (const rule of [...routesJson.include, ...routesJson.exclude]) {
      if (rule.includes('*')) {
        expect(rule.endsWith('*')).toBe(true)
      }
    }
  })

  it('defines a single Markdown Content-Type rule and canonical Link headers for all 12 .md routes', () => {
    const headersFile = readFileSync(join(repoRoot, 'public', '_headers'), 'utf8')
    const mdContentTypeMatches = headersFile.match(/^\/.*\*\.md$/gm) || []
    expect(mdContentTypeMatches).toEqual(['/*.md'])
    for (const meta of ROUTES_META) {
      expect(headersFile).toContain(`${meta.mdPath}\n  Link: <${getCanonicalUrl(meta.route)}>; rel="canonical"`)
    }
  })
})

describe('SSR entry-server rendering', () => {
  it('renders non-empty body HTML and Helmet metadata for every route', async () => {
    for (const meta of ROUTES_META) {
      const { html, helmet } = await render(meta.route)
      expect(html).toMatch(/<h1\b/i)
      expect(html).not.toContain('This page could not load')
      expect(helmet.link.toString()).toContain(`href="${getCanonicalUrl(meta.route)}"`)
      expect(helmet.link.toString()).toContain(`href="https://btuckerc.dev${meta.mdPath}"`)
      expect(helmet.script.toString()).toContain('application/ld+json')
      expect(helmet.script.toString()).toContain(PERSON_ID)
    }
  })
})

describe('Pages Functions _middleware.js negotiation', () => {
  const makeContext = (url, headers = {}, method = 'GET') => ({
    request: new Request(url, { method, headers }),
    env: {
      ASSETS: {
        fetch: async (req) => {
          const reqUrl = new URL(req.url)
          if (reqUrl.pathname === '/about.md') {
            return new Response('# About Tucker Craig\n\nSoftware engineer.', {
              status: 200,
              headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
            })
          }
          return new Response('Not found', { status: 404 })
        },
      },
    },
    next: async () =>
      new Response('<html><body><h1>About</h1></body></html>', {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      }),
  })

  it('serves HTML with Vary and Link discovery headers by default and when wildcard beats markdown', async () => {
    const resp = await onRequest(makeContext('https://btuckerc.dev/about', { Accept: 'text/html' }))
    expect(resp.status).toBe(200)
    expect(resp.headers.get('Content-Type')).toContain('text/html')
    expect(resp.headers.get('Vary')).toContain('Accept')
    expect(resp.headers.get('Link')).toContain('/about.md')
    expect(resp.headers.get('X-Robots-Tag')).toBeNull()

    const wildResp = await onRequest(
      makeContext('https://btuckerc.dev/about', { Accept: 'text/markdown;q=0.2, text/*;q=1' })
    )
    expect(wildResp.headers.get('Content-Type')).toContain('text/html')
  })

  it('serves Markdown on Accept: text/markdown with private cache and ignores HTML If-None-Match', async () => {
    const resp = await onRequest(
      makeContext('https://btuckerc.dev/about', {
        Accept: 'text/markdown',
        'If-None-Match': '"html-etag-123"',
      })
    )
    expect(resp.status).toBe(200)
    expect(resp.headers.get('Content-Type')).toBe('text/markdown; charset=utf-8')
    expect(resp.headers.get('Vary')).toBe('Accept')
    expect(resp.headers.get('Cache-Control')).toBe('private, max-age=0, must-revalidate')
    expect(resp.headers.get('Link')).toBe('<https://btuckerc.dev/about>; rel="canonical"')
    expect(Number(resp.headers.get('X-Markdown-Tokens'))).toBeGreaterThan(0)
    expect(await resp.text()).toContain('# About Tucker Craig')
  })

  it('returns empty body on HEAD Markdown request and noindex on pages.dev', async () => {
    const resp = await onRequest(
      makeContext('https://site-9ab.pages.dev/about', { Accept: 'text/markdown' }, 'HEAD')
    )
    expect(resp.status).toBe(200)
    expect(resp.headers.get('X-Robots-Tag')).toBe('noindex, nofollow')
    expect(await resp.text()).toBe('')
  })
})
