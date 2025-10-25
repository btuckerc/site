import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme.jsx'

const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef()
  const selectedItemRef = useRef(null)
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
      keywords: ['home', 'landing', 'main', 'index']
    },
    {
      id: 'about',
      title: 'go to about',
      description: 'view profile and background',
      action: () => navigate('/about'),
      keywords: ['about', 'profile', 'bio', 'background', 'info']
    },
    {
      id: 'projects',
      title: 'go to projects',
      description: 'browse project portfolio',
      action: () => navigate('/projects'),
      keywords: ['projects', 'portfolio', 'work', 'code', 'repos']
    },
    {
      id: 'contact',
      title: 'go to contact',
      description: 'get in touch',
      action: () => navigate('/contact'),
      keywords: ['contact', 'email', 'reach', 'message', 'form']
    },
    // Actions
    {
      id: 'search',
      title: 'search projects',
      description: 'focus project search input',
      action: () => {
        navigate('/projects')
        setTimeout(() => {
          const searchInput = document.querySelector('[data-search-input]')
          if (searchInput) searchInput.focus()
        }, 100)
      },
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
      action: () => window.open('https://linkedin.com/in/tuckercraig', '_blank'),
      keywords: ['linkedin', 'profile', 'professional', 'social']
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
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
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
        onClose()
        break
    }
  }

  const executeCommand = (command) => {
    command.action()
    onClose()
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
            onClick={onClose}
            className="fixed inset-0 bg-bg/90 backdrop-blur-sm z-50"
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
              <div className="bg-card-bg border border-line shadow-2xl overflow-hidden">
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
                <span><kbd>esc</kbd> close</span>
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