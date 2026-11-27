import { useState, Fragment, useCallback, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useFont } from '../hooks/useFont'
import { SYMBOLS } from '../constants/symbols'
import BrandIcon from './BrandIcon'
import '../styles/command-dock.css'

const socialLinks = [
  { name: 'tuckercraig.com', url: 'https://tuckercraig.com/', key: 'tc', label: 'Visit tuckercraig.com' },
  { name: 'github', url: 'https://github.com/btuckerc', key: 'gh', label: 'Visit github profile' },
  { name: 'linkedin', url: 'https://www.linkedin.com/in/tucker-craig/', key: 'in', label: 'Visit linkedin profile' },
  { name: 'twitter', url: 'https://x.com/btuckercdev', key: 'tw', label: 'Visit twitter profile' },
  { name: 'instagram', url: 'https://www.instagram.com/btuckerc.dev/', key: 'ig', label: 'Visit instagram profile' },
  { name: 'spotify', url: 'https://open.spotify.com/user/tuxedo7777', key: 'sp', label: 'Visit spotify profile' },
  { name: 'soundcloud', url: 'https://soundcloud.com/tuxix', key: 'sc', label: 'Visit soundcloud profile' },
]

const Footer = ({ onCommandPaletteToggle, isCommandPaletteOpen = false }) => {
  const { fontId, fonts, setFont } = useFont()
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [showIcons, setShowIcons] = useState(true)
  const [isSocialMenuOpen, setIsSocialMenuOpen] = useState(false)
  const socialButtonRef = useRef(null)
  const socialPanelRef = useRef(null)
  const fontButtonRef = useRef(null)
  const fontPanelRef = useRef(null)
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  const focusControl = (ref) => {
    window.requestAnimationFrame(() => ref.current?.focus())
  }

  const closeSocialMenu = useCallback((restoreFocus = false) => {
    setIsSocialMenuOpen(false)
    if (restoreFocus) focusControl(socialButtonRef)
  }, [])

  const closePicker = useCallback((restoreFocus = false) => {
    setIsPickerOpen(false)
    if (restoreFocus) focusControl(fontButtonRef)
  }, [])

  const handleFontSelect = (font) => {
    setFont(font.id)
    closePicker(true)
  }

  const handleSocialToggle = () => {
    setIsPickerOpen(false)
    setIsSocialMenuOpen((isOpen) => !isOpen)
  }

  const handlePickerToggle = () => {
    setIsSocialMenuOpen(false)
    setIsPickerOpen((isOpen) => !isOpen)
  }

  const handleCommandDockClick = (event) => {
    setIsPickerOpen(false)
    setIsSocialMenuOpen(false)
    onCommandPaletteToggle?.(event.currentTarget)
  }

  const isModifiedOrComposing = (event) => (
    event.isComposing ||
    event.nativeEvent?.isComposing ||
    event.keyCode === 229 ||
    event.metaKey ||
    event.ctrlKey ||
    event.altKey
  )

  const handleSocialPanelKeyDown = (event) => {
    if (isModifiedOrComposing(event)) return
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      closeSocialMenu(true)
    }
  }

  const handleSocialBlur = (event) => {
    const next = event.relatedTarget
    // Safari does not focus links or buttons on click/tap, yielding a null
    // relatedTarget; keep the popover mounted so taps land (outside taps hit
    // the backdrop) while closing whenever keyboard focus moves outside both
    // the panel and its trigger.
    if (!next) return
    if (
      !socialPanelRef.current?.contains(next) &&
      next !== socialButtonRef.current
    ) {
      setIsSocialMenuOpen(false)
    }
  }

  const handlePickerKeyDown = (event) => {
    if (isModifiedOrComposing(event)) return
    if (event.key === 'Escape') {
      event.preventDefault()
      closePicker(true)
      return
    }
    if (event.key === 'Tab') {
      // Return focus synchronously to the trigger so native Tab / Shift+Tab
      // moves cleanly relative to the font button instead of an unmounting item.
      fontButtonRef.current?.focus()
      closePicker(false)
      return
    }

    const items = Array.from(fontPanelRef.current?.querySelectorAll('[role="menuitemradio"]') || [])
    if (items.length === 0) return

    const currentIndex = items.indexOf(document.activeElement)
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      items[currentIndex < 0 ? 0 : (currentIndex + 1) % items.length]?.focus()
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      items[currentIndex <= 0 ? items.length - 1 : currentIndex - 1]?.focus()
    } else if (event.key === 'Home') {
      event.preventDefault()
      items[0]?.focus()
    } else if (event.key === 'End') {
      event.preventDefault()
      items[items.length - 1]?.focus()
    }
  }

  useEffect(() => {
    setIsPickerOpen(false)
    setIsSocialMenuOpen(false)
  }, [location.pathname, isCommandPaletteOpen])

  useEffect(() => {
    if (!isPickerOpen && !isSocialMenuOpen) return undefined
    const handleDocumentEscape = (event) => {
      if (event.key !== 'Escape' || isModifiedOrComposing(event)) return
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) return
      event.preventDefault()
      if (isPickerOpen) closePicker(true)
      else closeSocialMenu(true)
    }
    document.addEventListener('keydown', handleDocumentEscape, true)
    return () => document.removeEventListener('keydown', handleDocumentEscape, true)
  }, [isPickerOpen, isSocialMenuOpen, closePicker, closeSocialMenu])

  useEffect(() => {
    if (isSocialMenuOpen) {
      socialPanelRef.current?.querySelector('a, button')?.focus()
    }
  }, [isSocialMenuOpen])

  useEffect(() => {
    if (isPickerOpen) {
      const selectedFont = fontPanelRef.current?.querySelector('[aria-checked="true"]')
      const firstFont = fontPanelRef.current?.querySelector('button')
      ;(selectedFont || firstFont)?.focus()
    }
  }, [isPickerOpen, fontId])

  return (
    <>
      {isPickerOpen && (
        <Fragment>
          <div
            className="fixed inset-0 z-[45]"
            aria-hidden="true"
            onClick={() => closePicker(true)}
          />

          <div
            id="footer-font-picker"
            ref={fontPanelRef}
            onKeyDown={handlePickerKeyDown}
            className="tui-menu-panel tui-footer-popover tui-footer-popover-right tui-panel-enter z-[48]"
            role="menu"
            aria-label="Font family"
          >
            <div className="border-b border-line px-4 py-2 text-xs text-muted font-mono">
              font family
            </div>
            <div className="py-1 text-xs font-mono">
              {fonts.map((font) => (
                <button
                  key={font.id}
                  type="button"
                  tabIndex={-1}
                  onClick={() => handleFontSelect(font)}
                  role="menuitemradio"
                  aria-checked={fontId === font.id}
                  className={`tui-menu-item${fontId === font.id ? ' tui-menu-item-active' : ''}`}
                  style={{ fontFamily: font.family }}
                >
                  <span className="tui-menu-item-label">{font.name.toLowerCase()}</span>
                  {font.id === 'neue-montreal' && <span className="ml-2 text-muted font-mono">(default)</span>}
                  {fontId === font.id && <span className="ml-auto text-accent font-mono">*</span>}
                </button>
              ))}
            </div>
          </div>
        </Fragment>
      )}

      {isSocialMenuOpen && (
        <Fragment>
          <div
            className="fixed inset-0 z-[45]"
            aria-hidden="true"
            onClick={() => closeSocialMenu(true)}
          />

          <div
            id="footer-social-links"
            ref={socialPanelRef}
            onKeyDown={handleSocialPanelKeyDown}
            onBlur={handleSocialBlur}
            className="tui-menu-panel tui-footer-popover tui-footer-popover-left tui-panel-enter z-[48]"
          >
            <nav className="py-1 text-xs font-mono" aria-label="Social profiles">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="tui-menu-item gap-2"
                  aria-label={link.label}
                  title={link.name}
                  aria-describedby="new-tab-note"
                  onClick={() => closeSocialMenu(false)}
                >
                  {showIcons ? (
                    <BrandIcon name={link.name} className="h-3 w-3" />
                  ) : (
                    <span className="text-muted">{link.key}</span>
                  )}
                  <span className="tui-menu-item-label">{link.name}</span>
                </a>
              ))}
            </nav>
            <div className="border-t border-line mx-3" />
            <div className="py-1 text-xs font-mono">
              <button
                onClick={() => {
                  setShowIcons(!showIcons)
                  closeSocialMenu(true)
                }}
                type="button"
                className="tui-menu-item"
              >
                <span className="tui-menu-item-label">{showIcons ? 'show text' : 'show icons'}</span>
              </button>
            </div>
          </div>
        </Fragment>
      )}

      <footer className="tui-footer fixed bottom-0 left-0 right-0 z-40 border-t border-line">
        <div className="tui-footer-control-row">
          {/* Social links - desktop */}
          <nav
            className="hidden min-[700px]:flex items-center"
            aria-label="Social profiles"
          >
            {socialLinks.map((link, index) => (
              <Fragment key={link.name}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="tui-footer-link"
                  aria-label={link.label}
                  title={link.name}
                  aria-describedby="new-tab-note"
                >
                  {showIcons ? (
                    <BrandIcon name={link.name} className="h-3.5 w-3.5" />
                  ) : (
                    <span className="text-xs font-mono leading-none">{link.key}</span>
                  )}
                </a>
                {index < socialLinks.length - 1 && (
                  <span className="tui-footer-sep" aria-hidden="true">│</span>
                )}
              </Fragment>
            ))}
            <span className="tui-footer-sep" aria-hidden="true">│</span>
            <button
              type="button"
              onClick={() => setShowIcons(!showIcons)}
              className="tui-footer-link"
              title={showIcons ? 'Show text' : 'Show icons'}
              aria-label={showIcons ? 'Show text abbreviations' : 'Show icons'}
            >
              {showIcons ? '[t]' : '[i]'}
            </button>
          </nav>

          {/* Social links - mobile */}
          <div className="tui-footer-mobile-links min-[700px]:hidden relative">
            <button
              ref={socialButtonRef}
              type="button"
              onClick={handleSocialToggle}
              onBlur={handleSocialBlur}
              className="tui-footer-link gap-1.5"
              aria-label="Toggle social links menu"
              aria-controls="footer-social-links"
              aria-expanded={isSocialMenuOpen}
            >
              <span>links</span>
              <span className="tui-disclosure" aria-hidden="true" />
            </button>
          </div>

          {/* Persistent command palette cue docked in the center of the footer bar */}
          <div className={`tui-command-dock ${isHomePage ? 'is-floating' : 'is-compact'}`}>
            <button
              type="button"
              onClick={handleCommandDockClick}
              className="tui-command-dock-button"
              aria-label={`${isCommandPaletteOpen ? 'Close' : 'Open'} command palette (type colon for commands)`}
              aria-expanded={isCommandPaletteOpen}
              aria-controls="command-palette-dialog"
              aria-haspopup="dialog"
              aria-keyshortcuts=":"
              aria-describedby={isHomePage ? undefined : 'command-dock-tooltip'}
            >
              <span className="command-dock-expanded" aria-hidden="true">
                <span className="tui-command-dock-mark">&gt;</span>
                <span>type</span>
                <kbd className="tui-command-cue-key">{SYMBOLS.COMMAND_PREFIX}</kbd>
                <span>for commands</span>
              </span>
              <span className="command-dock-compact" aria-hidden="true">
                <kbd className="command-dock-colon">:</kbd>
              </span>
            </button>
            {!isHomePage && (
              <span id="command-dock-tooltip" className="command-dock-tooltip" role="tooltip">
                type : for commands
              </span>
            )}
          </div>

          {/* Font switcher and copyright - bottom right */}
          <div className="flex items-center justify-end min-w-0">
            <button
              ref={fontButtonRef}
              type="button"
              onClick={handlePickerToggle}
              className="tui-footer-link"
              title="Select font family"
              aria-label="Select font family"
              aria-haspopup="menu"
              aria-controls="footer-font-picker"
              aria-expanded={isPickerOpen}
            >
              font
            </button>
            <span className="tui-footer-sep" aria-hidden="true">│</span>
            <span className="whitespace-nowrap">©&nbsp;2026</span>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
