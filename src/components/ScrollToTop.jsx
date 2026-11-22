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

export const scrollToHashTarget = (hash, { instant = false } = {}) => {
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
    behavior: instant || prefersReducedMotion() ? 'instant' : 'smooth'
  })

  return true
}

const ScrollToTop = () => {
  const location = useLocation()
  const navigationType = useNavigationType()
  const previousPathname = useRef(location.pathname)
  const hasMountedRef = useRef(false)

  useEffect(() => {
    const isInitialLoad = !hasMountedRef.current
    hasMountedRef.current = true
    const pathnameChanged = previousPathname.current !== location.pathname
    previousPathname.current = location.pathname

    if (location.hash) {
      let cancelled = false
      let frameId = null
      let timeoutId = null
      let observer = null
      let resizeObserver = null
      let scrolledOnce = false
      // Jump directly on initial or cross-route hash navigation so deferred
      // sections passed along the way are not needlessly triggered by smooth scroll.
      const jumpImmediately = isInitialLoad || pathnameChanged

      const requestFrame = typeof window.requestAnimationFrame === 'function'
        ? (callback) => window.requestAnimationFrame(callback)
        : (callback) => window.setTimeout(callback, 0)
      const cancelFrame = typeof window.cancelAnimationFrame === 'function'
        ? (id) => window.cancelAnimationFrame(id)
        : (id) => window.clearTimeout(id)

      const onUserInteract = () => cleanup()

      const cleanup = () => {
        cancelled = true
        if (frameId !== null) cancelFrame(frameId)
        if (timeoutId !== null) window.clearTimeout(timeoutId)
        observer?.disconnect()
        resizeObserver?.disconnect()
        window.removeEventListener('wheel', onUserInteract)
        window.removeEventListener('touchstart', onUserInteract)
        window.removeEventListener('pointerdown', onUserInteract)
        window.removeEventListener('keydown', onUserInteract)
      }

      const attempt = () => {
        frameId = null
        if (cancelled) return
        if (scrollToHashTarget(location.hash, { instant: scrolledOnce || jumpImmediately })) {
          if (!scrolledOnce) {
            scrolledOnce = true
            observer?.disconnect()
            // Re-align if a lazy chunk above the hash target settles shortly after navigation.
            if (typeof ResizeObserver === 'function' && document.body) {
              let lastHeight = document.body.scrollHeight
              resizeObserver = new ResizeObserver(() => {
                if (cancelled) return
                const nextHeight = document.body.scrollHeight
                if (nextHeight !== lastHeight) {
                  lastHeight = nextHeight
                  scrollToHashTarget(location.hash, { instant: true })
                }
              })
              resizeObserver.observe(document.body)
              window.addEventListener('wheel', onUserInteract, { passive: true })
              window.addEventListener('touchstart', onUserInteract, { passive: true })
              window.addEventListener('pointerdown', onUserInteract, { passive: true })
              window.addEventListener('keydown', onUserInteract, { passive: true })
            } else {
              cleanup()
            }
          }
          return
        }
        frameId = requestFrame(attempt)
      }

      observer = typeof MutationObserver === 'function'
        ? new MutationObserver(() => {
            if (!scrolledOnce && frameId === null) frameId = requestFrame(attempt)
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
