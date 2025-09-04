import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme.jsx'

const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef()
  const navigate = useNavigate()
  const { toggleMode, cycleVariant, themeName } = useTheme()

  // Command definitions
  const commands = [
    {
      id: 'about',
      title: 'Open About',
      description: 'View profile and background',
      action: () => navigate('/about'),
      keywords: ['about', 'profile', 'bio', 'background']
    },
    {
      id: 'projects',
      title: 'Open Projects',
      description: 'Browse project portfolio',
      action: () => navigate('/projects'),
      keywords: ['projects', 'portfolio', 'work', 'code']
    },
    {
      id: 'contact',
      title: 'Open Contact',
      description: 'Get in touch',
      action: () => navigate('/contact'),
      keywords: ['contact', 'email', 'reach', 'touch']
    },
    {
      id: 'home',
      title: 'Go Home',
      description: 'Return to landing page',
      action: () => navigate('/'),
      keywords: ['home', 'landing', 'main']
    },
    {
      id: 'theme-toggle',
      title: 'Toggle Theme Mode',
      description: 'Switch between light and dark mode',
      action: () => toggleMode(),
      keywords: ['theme', 'dark', 'light', 'mode', 'toggle']
    },
    {
      id: 'theme-cycle',
      title: 'Cycle Theme Variant',
      description: `Current: ${themeName}`,
      action: () => cycleVariant(),
      keywords: ['theme', 'variant', 'color', 'style', 'neutral', 'warm', 'cool']
    },
    {
      id: 'search',
      title: 'Search Projects',
      description: 'Focus project search',
      action: () => {
        navigate('/projects')
        // Focus search input after navigation
        setTimeout(() => {
          const searchInput = document.querySelector('[data-search-input]')
          if (searchInput) searchInput.focus()
        }, 100)
      },
      keywords: ['search', 'find', 'filter', 'projects']
    },
    {
      id: 'help',
      title: 'Show Help',
      description: 'Display keyboard shortcuts',
      action: () => {
        // Could show a help modal
        console.log('Help: hjkl/arrows=navigate, Enter/Space=select, :=command, /=search, gg=top, G=bottom, Esc=close')
      },
      keywords: ['help', 'shortcuts', 'keys', 'commands']
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

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
      case 'j':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < filteredCommands.length - 1 ? prev + 1 : 0
        )
        break
      
      case 'ArrowUp':
      case 'k':
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
            onClick={onClose}
            className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-50"
          />
          
          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="fixed top-1/4 left-1/2 -translate-x-1/2 w-full max-w-lg z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="command-palette-title"
          >
            <div className="mx-4 bg-card-bg border border-line rounded-xl shadow-2xl overflow-hidden">
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
                  placeholder="Type a command..."
                  className="w-full bg-transparent border-none outline-none text-fg placeholder-muted text-lg"
                />
              </div>
              
              <div className="max-h-80 overflow-y-auto">
                {filteredCommands.length > 0 ? (
                  filteredCommands.map((command, index) => (
                    <motion.button
                      key={command.id}
                      onClick={() => executeCommand(command)}
                      className={`
                        w-full text-left px-4 py-3 border-none bg-transparent
                        hover:bg-hover-bg transition-colors
                        ${index === selectedIndex ? 'bg-active-bg' : ''}
                      `}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="font-mono text-accent">
                          {index === selectedIndex ? '▸' : ' '}
                        </div>
                        <div className="flex-1">
                          <div className="text-fg font-medium">
                            {command.title}
                          </div>
                          <div className="text-muted text-sm">
                            {command.description}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-muted">
                    No commands found
                  </div>
                )}
              </div>
              
              <div className="px-4 py-3 border-t border-line text-xs text-muted flex gap-4">
                <span><kbd>↑↓</kbd> navigate</span>
                <span><kbd>↵</kbd> select</span>
                <span><kbd>esc</kbd> close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CommandPalette