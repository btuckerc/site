import { useState, Fragment } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useFont } from '../hooks/useFont'
import { SYMBOLS } from '../constants/symbols'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faLinkedin, faTwitter, faSpotify, faSoundcloud } from '@fortawesome/free-brands-svg-icons'

const Footer = ({ onCommandPaletteOpen }) => {
  const { fontName, fontId, fonts, setFont } = useFont()
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [showIcons, setShowIcons] = useState(true)
  const [isSocialMenuOpen, setIsSocialMenuOpen] = useState(false)
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  
  const socialLinks = [
    { name: 'github', url: 'https://github.com/btuckerc', key: 'gh', icon: faGithub },
    { name: 'linkedin', url: 'https://www.linkedin.com/in/tucker-craig/', key: 'in', icon: faLinkedin },
    { name: 'twitter', url: 'http://x.com/btuckerc', key: 'tw', icon: faTwitter },
    { name: 'spotify', url: 'https://open.spotify.com/user/tuxedo7777?si=ed756fe16e924916', key: 'sp', icon: faSpotify },
    { name: 'soundcloud', url: 'https://soundcloud.com/tuxix', key: 'sc', icon: faSoundcloud },
  ]

  const handleFontSelect = (font) => {
    setFont(font.id)
    setIsPickerOpen(false)
  }

  return (
    <>
      {/* Command hint - fixed above footer, only visible on home page and larger screens */}
      <AnimatePresence>
        {isHomePage && (
          <div className="hidden sm:block fixed bottom-12 left-0 right-0 z-40 text-center pointer-events-none">
            <motion.div
              layoutId="command-hint"
              layout="position"
              initial={false}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="inline-block text-muted text-xs font-mono"
            >
              type <kbd className="px-2 py-1 border border-line bg-card-bg text-fg shadow-sm">{SYMBOLS.COMMAND_PREFIX}</kbd> for commands
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Font Picker Dropdown */}
      {isPickerOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-[60]"
            onClick={() => setIsPickerOpen(false)}
          />
          
          {/* Picker Menu */}
          <div className="fixed bottom-10 right-3 z-[70] border border-line/70 bg-bg/85 backdrop-blur-xl shadow-[0_32px_100px_-50px_rgba(0,0,0,0.85)]">
            <div className="text-xs font-mono">
              {fonts.map((font) => (
                <button
                  key={font.id}
                  onClick={() => handleFontSelect(font)}
                  className={`
                    block w-full text-left px-4 py-2 hover:bg-accent/10 transition-colors
                    ${fontId === font.id ? 'text-accent' : 'text-muted'}
                  `}
                >
                  {font.name.toLowerCase()}
                  {font.id === 'source-code' && <span className="ml-2 text-fg">(default)</span>}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Social Links Menu Dropdown - Must be outside footer to work properly */}
      {isSocialMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-[60]"
            onClick={() => setIsSocialMenuOpen(false)}
          />
          
          {/* Menu */}
          <div className="fixed bottom-10 left-3 z-[70] border border-line/70 bg-bg/85 backdrop-blur-xl shadow-[0_32px_100px_-50px_rgba(0,0,0,0.85)] min-w-[160px]">
            <div className="text-xs font-mono">
              <div className="py-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-accent/10 transition-colors text-xs block"
                    aria-label={`Visit ${link.name} profile`}
                    onClick={() => setIsSocialMenuOpen(false)}
                  >
                    {showIcons ? (
                      <FontAwesomeIcon icon={link.icon} className="text-xs" />
                    ) : (
                      <span className="text-muted">{link.key}</span>
                    )}
                    <span className="text-muted">{link.name}</span>
                  </a>
                ))}
                <div className="border-t border-line my-1" />
                <button
                  onClick={() => {
                    setShowIcons(!showIcons)
                    setIsSocialMenuOpen(false)
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-accent/10 transition-colors text-xs block text-muted"
                >
                  {showIcons ? 'show text' : 'show icons'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-line bg-bg/95 backdrop-blur-sm">
        <div className="relative flex items-center justify-between text-xs font-mono text-muted px-3 py-2 min-h-[40px]">
          {/* Social links - bottom left */}
          {/* Desktop: Show all links horizontally */}
          <motion.div 
            layoutId="social-links"
            layout="position"
            initial={false}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="hidden sm:flex items-center h-[24px]"
          >
            {socialLinks.map((link, index) => (
              <Fragment key={link.name}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative group px-2.5 py-1.5 flex items-center justify-center min-w-[24px] min-h-[24px]"
                  aria-label={`Visit ${link.name} profile`}
                >
                  {/* Soft-white background box with feathered edges - uses CSS variable for theme support */}
                  <div 
                    className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none backdrop-blur-sm"
                    style={{ 
                      backgroundColor: 'var(--social-hover-bg)',
                      boxShadow: '0 0 12px 4px var(--social-hover-shadow), inset 0 0 8px rgba(255, 255, 255, 0.1)'
                    }}
                  />
                  
                  {/* Content with inverted color on hover */}
                  <span 
                    className="relative z-10 text-muted transition-colors duration-200 inline-flex items-center justify-center group-hover:[color:var(--social-hover-text)]"
                  >
                    {showIcons ? (
                      <FontAwesomeIcon icon={link.icon} className="text-xs" />
                    ) : (
                      <span className="text-xs font-mono leading-none">{link.key}</span>
                    )}
                  </span>
                </a>
                {index < socialLinks.length - 1 && (
                  <span className="mx-3 text-line pointer-events-none" aria-hidden="true">│</span>
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
                  className="ml-3 hover:text-accent transition-colors text-xs"
                  title={showIcons ? "Show text" : "Show icons"}
                  aria-label={showIcons ? "Show text abbreviations" : "Show icons"}
                >
                  {showIcons ? '[t]' : '[i]'}
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Mobile: Collapsible social menu button */}
          <motion.div 
            layoutId="social-links"
            layout="position"
            initial={false}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="sm:hidden relative"
          >
            <button
              onClick={() => setIsSocialMenuOpen(!isSocialMenuOpen)}
              className="hover:text-accent transition-colors text-xs flex items-center gap-1"
              aria-label="Toggle social links menu"
              aria-expanded={isSocialMenuOpen}
            >
              <span>links</span>
              <span className="text-accent">{isSocialMenuOpen ? '▼' : '▶'}</span>
            </button>
          </motion.div>
          
          {/* Command hint - inside footer on non-home pages (desktop only) */}
          <AnimatePresence>
            {!isHomePage && (
              <div className="hidden sm:block absolute left-1/2 transform -translate-x-1/2 pointer-events-none">
                <motion.div
                  layoutId="command-hint"
                  layout="position"
                  initial={false}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  className="inline-block text-muted text-xs font-mono"
                >
                  type <kbd className="px-2 py-1 border border-line bg-card-bg text-fg shadow-sm">{SYMBOLS.COMMAND_PREFIX}</kbd> for commands
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Mobile: Commands button (replaces command hint on small screens) */}
          <div className="sm:hidden absolute left-1/2 transform -translate-x-1/2 pointer-events-auto">
            <button
              onClick={() => onCommandPaletteOpen?.()}
              className="text-muted hover:text-accent transition-colors text-xs font-mono"
              aria-label="Open command palette"
            >
              commands
            </button>
          </div>
          
          {/* Font switcher and copyright - bottom right */}
          <div>
            <button
              onClick={() => setIsPickerOpen(!isPickerOpen)}
              className="hover:text-accent transition-colors"
              title="Select font family"
            >
              font{/*: {fontName.toLowerCase()} */}
            </button>
            <span className="mx-2 text-line">│</span>
            <span className="text-accent">©</span> 2025
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
