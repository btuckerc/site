import { useEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

const getHashId = (hash) => {
  if (!hash) return ''

  try {
    return decodeURIComponent(hash.slice(1))
  } catch {
    return hash.slice(1)
  }
}

const prefersReducedMotion = () => (
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
)

export const scrollToHashTarget = (hash) => {
  const id = getHashId(hash)
  if (!id) return false

  const target = document.getElementById(id)
  if (!target) return false

  const header = document.querySelector('.tui-site-chrome')
  const headerHeight = header?.getBoundingClientRect().height || 0
  const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 12

  window.scrollTo({
    top: Math.max(0, targetTop),
    left: 0,
    behavior: prefersReducedMotion() ? 'auto' : 'smooth'
  })

  return true
}

const ScrollToTop = () => {
  const location = useLocation()
  const navigationType = useNavigationType()
  const previousPathname = useRef(location.pathname)

  useEffect(() => {
    const pathnameChanged = previousPathname.current !== location.pathname
    previousPathname.current = location.pathname

    if (location.hash) {
      let cancelled = false
      let frameId = null
      let timeoutId = null
      let observer = null

      const requestFrame = typeof window.requestAnimationFrame === 'function'
        ? (callback) => window.requestAnimationFrame(callback)
        : (callback) => window.setTimeout(callback, 0)
      const cancelFrame = typeof window.cancelAnimationFrame === 'function'
        ? (id) => window.cancelAnimationFrame(id)
        : (id) => window.clearTimeout(id)

      const cleanup = () => {
        cancelled = true
        if (frameId !== null) cancelFrame(frameId)
        if (timeoutId !== null) window.clearTimeout(timeoutId)
        observer?.disconnect()
      }

      const attempt = () => {
        frameId = null
        if (cancelled) return
        if (scrollToHashTarget(location.hash)) {
          cleanup()
          return
        }
        frameId = requestFrame(attempt)
      }

      observer = typeof MutationObserver === 'function'
        ? new MutationObserver(() => {
            if (frameId === null) frameId = requestFrame(attempt)
          })
        : null
      observer?.observe(document.body, { childList: true, subtree: true })
      frameId = requestFrame(attempt)
      timeoutId = window.setTimeout(cleanup, 2000)

      return cleanup
    }

    // Let POP navigation keep the browser's back/forward restoration when it
    // is available. A pushed pathname starts at the top of its new page.
    if (!pathnameChanged || navigationType === 'POP') return undefined

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    return undefined
  }, [location.hash, location.pathname, navigationType])

  return null
}

export default ScrollToTop
