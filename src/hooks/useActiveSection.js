import { useEffect, useState } from 'react'

// Tracks the section nearest the header activation line by caching document
// offsets and recomputing them only on layout changes, so steady scrolling
// performs zero getBoundingClientRect() calls.
export const useActiveSection = (sectionIds, activationLine = 140) => {
  const initialId = sectionIds[0] || ''
  const [activeSection, setActiveSection] = useState(initialId)
  const key = sectionIds.join('|')

  useEffect(() => {
    const ids = key ? key.split('|') : []
    if (ids.length === 0) return undefined

    let cachedOffsets = []
    let cachedDocHeight = 0
    let rafId = null
    let needsMeasure = false

    const measure = () => {
      const scrollY = window.scrollY || 0
      cachedOffsets = ids
        .map((id) => {
          const node = document.getElementById(id)
          if (!node) return null
          return { id, top: node.getBoundingClientRect().top + scrollY }
        })
        .filter(Boolean)
      cachedDocHeight = document.documentElement?.scrollHeight || 0
    }

    const updateFromCache = () => {
      rafId = null
      if (needsMeasure || cachedOffsets.length !== ids.length) {
        needsMeasure = false
        measure()
      }
      if (cachedOffsets.length === 0) return

      const threshold = (window.scrollY || 0) + activationLine
      const atBottom =
        cachedDocHeight > 0 &&
        window.innerHeight > 0 &&
        (window.scrollY || 0) + window.innerHeight >= cachedDocHeight - 24
      if (atBottom) {
        const lastId = cachedOffsets[cachedOffsets.length - 1].id
        setActiveSection((prev) => (prev === lastId ? prev : lastId))
        return
      }

      let current = cachedOffsets[0].id
      for (const entry of cachedOffsets) {
        if (entry.top <= threshold) {
          current = entry.id
        } else {
          break
        }
      }
      setActiveSection((prev) => (prev === current ? prev : current))
    }

    const scheduleFrame = () => {
      if (rafId !== null) return
      let pending = true
      const run = () => {
        pending = false
        rafId = null
        updateFromCache()
      }
      const id = typeof window.requestAnimationFrame === 'function'
        ? window.requestAnimationFrame(run)
        : window.setTimeout(run, 0)
      if (pending) rafId = id
    }

    const handleLayoutChange = () => {
      needsMeasure = true
      scheduleFrame()
    }

    measure()
    updateFromCache()
    window.addEventListener('scroll', scheduleFrame, { passive: true })
    window.addEventListener('resize', handleLayoutChange, { passive: true })

    let resizeObserver = null
    if (typeof ResizeObserver === 'function' && document.body) {
      resizeObserver = new ResizeObserver(handleLayoutChange)
      resizeObserver.observe(document.body)
    }

    return () => {
      window.removeEventListener('scroll', scheduleFrame)
      window.removeEventListener('resize', handleLayoutChange)
      resizeObserver?.disconnect()
      if (rafId !== null) {
        if (typeof window.cancelAnimationFrame === 'function') {
          window.cancelAnimationFrame(rafId)
        } else {
          window.clearTimeout(rafId)
        }
      }
    }
  }, [key, activationLine])

  return activeSection
}
