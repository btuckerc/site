import { useState } from 'react'
import { useFont } from '../hooks/useFont'

const Footer = () => {
  const { fontName, fontId, fonts, setFont } = useFont()
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  
  const socialLinks = [
    { name: 'github', url: 'https://github.com/tuckercraig', key: 'gh' },
    { name: 'linkedin', url: 'https://linkedin.com/in/tuckercraig', key: 'in' },
    { name: 'twitter', url: 'https://twitter.com/tuckercraig', key: 'tw' },
    { name: 'spotify', url: 'https://open.spotify.com/user/tuckercraig', key: 'sp' },
  ]

  const handleFontSelect = (font) => {
    setFont(font.id)
    setIsPickerOpen(false)
  }

  return (
    <>
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
        <div className="flex items-center justify-between text-xs font-mono text-muted px-3 py-2">
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
                  {link.key}
                </a>
                {index < socialLinks.length - 1 && <span className="ml-3 text-line">│</span>}
              </span>
            ))}
          </div>
          
          {/* Font switcher and copyright - bottom right */}
          <div>
            <button
              onClick={() => setIsPickerOpen(!isPickerOpen)}
              className="hover:text-accent transition-colors"
              title="Select font family"
            >
              font: {fontName.toLowerCase()}
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
