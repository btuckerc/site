import template from '../../../index.html?raw'
import { render, waitFor } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { describe, expect, it } from 'vitest'
import PageMeta from '../PageMeta'

describe('PageMeta navigation', () => {
  it('replaces the initial HTML metadata and clears case-study values on navigation', async () => {
    document.head.innerHTML = new DOMParser().parseFromString(template, 'text/html').head.innerHTML
    const view = render(
      <HelmetProvider>
        <PageMeta title="Case study" description="Case description" url="https://btuckerc.dev/projects/s3-amoled" type="article" image="https://btuckerc.dev/og/s3-amoled.jpg" />
      </HelmetProvider>
    )
    const check = async (title, url, type, image) => {
      await waitFor(() => {
        expect(document.title).toBe(title)
        for (const [selector, attribute, value] of [
          ['link[rel="canonical"]', 'href', url],
          ['meta[property="og:url"]', 'content', url],
          ['meta[property="og:type"]', 'content', type],
          ['meta[property="og:title"]', 'content', title],
          ['meta[property="og:image"]', 'content', image],
          ['meta[name="twitter:url"]', 'content', url],
          ['meta[name="twitter:title"]', 'content', title],
          ['meta[name="twitter:image"]', 'content', image]
        ]) {
          expect(document.head.querySelectorAll(selector)).toHaveLength(1)
          expect(document.head.querySelector(selector)).toHaveAttribute(attribute, value)
        }
      })
    }
    await check('Case study', 'https://btuckerc.dev/projects/s3-amoled', 'article', 'https://btuckerc.dev/og/s3-amoled.jpg')
    view.rerender(
      <HelmetProvider>
        <PageMeta title="Contact" description="Contact description" url="https://btuckerc.dev/contact" />
      </HelmetProvider>
    )
    await check('Contact', 'https://btuckerc.dev/contact', 'website', 'https://btuckerc.dev/og/home.jpg')
  })
})
