import { useEffect, useCallback } from 'react'
import { useFocusContext } from './useRovingFocus'

const prefersReducedMotion = () => (
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
)

export const useHotkeys = ({
  disabled = false,
  onCommandPalette,
  onSearch,
  onGoToTop,
  onGoToBottom,
  onEscape
}) => {
  const {
    moveHorizontal,
    moveVertical
  } = useFocusContext()

  const handleKeyDown = useCallback((event) => {
    // Suspend page shortcuts when disabled or while a modal dialog owns focus.
    if (
      disabled ||
      event.defaultPrevented ||
      event.isComposing ||
      event.keyCode === 229 ||
      event.metaKey ||
      event.ctrlKey ||
      event.altKey
    ) {
      return
    }

    const targetElement = event.target instanceof Element ? event.target : null
    if (targetElement?.closest('[role="dialog"][aria-modal="true"]')) {
      return
    }

    // Text fields and native media controls own their keyboard interactions.
    if (
      event.composedPath().some(node => node instanceof Element && node.matches('video, audio, select')) ||
      event.target.tagName === 'INPUT' ||
      event.target.tagName === 'TEXTAREA' ||
      event.target.isContentEditable
    ) {
      return
    }

    const isInFocusItem = Boolean(targetElement?.closest('[data-focus-item]'))

    switch (event.key) {
      // Vim and arrow navigation apply only while focused inside a registered list item.
      case 'h':
      case 'ArrowLeft':
        if (isInFocusItem && moveHorizontal('left')) {
          event.preventDefault()
        }
        break

      case 'l':
      case 'ArrowRight':
        if (isInFocusItem && moveHorizontal('right')) {
          event.preventDefault()
        }
        break

      case 'k':
      case 'ArrowUp':
        if (isInFocusItem && moveVertical('up')) {
          event.preventDefault()
        }
        break

      case 'j':
      case 'ArrowDown':
        if (isInFocusItem && moveVertical('down')) {
          event.preventDefault()
        }
        break

      // Special commands
      case ':':
        event.preventDefault()
        onCommandPalette?.()
        break

      case '/':
        event.preventDefault()
        onSearch?.()
        break

      case 'G':
      case 'g':
        if (event.shiftKey || event.key === 'G') {
          // Shift+G - go to bottom
          event.preventDefault()
          onGoToBottom?.()
        } else {
          // Check for double 'g' (gg)
          const now = Date.now()
          const lastG = window._lastGPress || 0
          window._lastGPress = now

          if (now - lastG < 500) {
            // Double g within 500ms
            event.preventDefault()
            onGoToTop?.()
            window._lastGPress = 0
          }
        }
        break

      case 'Escape':
        event.preventDefault()
        onEscape?.()
        break
    }
  }, [
    disabled,
    moveHorizontal,
    moveVertical,
    onCommandPalette,
    onSearch,
    onGoToTop,
    onGoToBottom,
    onEscape
  ])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}

// Hook for page-level scroll actions
export const useScrollTargets = () => {
  const scrollToTop = useCallback(() => {
    const behavior = prefersReducedMotion() ? 'auto' : 'smooth'
    window.scrollTo({ top: 0, behavior })
  }, [])

  const scrollToBottom = useCallback(() => {
    const behavior = prefersReducedMotion() ? 'auto' : 'smooth'
    window.scrollTo({ top: document.body.scrollHeight, behavior })
  }, [])

  return {
    scrollToTop,
    scrollToBottom
  }
}
