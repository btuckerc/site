import { useState, useEffect, useId, useLayoutEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme.jsx'
import { safeGetItem, safeSetItem } from '../utils/safeStorage'

const prefersReducedMotion = () => (
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
)

const isComposingEvent = (event) => (
  Boolean(event.isComposing || event.nativeEvent?.isComposing || event.keyCode === 229)
)

const CommandPalette = ({ isOpen, onClose, returnFocusRef = null }) => {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const listboxId = useId()
  const dialogRef = useRef(null)
  const inputRef = useRef()
  const selectedItemRef = useRef(null)
  const previousFocusRef = useRef(null)
  const skipFocusRestoreRef = useRef(false)
  const navigate = useNavigate()
  const { cycleTheme, theme } = useTheme()

  const commands = [
    {
      id: 'home',
      title: 'go home',
      description: 'return to landing page',
      action: () => navigate('/'),
      focusTarget: '#main-content',
      keywords: ['home', 'landing', 'main', 'index']
    },
    {
      id: 'workflow',
      title: 'open workflow',
      description: 'how i build with AI',
      action: () => navigate('/workflow'),
      focusTarget: '#main-content',
      keywords: ['workflow', 'ai', 'agents', 'harness', 'verification', 'build']
    },
    {
      id: 'about',
      title: 'go to about',
      description: 'a bit about me',
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
      description: 'about the omalo handheld',
      action: () => navigate('/projects/omalo'),
      focusTarget: '#main-content',
      keywords: ['omalo', 'ichr', 'pocket', 'companion', 'pokemon', 'device']
    },
    {
      id: 's3-amoled',
      title: 'open technical notes',
      description: 'how omalo works under the hood',
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
      action: () => window.open('https://github.com/btuckerc', '_blank', 'noopener,noreferrer'),
      keywords: ['github', 'code', 'repos', 'profile', 'social']
    },
    {
      id: 'linkedin',
      title: 'open linkedin',
      description: 'visit linkedin profile',
      action: () => window.open('https://www.linkedin.com/in/tucker-craig/', '_blank', 'noopener,noreferrer'),
      keywords: ['linkedin', 'profile', 'professional', 'social']
    },
    {
      id: 'twitter',
      title: 'open x',
      description: 'visit x profile',
      action: () => window.open('https://x.com/btuckercdev', '_blank', 'noopener,noreferrer'),
      keywords: ['twitter', 'x', 'social', 'profile']
    },
    {
      id: 'instagram',
      title: 'open instagram',
      description: 'visit instagram profile',
      action: () => window.open('https://www.instagram.com/btuckerc.dev/', '_blank', 'noopener,noreferrer'),
      keywords: ['instagram', 'ig', 'social', 'profile']
    },
    {
      id: 'theme',
      title: 'cycle theme',
      description: `current: ${theme}`,
      action: () => cycleTheme(),
      keywords: ['theme', 'dark', 'light', 'amber', 'color', 'mode']
    }
  ]

  const fuzzyMatch = (text, q) => {
    if (!q) return true

    const queryLower = q.toLowerCase()
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
    .map((cmd) => ({
      ...cmd,
      score: Math.max(
        fuzzyMatch(cmd.title, query),
        fuzzyMatch(cmd.description, query),
        ...cmd.keywords.map((k) => fuzzyMatch(k, query))
      )
    }))
    .filter((cmd) => cmd.score > 0)
    .sort((a, b) => b.score - a.score)

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useLayoutEffect(() => {
    if (isOpen) {
      const opener = returnFocusRef?.current
      const activeElement = document.activeElement
      previousFocusRef.current = opener instanceof HTMLElement
        ? opener
        : (activeElement instanceof HTMLElement ? activeElement : null)
      inputRef.current?.focus()
      return
    }

    const previousFocus = previousFocusRef.current
    previousFocusRef.current = null
    if (returnFocusRef) returnFocusRef.current = null
    if (!skipFocusRestoreRef.current && previousFocus?.isConnected) {
      window.requestAnimationFrame(() => {
        if (previousFocus.isConnected) previousFocus.focus()
      })
    }
    skipFocusRestoreRef.current = false
  }, [isOpen, returnFocusRef])

  useEffect(() => {
    if (!isOpen) {
      setSelectedIndex(0)
      return
    }
    if (selectedItemRef.current && typeof selectedItemRef.current.scrollIntoView === 'function') {
      selectedItemRef.current.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'nearest'
      })
    }
  }, [selectedIndex, isOpen])

  const handleKeyDown = (e) => {
    if (isComposingEvent(e) || e.metaKey || e.ctrlKey || e.altKey) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (filteredCommands.length === 0) return
        setSelectedIndex((prev) =>
          prev < filteredCommands.length - 1 ? prev + 1 : 0
        )
        break

      case 'ArrowUp':
        e.preventDefault()
        if (filteredCommands.length === 0) return
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredCommands.length - 1
        )
        break

      case 'Enter':
        e.preventDefault()
        if (filteredCommands[selectedIndex]) {
          executeCommand(filteredCommands[selectedIndex])
        }
        break
    }
  }

  const handleDialogKeyDown = (e) => {
    if (isComposingEvent(e) || e.metaKey || e.ctrlKey || e.altKey) return

    if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      closePalette()
      return
    }
    if (e.key !== 'Tab' || !dialogRef.current) return

    const focusable = Array.from(
      dialogRef.current.querySelectorAll(
        'input:not([disabled]), button:not([disabled]):not([tabindex="-1"]), [href], [tabindex]:not([tabindex="-1"])'
      )
    )
    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey) {
      if (document.activeElement === first || !dialogRef.current.contains(document.activeElement)) {
        e.preventDefault()
        last.focus()
      }
    } else if (document.activeElement === last || !dialogRef.current.contains(document.activeElement)) {
      e.preventDefault()
      first.focus()
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
      if (!(target instanceof HTMLElement) || target.closest('[inert]')) return false
      target.focus()
      if (document.activeElement !== target) return false
      cleanup()
      return true
    }

    const retry = () => {
      if (tryFocus()) return
      frameId = window.requestAnimationFrame(retry)
    }

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
    setQuery('')
  }

  useEffect(() => {
    const saved = safeGetItem('command-palette-query', 'session')
    if (saved) {
      setQuery(saved)
    }
  }, [])

  useEffect(() => {
    if (query) {
      safeSetItem('command-palette-query', query, 'session')
    }
  }, [query])

  if (!isOpen) return null

  const activeCommand = filteredCommands[selectedIndex]
  const activeOptionId = activeCommand ? `${listboxId}-option-${activeCommand.id}` : undefined

  return (
    <>
      <div
        onClick={() => closePalette()}
        className="fixed inset-0 tui-scrim tui-enter z-50"
        aria-hidden="true"
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          ref={dialogRef}
          onKeyDown={handleDialogKeyDown}
          className="w-full max-w-lg pointer-events-auto tui-panel-enter"
          role="dialog"
          id="command-palette-dialog"
          aria-modal="true"
          aria-labelledby="command-palette-title"
        >
          <div className="tui-palette-panel max-h-[calc(100svh-2rem)] flex flex-col overflow-hidden">
            <div className="tui-palette-header shrink-0 px-4 py-3.5">
              <h2 id="command-palette-title" className="sr-only">
                Command Palette
              </h2>
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-expanded="true"
                aria-autocomplete="list"
                aria-controls={listboxId}
                aria-activedescendant={activeOptionId}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-label="Search commands"
                placeholder="type command..."
                className="tui-palette-input w-full bg-transparent border-none text-fg placeholder-muted text-base font-mono"
              />
            </div>

            <div
              id={listboxId}
              role="listbox"
              aria-label="Commands"
              className="tui-palette-scroll min-h-0 flex-1 max-h-80 overflow-y-auto"
            >
              {filteredCommands.map((command, index) => (
                <button
                  key={command.id}
                  id={`${listboxId}-option-${command.id}`}
                  type="button"
                  role="option"
                  aria-selected={index === selectedIndex}
                  tabIndex={-1}
                  ref={index === selectedIndex ? selectedItemRef : null}
                  onClick={() => executeCommand(command)}
                  className={`w-full text-left px-4 py-3 border-none font-mono hover:bg-hover-bg transition-colors ${
                    index === selectedIndex ? 'bg-active-bg' : 'bg-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-block w-3 shrink-0 text-center text-accent text-sm"
                      aria-hidden="true"
                    >
                      {index === selectedIndex ? '>' : ''}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-fg font-medium text-sm">
                        {command.title}
                      </div>
                      <div className="text-muted text-xs">
                        {command.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div
              role="status"
              aria-live="polite"
              className={filteredCommands.length === 0 ? 'px-4 py-8 text-center text-muted font-mono text-sm' : 'sr-only'}
            >
              {filteredCommands.length === 0 ? 'no commands found' : ''}
            </div>

            <div className="shrink-0 px-4 py-3 border-t border-line text-xs text-muted flex items-center gap-4 font-mono">
              <span><kbd>↑↓</kbd> navigate</span>
              <span><kbd>↵</kbd> select</span>
              <button
                type="button"
                onClick={() => closePalette()}
                className="ml-auto hover:text-fg transition-colors flex items-center gap-1"
                aria-label="Close command palette"
              >
                <kbd>esc</kbd> close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CommandPalette
