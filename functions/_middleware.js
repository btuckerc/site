import { wantsMarkdown } from '../src/seo/acceptMarkdown.js'

const MARKDOWN_ROUTES = {
  '/': '/index.md',
  '/workflow': '/workflow.md',
  '/about': '/about.md',
  '/projects': '/projects.md',
  '/projects/omalo': '/projects/omalo.md',
  '/projects/s3-amoled': '/projects/s3-amoled.md',
  '/contact': '/contact.md',
  '/privacy/flipping-seven-calculator': '/privacy/flipping-seven-calculator.md',
  '/privacy/herdwick': '/privacy/herdwick.md',
  '/herdwick/support': '/herdwick/support.md',
  '/privacy/inkjoin': '/privacy/inkjoin.md',
  '/inkjoin/support': '/inkjoin/support.md',
}

export async function onRequest(context) {
  const { request, env } = context
  const url = new URL(request.url)
  const host = url.hostname.toLowerCase()
  const isPreviewHost = host.endsWith('.pages.dev')
  const method = request.method.toUpperCase()
  const mdPath = MARKDOWN_ROUTES[url.pathname]

  if (!mdPath || (method !== 'GET' && method !== 'HEAD')) {
    const resp = await context.next()
    if (!isPreviewHost) return resp
    const out = new Response(resp.body, resp)
    out.headers.set('X-Robots-Tag', 'noindex, nofollow')
    return out
  }

  const canonicalUrl = `https://btuckerc.dev${url.pathname}`
  const accept = request.headers.get('Accept') || ''

  if (wantsMarkdown(accept)) {
    const assetUrl = new URL(mdPath, url.origin)
    // Fetch static Markdown unconditionally so an HTML ETag never triggers a cross-variant 304.
    const assetResp = await env.ASSETS.fetch(new Request(assetUrl.toString(), { method: 'GET' }))
    if (assetResp.ok) {
      const text = await assetResp.text()
      const approxTokens = Math.max(1, Math.ceil(new TextEncoder().encode(text).length / 4))
      const headers = new Headers()
      headers.set('Content-Type', 'text/markdown; charset=utf-8')
      headers.set('Vary', 'Accept')
      headers.set('Cache-Control', 'private, max-age=0, must-revalidate')
      headers.set('Content-Location', mdPath)
      headers.set('Link', `<${canonicalUrl}>; rel="canonical"`)
      headers.set('X-Markdown-Tokens', String(approxTokens))
      headers.set('X-Content-Type-Options', 'nosniff')
      headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
      if (isPreviewHost) {
        headers.set('X-Robots-Tag', 'noindex, nofollow')
      }
      return new Response(method === 'HEAD' ? null : text, {
        status: 200,
        headers,
      })
    }
  }

  const resp = await context.next()
  const out = new Response(resp.body, resp)
  out.headers.append('Vary', 'Accept')
  out.headers.set(
    'Link',
    `<${mdPath}>; rel="alternate"; type="text/markdown", </llms.txt>; rel="describedby"; type="text/markdown"`
  )
  out.headers.set('Cache-Control', 'public, max-age=0, must-revalidate')
  if (isPreviewHost) {
    out.headers.set('X-Robots-Tag', 'noindex, nofollow')
  }
  return out
}
