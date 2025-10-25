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
    family: "'Source Code Pro', 'SF Mono', 'Menlo', 'Monaco', 'Consolas', monospace"
  },
  {
    id: 'ibm-plex',
    name: 'IBM Plex Mono',
    family: "'IBM Plex Mono', 'SF Mono', 'Menlo', 'Consolas', monospace"
  },
  {
    id: 'jetbrains',
    name: 'JetBrains Mono',
    family: "'JetBrains Mono', 'SF Mono', 'Menlo', 'Monaco', 'Consolas', monospace"
  },
  {
    id: 'fira-code',
    name: 'Fira Code',
    family: "'Fira Code', 'SF Mono', 'Menlo', 'Consolas', monospace"
  },
  {
    id: 'montserrat',
    name: 'Montserrat',
    family: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif"
  },
  {
    id: 'system',
    name: 'System',
    family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif"
  }
]

export const FontProvider = ({ children }) => {
  const [fontId, setFontId] = useState(() => {
    return localStorage.getItem('font-family') || 'source-code'
  })

  const currentFont = FONTS.find(f => f.id === fontId) || FONTS[0]

  useEffect(() => {
    document.documentElement.style.setProperty('--font-family', currentFont.family)
    localStorage.setItem('font-family', fontId)
  }, [fontId, currentFont])

  const cycleFont = () => {
    const currentIndex = FONTS.findIndex(f => f.id === fontId)
    const nextIndex = (currentIndex + 1) % FONTS.length
    setFontId(FONTS[nextIndex].id)
  }

  const setFont = (id) => {
    setFontId(id)
  }

  return (
    <FontContext.Provider value={{
      fontId,
      fontName: currentFont.name,
      cycleFont,
      setFont,
      fonts: FONTS
    }}>
      {children}
    </FontContext.Provider>
  )
}
