import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useFont } from '../hooks/useFont'
import { SYMBOLS } from '../constants/symbols'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faLinkedin, faTwitter, faSpotify, faSoundcloud } from '@fortawesome/free-brands-svg-icons'

const Footer = () => {
  const { fontName, fontId, fonts, setFont } = useFont()
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [showIcons, setShowIcons] = useState(true)
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
      {/* Command hint - fixed above footer, only visible on home page */}
      <AnimatePresence>
        {isHomePage && (
          <div className="fixed bottom-12 left-0 right-0 z-40 text-center pointer-events-none">
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
            className="fixed inset-0 z-40"
            onClick={() => setIsPickerOpen(false)}
          />
          
          {/* Picker Menu */}
          <div className="fixed bottom-10 right-3 z-50 border border-line bg-bg/95 backdrop-blur-sm">
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
                  {font.id === 'source-code' && <span className="ml-2 text-line">(default)</span>}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-line bg-bg/95 backdrop-blur-sm">
        <div className="relative flex items-center justify-between text-xs font-mono text-muted px-3 py-2">
          {/* Social links - bottom left */}
          <div className="flex items-center gap-3">
            {socialLinks.map((link, index) => (
              <span key={link.name}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                  aria-label={`Visit ${link.name} profile`}
                >
                  {showIcons ? (
                    <FontAwesomeIcon icon={link.icon} className="text-xs" />
                  ) : (
                    link.key
                  )}
                </a>
                {index < socialLinks.length - 1 && <span className="ml-3 text-line">│</span>}
              </span>
            ))}
            <button
              onClick={() => setShowIcons(!showIcons)}
              className="ml-3 hover:text-accent transition-colors text-xs"
              title={showIcons ? "Show text" : "Show icons"}
              aria-label={showIcons ? "Show text abbreviations" : "Show icons"}
            >
              {showIcons ? '[t]' : '[i]'}
            </button>
          </div>
          
          {/* Command hint - inside footer on non-home pages */}
          <AnimatePresence>
            {!isHomePage && (
              <div className="absolute left-1/2 transform -translate-x-1/2 pointer-events-none">
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
