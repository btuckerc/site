import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme.jsx'

const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef()
  const selectedItemRef = useRef(null)
  const previousFocusRef = useRef(null)
  const skipFocusRestoreRef = useRef(false)
  const navigate = useNavigate()
  const { cycleTheme, theme } = useTheme()

  // Command definitions
  const commands = [
    // Navigation
    {
      id: 'home',
      title: 'go home',
      description: 'return to landing page',
      action: () => navigate('/'),
      focusTarget: '#main-content',
      keywords: ['home', 'landing', 'main', 'index']
    },
    {
      id: 'about',
      title: 'go to about',
      description: 'read the public about page',
      action: () => navigate('/about'),
      focusTarget: '#main-content',
      keywords: ['about', 'profile', 'bio', 'background', 'info']
    },
    {
      id: 'projects',
      title: 'go to projects',
      description: 'browse the project list',
      action: () => navigate('/projects'),
      focusTarget: '#main-content',
      keywords: ['projects', 'portfolio', 'work', 'code', 'repos']
    },
    {
      id: 'omalo',
      title: 'explore omalo',
      description: 'open the omalo product page',
      action: () => navigate('/projects/omalo'),
      focusTarget: '#main-content',
      keywords: ['omalo', 'ichr', 'pocket', 'companion', 'pokemon', 'device']
    },
    {
      id: 's3-amoled',
      title: 'open technical notes',
      description: 'read the omalo implementation notes',
      action: () => navigate('/projects/s3-amoled'),
      focusTarget: '#main-content',
      keywords: ['s3', 'amoled', 'pokemon', 'grain', 'handheld', 'firmware']
    },
    {
      id: 'contact',
      title: 'go to contact',
      description: 'get in touch',
      action: () => navigate('/contact'),
      focusTarget: '#main-content',
      keywords: ['contact', 'email', 'reach', 'message', 'form']
    },
    // Actions
    {
      id: 'search',
      title: 'search projects',
      description: 'jump to project search',
      action: () => {
        navigate('/projects', { state: { focusSearch: Date.now() } })
      },
      focusTarget: '[data-search-input]',
      keywords: ['search', 'find', 'filter', 'projects', 'query']
    },
    {
      id: 'github',
      title: 'open github',
      description: 'visit github profile',
      action: () => window.open('https://github.com/btuckerc', '_blank'),
      keywords: ['github', 'code', 'repos', 'profile', 'social']
    },
    {
      id: 'linkedin',
      title: 'open linkedin',
      description: 'visit linkedin profile',
      action: () => window.open('https://www.linkedin.com/in/tucker-craig/', '_blank'),
      keywords: ['linkedin', 'profile', 'professional', 'social']
    },
    {
      id: 'twitter',
      title: 'open x',
      description: 'visit x profile',
      action: () => window.open('https://x.com/btuckercdev', '_blank'),
      keywords: ['twitter', 'x', 'social', 'profile']
    },
    {
      id: 'instagram',
      title: 'open instagram',
      description: 'visit instagram profile',
      action: () => window.open('https://www.instagram.com/btuckerc.dev/', '_blank'),
      keywords: ['instagram', 'ig', 'social', 'profile']
    },
    // Theme
    {
      id: 'theme',
      title: 'cycle theme',
      description: `current: ${theme}`,
      action: () => cycleTheme(),
      keywords: ['theme', 'dark', 'light', 'amber', 'color', 'mode']
    }
  ]

  // Fuzzy search implementation
  const fuzzyMatch = (text, query) => {
    if (!query) return true
    
    const queryLower = query.toLowerCase()
    const textLower = text.toLowerCase()
    
    let queryIndex = 0
    let score = 0
    
    for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
      if (textLower[i] === queryLower[queryIndex]) {
        queryIndex++
        score += 1
      }
    }
    
    return queryIndex === queryLower.length ? score : 0
  }

  const filteredCommands = commands
    .map(cmd => ({
      ...cmd,
      score: Math.max(
        fuzzyMatch(cmd.title, query),
        fuzzyMatch(cmd.description, query),
        ...cmd.keywords.map(k => fuzzyMatch(k, query))
      )
    }))
    .filter(cmd => cmd.score > 0)
    .sort((a, b) => b.score - a.score)

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      const activeElement = document.activeElement
      previousFocusRef.current = activeElement instanceof HTMLElement ? activeElement : null
      inputRef.current?.focus()
      return
    }

    const previousFocus = previousFocusRef.current
    previousFocusRef.current = null
    if (!skipFocusRestoreRef.current && previousFocus?.isConnected) {
      window.requestAnimationFrame(() => {
        if (previousFocus.isConnected) previousFocus.focus()
      })
    }
    skipFocusRestoreRef.current = false
  }, [isOpen])

  // Scroll selected item into view
  useEffect(() => {
    if (selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      })
    }
  }, [selectedIndex])

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < filteredCommands.length - 1 ? prev + 1 : 0
        )
        break
      
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredCommands.length - 1
        )
        break
      
      case 'Enter':
        e.preventDefault()
        if (filteredCommands[selectedIndex]) {
          executeCommand(filteredCommands[selectedIndex])
        }
        break
      
      case 'Escape':
        e.preventDefault()
        closePalette()
        break
    }
  }

  const closePalette = ({ restoreFocus = true } = {}) => {
    if (!restoreFocus) skipFocusRestoreRef.current = true
    onClose()
  }

  const focusDestination = (selector) => {
    if (!selector) return

    let frameId
    let timeoutId
    let observer

    const cleanup = () => {
      if (frameId) window.cancelAnimationFrame(frameId)
      if (timeoutId) window.clearTimeout(timeoutId)
      observer?.disconnect()
    }

    const tryFocus = () => {
      const target = document.querySelector(selector)
      if (!(target instanceof HTMLElement)) return false
      target.focus()
      cleanup()
      return true
    }

    const retry = () => {
      if (tryFocus()) return
      frameId = window.requestAnimationFrame(retry)
    }

    // Let the route commit before looking for its main landmark or search field.
    frameId = window.requestAnimationFrame(retry)
    if (typeof MutationObserver === 'function') {
      observer = new MutationObserver(tryFocus)
      observer.observe(document.body, { childList: true, subtree: true })
    }
    timeoutId = window.setTimeout(cleanup, 1200)
  }

  const executeCommand = (command) => {
    command.action()
    if (command.focusTarget) {
      closePalette({ restoreFocus: false })
      focusDestination(command.focusTarget)
    } else {
      closePalette()
    }
    setQuery('') // Clear query for next time
  }

  // Remember query in session storage
  useEffect(() => {
    const saved = sessionStorage.getItem('command-palette-query')
    if (saved) {
      setQuery(saved)
    }
  }, [])

  useEffect(() => {
    if (query) {
      sessionStorage.setItem('command-palette-query', query)
    }
  }, [query])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => closePalette()}
            className="fixed inset-0 tui-scrim backdrop-blur-sm z-50"
          />
          
          {/* Palette */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
              className="w-full max-w-lg pointer-events-auto"
              role="dialog"
              aria-modal="true"
              aria-labelledby="command-palette-title"
            >
              <div className="tui-palette-panel border border-line shadow-2xl overflow-hidden">
              <div className="p-4 border-b border-line">
                <h2 id="command-palette-title" className="sr-only">
                  Command Palette
                </h2>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  aria-label="Search commands"
                  placeholder="type command..."
                  className="w-full bg-transparent border-none outline-none text-fg placeholder-muted text-base font-mono"
                />
              </div>
              
              <div className="max-h-80 overflow-y-auto">
                {filteredCommands.length > 0 ? (
                  filteredCommands.map((command, index) => (
                    <button
                      key={command.id}
                      ref={index === selectedIndex ? selectedItemRef : null}
                      onClick={() => executeCommand(command)}
                      className={`
                        w-full text-left px-4 py-3 border-none bg-transparent font-mono
                        hover:bg-hover-bg transition-colors
                        ${index === selectedIndex ? 'bg-active-bg' : ''}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-accent text-sm">
                          {index === selectedIndex ? '▸' : ' '}
                        </div>
                        <div className="flex-1">
                          <div className="text-fg font-medium text-sm">
                            {command.title}
                          </div>
                          <div className="text-muted text-xs">
                            {command.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-muted font-mono text-sm">
                    no commands found
                  </div>
                )}
              </div>
              
              <div className="px-4 py-3 border-t border-line text-xs text-muted flex gap-4 font-mono">
                <span><kbd>↑↓</kbd> navigate</span>
                <span><kbd>↵</kbd> select</span>
                <button
                  onClick={() => closePalette()}
                  className="ml-auto hover:text-accent transition-colors flex items-center gap-1"
                  aria-label="Close command palette"
                >
                  <kbd>esc</kbd> close
                </button>
              </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CommandPalette
