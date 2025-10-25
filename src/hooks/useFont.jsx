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
    id: 'sf-mono',
    name: 'SF Mono',
    family: "'SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', 'Courier New', monospace"
  },
  {
    id: 'sf-pro',
    name: 'SF Pro',
    family: "'SF Pro Display', 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif"
  },
  {
    id: 'inter',
    name: 'Inter',
    family: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
  },
  {
    id: 'system',
    name: 'System',
    family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif"
  },
  {
    id: 'jetbrains',
    name: 'JetBrains',
    family: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace"
  },
  {
    id: 'source-code',
    name: 'Source Code',
    family: "'Source Code Pro', 'Monaco', monospace"
  }
]

export const FontProvider = ({ children }) => {
  const [fontId, setFontId] = useState(() => {
    return localStorage.getItem('font-family') || 'sf-mono'
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
