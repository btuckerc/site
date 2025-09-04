import { useState, useEffect, createContext, useContext } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

export const themes = {
  neutral: 'Neutral Graphite',
  warm: 'Warm Gray', 
  cool: 'Cool Slate'
}

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme-mode')
    return saved ? saved === 'dark' : true // Default to dark
  })
  
  const [themeVariant, setThemeVariant] = useState(() => {
    const saved = localStorage.getItem('theme-variant')
    return saved || 'neutral' // Default to neutral
  })

  useEffect(() => {
    const root = document.documentElement
    
    // Remove all theme classes
    root.classList.remove('light', 'theme-warm', 'theme-cool')
    
    // Apply mode
    if (!isDark) {
      root.classList.add('light')
    }
    
    // Apply variant
    if (themeVariant === 'warm') {
      root.classList.add('theme-warm')
    } else if (themeVariant === 'cool') {
      root.classList.add('theme-cool')
    }
    
    // Persist to localStorage
    localStorage.setItem('theme-mode', isDark ? 'dark' : 'light')
    localStorage.setItem('theme-variant', themeVariant)
  }, [isDark, themeVariant])

  const toggleMode = () => {
    setIsDark(!isDark)
  }

  const setVariant = (variant) => {
    if (Object.keys(themes).includes(variant)) {
      setThemeVariant(variant)
    }
  }

  const cycleVariant = () => {
    const variants = Object.keys(themes)
    const currentIndex = variants.indexOf(themeVariant)
    const nextIndex = (currentIndex + 1) % variants.length
    setThemeVariant(variants[nextIndex])
  }

  return (
    <ThemeContext.Provider value={{
      isDark,
      themeVariant,
      themeName: themes[themeVariant],
      toggleMode,
      setVariant,
      cycleVariant
    }}>
      {children}
    </ThemeContext.Provider>
  )
}