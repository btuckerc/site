import { useState, useEffect, createContext, useContext } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme-mode')
    return saved ? saved === 'dark' : true // Default to dark
  })

  useEffect(() => {
    const root = document.documentElement
    
    // Remove all theme classes and apply only light mode if needed
    root.classList.remove('light')
    
    // Apply light mode
    if (!isDark) {
      root.classList.add('light')
    }
    
    // Persist to localStorage
    localStorage.setItem('theme-mode', isDark ? 'dark' : 'light')
  }, [isDark])

  const toggleMode = () => {
    setIsDark(!isDark)
  }

  return (
    <ThemeContext.Provider value={{
      isDark,
      toggleMode
    }}>
      {children}
    </ThemeContext.Provider>
  )
}