import { useEffect } from 'react'

export const useKeyboardNavigation = (isOpen, onClose, onToggle, containerRef) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'Escape':
          if (isOpen && onClose) {
            event.preventDefault()
            onClose()
          }
          break
        case 'Enter':
        case ' ':
          if (onToggle && event.target === containerRef?.current) {
            event.preventDefault()
            onToggle()
          }
          break
        case 'ArrowDown':
          if (isOpen && containerRef?.current) {
            event.preventDefault()
            const focusableElements = containerRef.current.querySelectorAll(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )
            const currentIndex = Array.from(focusableElements).indexOf(document.activeElement)
            const nextIndex = (currentIndex + 1) % focusableElements.length
            focusableElements[nextIndex]?.focus()
          }
          break
        case 'ArrowUp':
          if (isOpen && containerRef?.current) {
            event.preventDefault()
            const focusableElements = containerRef.current.querySelectorAll(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )
            const currentIndex = Array.from(focusableElements).indexOf(document.activeElement)
            const prevIndex = currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1
            focusableElements[prevIndex]?.focus()
          }
          break
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose, onToggle, containerRef])
}