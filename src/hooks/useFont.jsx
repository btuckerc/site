import { useState, useEffect, createContext, useContext } from 'react'

const FontContext = createContext()

export const useFont = () => {
  const context = useContext(FontContext)
  if (!context) {
    throw new Error('useFont must be used within FontProvider')
  }
  return context
}

const FONTS = [
  {
    id: 'source-code',
    name: 'Source Code Pro',
    family: "'Source Code Pro Variable', 'SF Mono', 'Menlo', 'Monaco', 'Consolas', monospace"
  },
  {
    id: 'ibm-plex',
    name: 'IBM Plex Mono',
    family: "'IBM Plex Mono', 'SF Mono', 'Menlo', 'Consolas', monospace"
  },
  {
    id: 'geist-mono',
    name: 'Geist Mono',
    family: "'Geist Mono Variable', 'SF Mono', 'Menlo', 'Monaco', 'Consolas', monospace"
  },
  {
    id: 'martian-mono',
    name: 'Martian Mono',
    family: "'Martian Mono Variable', 'SF Mono', 'Menlo', 'Consolas', monospace"
  },
  {
    id: 'intel-one',
    name: 'Intel One Mono',
    family: "'Intel One Mono Variable', 'SF Mono', 'Menlo', 'Monaco', 'Consolas', monospace"
  },
  {
    id: 'system',
    name: 'System',
    family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif"
  }
]

const FONT_ALIASES = {
  jetbrains: 'geist-mono',
  'fira-code': 'martian-mono',
  montserrat: 'system'
}

const getCanonicalFontId = (id) => FONT_ALIASES[id] || id
const hasFont = (id) => FONTS.some(font => font.id === id)

const getStoredFontId = () => {
  const savedFontId = localStorage.getItem('font-family')
  const canonicalFontId = getCanonicalFontId(savedFontId)
  return hasFont(canonicalFontId) ? canonicalFontId : 'source-code'
}

export const FontProvider = ({ children }) => {
  const [fontId, setFontId] = useState(() => {
    return getStoredFontId()
  })

  const canonicalFontId = getCanonicalFontId(fontId)
  const currentFont = FONTS.find(f => f.id === canonicalFontId) || FONTS[0]

  useEffect(() => {
    document.documentElement.style.setProperty('--font-family', currentFont.family)
    localStorage.setItem('font-family', currentFont.id)
    if (fontId !== currentFont.id) {
      setFontId(currentFont.id)
    }
  }, [fontId, currentFont])

  const cycleFont = () => {
    const currentIndex = FONTS.findIndex(f => f.id === currentFont.id)
    const nextIndex = (currentIndex + 1) % FONTS.length
    setFontId(FONTS[nextIndex].id)
  }

  const setFont = (id) => {
    const canonicalId = getCanonicalFontId(id)
    setFontId(hasFont(canonicalId) ? canonicalId : 'source-code')
  }

  return (
    <FontContext.Provider value={{
      fontId: currentFont.id,
      fontName: currentFont.name,
      cycleFont,
      setFont,
      fonts: FONTS
    }}>
      {children}
    </FontContext.Provider>
  )
}
