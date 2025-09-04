import { useEffect, useCallback, useRef } from 'react'
import { useFocusContext } from './useRovingFocus'

export const useHotkeys = ({ 
  onCommandPalette, 
  onSearch, 
  onGoToTop, 
  onGoToBottom,
  onEscape 
}) => {
  const { 
    moveHorizontal, 
    moveVertical, 
    activateItem,
    focusedContainer 
  } = useFocusContext()

  const handleKeyDown = useCallback((event) => {
    // Don't intercept if user is typing in an input
    if (event.target.tagName === 'INPUT' || 
        event.target.tagName === 'TEXTAREA' || 
        event.target.isContentEditable) {
      
      // Only allow Escape in inputs
      if (event.key === 'Escape' && onEscape) {
        event.preventDefault()
        onEscape()
      }
      return
    }

    switch (event.key) {
      // Vim navigation
      case 'h':
      case 'ArrowLeft':
        event.preventDefault()
        moveHorizontal('left')
        break
      
      case 'l':
      case 'ArrowRight':
        event.preventDefault()
        moveHorizontal('right')
        break
      
      case 'k':
      case 'ArrowUp':
        event.preventDefault()
        moveVertical('up')
        break
      
      case 'j':
      case 'ArrowDown':
        event.preventDefault()
        moveVertical('down')
        break
      
      // Activation
      case 'Enter':
      case ' ':
        if (focusedContainer) {
          event.preventDefault()
          activateItem()
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
      
      case 'g':
        if (event.shiftKey) {
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
    moveHorizontal, 
    moveVertical, 
    activateItem, 
    focusedContainer,
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

// Hook for individual components to register scroll targets
export const useScrollTargets = () => {
  const topRef = useRef(null)
  const bottomRef = useRef(null)

  const scrollToTop = useCallback(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' })
      topRef.current.focus()
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  const scrollToBottom = useCallback(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
      bottomRef.current.focus()
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    }
  }, [])

  return {
    topRef,
    bottomRef,
    scrollToTop,
    scrollToBottom
  }
}