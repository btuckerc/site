import { useState, Fragment, useCallback, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useFont } from '../hooks/useFont'
import { SYMBOLS } from '../constants/symbols'
import BrandIcon from './BrandIcon'
import '../styles/command-dock.css'

const menuPanelMotion = {
  initial: { opacity: 0, y: 6, scaleY: 0.98 },
  animate: { opacity: 1, y: 0, scaleY: 1 },
  exit: { opacity: 0, y: 4, scaleY: 0.98 },
  transition: { duration: 0.16, ease: [0.4, 0, 0.2, 1] }
}

const menuItemMotion = (index = 0) => ({
  initial: { opacity: 0, x: -4 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.12, delay: index * 0.018, ease: [0.4, 0, 0.2, 1] }
  },
  exit: { opacity: 0, x: -3, transition: { duration: 0.08 } }
})


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

  const socialLinks = [
    { name: 'github', url: 'https://github.com/btuckerc', key: 'gh' },
    { name: 'linkedin', url: 'https://www.linkedin.com/in/tucker-craig/', key: 'in' },
    { name: 'twitter', url: 'https://x.com/btuckercdev', key: 'tw' },
    { name: 'instagram', url: 'https://www.instagram.com/btuckerc.dev/', key: 'ig' },
    { name: 'spotify', url: 'https://open.spotify.com/user/tuxedo7777?si=ed756fe16e924916', key: 'sp' },
    { name: 'soundcloud', url: 'https://soundcloud.com/tuxix', key: 'sc' },
  ]

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

  const handleSocialPanelKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      closeSocialMenu(true)
    }
  }

  const handlePickerKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      closePicker(true)
    }
  }

  useEffect(() => {
    setIsPickerOpen(false)
    setIsSocialMenuOpen(false)
  }, [location.pathname])

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
      {/* Font Picker Dropdown */}
      <AnimatePresence>
        {isPickerOpen && (
          <Fragment key="font-picker">
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[60]"
              aria-hidden="true"
              onClick={() => closePicker(true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
            />

            {/* Picker Menu */}
            <motion.div
              {...menuPanelMotion}
              id="footer-font-picker"
              ref={fontPanelRef}
              onKeyDown={handlePickerKeyDown}
              className="tui-menu-panel tui-footer-popover tui-footer-popover-right z-[70] origin-bottom-right border border-line/70 shadow-[0_32px_100px_-50px_rgba(0,0,0,0.85)]"
              role="menu"
              aria-label="Font family"
            >
              <div className="border-b border-line/70 px-4 py-2 text-[0.7rem] text-muted font-mono">
                font family
              </div>
              <div className="py-1 text-xs font-mono">
                {fonts.map((font, index) => (
                  <motion.button
                    key={font.id}
                    {...menuItemMotion(index)}
                    onClick={() => handleFontSelect(font)}
                    role="menuitemradio"
                    aria-checked={fontId === font.id}
                    className={`tui-menu-item ${fontId === font.id ? 'tui-menu-item-active' : ''}`}
                    style={{ fontFamily: font.family }}
                  >
                    <span className="tui-menu-item-label">{font.name.toLowerCase()}</span>
                    {font.id === 'neue-montreal' && <span className="ml-2 text-muted font-mono">(default)</span>}
                    {fontId === font.id && <span className="ml-auto text-accent font-mono">*</span>}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </Fragment>
        )}
      </AnimatePresence>

      {/* Social Links Menu Dropdown - Must be outside footer to work properly */}
      <AnimatePresence>
        {isSocialMenuOpen && (
          <Fragment key="social-menu">
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[60]"
              aria-hidden="true"
              onClick={() => closeSocialMenu(true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
            />

            {/* Menu */}
            <motion.div
              {...menuPanelMotion}
              id="footer-social-links"
              ref={socialPanelRef}
              onKeyDown={handleSocialPanelKeyDown}
              className="tui-menu-panel tui-footer-popover tui-footer-popover-left z-[70] origin-bottom-left border border-line/70 shadow-[0_32px_100px_-50px_rgba(0,0,0,0.85)]"
              aria-label="Social links"
            >
              <nav className="py-2 text-xs font-mono" aria-label="Social profiles">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    {...menuItemMotion(index)}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tui-menu-item gap-2"
                    aria-label={`Visit ${link.name} profile`}
                    onClick={() => closeSocialMenu(false)}
                  >
                    {showIcons ? (
                      <BrandIcon name={link.name} className="h-3 w-3" />
                    ) : (
                      <span className="text-muted">{link.key}</span>
                    )}
                    <span className="tui-menu-item-label">{link.name}</span>
                  </motion.a>
                ))}
              </nav>
              <div className="border-t border-line mx-3" />
              <div className="py-2 text-xs font-mono">
                <motion.button
                  {...menuItemMotion(socialLinks.length)}
                  onClick={() => {
                    setShowIcons(!showIcons)
                    closeSocialMenu(true)
                  }}
                  type="button"
                  className="tui-menu-item"
                >
                  <span className="tui-menu-item-label">{showIcons ? 'show text' : 'show icons'}</span>
                </motion.button>
              </div>
            </motion.div>
          </Fragment>
        )}
      </AnimatePresence>

      <div className={`tui-command-dock ${isHomePage ? 'is-floating' : 'is-compact'}`} aria-label="Command palette shortcut">
        <button
          type="button"
          onClick={() => onCommandPaletteToggle?.()}
          className="tui-command-cue tui-command-cue-footer tui-command-dock-button tui-action min-h-11 px-3 text-muted text-[0.68rem] font-mono"
          aria-label={`${isCommandPaletteOpen ? 'Close' : 'Open'} command palette (type colon for commands)`}
          aria-expanded={isCommandPaletteOpen}
          aria-controls="command-palette-dialog"
          aria-haspopup="dialog"
          aria-keyshortcuts=":"
          aria-describedby={isHomePage ? undefined : 'command-dock-tooltip'}
        >
          <span className="tui-action-content tui-command-cue-content command-dock-expanded" aria-hidden="true">
            <span className="tui-command-dock-mark" aria-hidden="true">›</span>
            <span>type</span>
            <kbd className="tui-command-cue-key" aria-hidden="true">{SYMBOLS.COMMAND_PREFIX}</kbd>
            <span>for commands</span>
          </span>
          <span className="command-dock-compact" aria-hidden="true"><kbd className="command-dock-colon">:</kbd></span>
        </button>
        {!isHomePage && <span id="command-dock-tooltip" className="command-dock-tooltip" role="tooltip">type : for commands</span>}
      </div>

      <footer className="tui-footer fixed bottom-0 left-0 right-0 z-50 border-t border-line">
        <div className="tui-footer-control-row relative flex min-h-[44px] items-center justify-between text-xs font-mono text-muted px-3 py-1">
          {/* Social links - bottom left */}
          {/* Desktop: Show all links horizontally */}
          <nav
            className="hidden min-[700px]:flex items-center h-8"
            aria-label="Social profiles"
          >
            {socialLinks.map((link, index) => (
              <Fragment key={link.name}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tui-action flex min-h-8 min-w-10 items-center justify-center px-3 py-1.5"
                  aria-label={`Visit ${link.name} profile`}
                >
                  <span className="tui-action-content text-muted inline-flex items-center justify-center">
                    {showIcons ? (
                      <BrandIcon name={link.name} className="h-3 w-3" />
                    ) : (
                      <span className="text-xs font-mono leading-none">{link.key}</span>
                    )}
                  </span>
                </a>
                {index < socialLinks.length - 1 && (
                  <span className="mx-1.5 text-line pointer-events-none" aria-hidden="true">│</span>
                )}
              </Fragment>
            ))}
            <AnimatePresence>
              {isHomePage && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setShowIcons(!showIcons)}
                  className="tui-action ml-2 min-h-8 min-w-9 px-2 text-xs"
                  title={showIcons ? "Show text" : "Show icons"}
                  aria-label={showIcons ? "Show text abbreviations" : "Show icons"}
                >
                  <span className="tui-action-content">{showIcons ? '[t]' : '[i]'}</span>
                </motion.button>
              )}
            </AnimatePresence>
          </nav>

          {/* Mobile: Collapsible social menu button */}
          <div className="min-[700px]:hidden relative">
            <button
              ref={socialButtonRef}
              type="button"
              onClick={handleSocialToggle}
              className="tui-action flex min-h-8 min-w-16 items-center justify-center gap-1 px-2 text-xs"
              aria-label="Toggle social links menu"
              aria-controls="footer-social-links"
              aria-expanded={isSocialMenuOpen}
            >
              <span className="tui-action-content flex items-center gap-1">
                <span>links</span>
                <span className="text-accent">{isSocialMenuOpen ? '▼' : '▶'}</span>
              </span>
            </button>
          </div>

          {/* Font switcher and copyright - bottom right */}
          <div className="flex items-center justify-end min-w-0">
            <button
              ref={fontButtonRef}
              type="button"
              onClick={handlePickerToggle}
              className="tui-action min-h-8 px-2"
              title="Select font family"
              aria-label="Select font family"
              aria-haspopup="menu"
              aria-controls="footer-font-picker"
              aria-expanded={isPickerOpen}
            >
              <span className="tui-action-content">font</span>{/*: {fontName.toLowerCase()} */}
            </button>
            <span className="mx-2 text-line">│</span>
            <span className="text-accent">©</span> 2026
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
