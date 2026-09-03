import { useState, useEffect, createContext, useContext } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

const THEME_COLORS = {
  dark: '#0f1115',
  light: '#e8eaed',
  amber: '#1d2021',
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme-mode')
    return saved || 'dark' // Default to dark
  })

  useEffect(() => {
    const root = document.documentElement

    // Remove all theme classes
    root.classList.remove('light', 'amber')

    // Apply theme class if not dark (dark is default)
    if (theme === 'light') {
      root.classList.add('light')
    } else if (theme === 'amber') {
      root.classList.add('amber')
    }

    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      THEME_COLORS[theme] || THEME_COLORS.dark
    )

    // Persist to localStorage
    localStorage.setItem('theme-mode', theme)
  }, [theme])

  const cycleTheme = () => {
    const themes = ['dark', 'light', 'amber']
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  const setSpecificTheme = (newTheme) => {
    setTheme(newTheme)
  }

  const themes = ['dark', 'light', 'amber']

  return (
    <ThemeContext.Provider value={{
      theme,
      isDark: theme === 'dark',
      cycleTheme,
      setTheme: setSpecificTheme,
      themes,
      // Backwards compatibility
      toggleMode: cycleTheme
    }}>
      {children}
    </ThemeContext.Provider>
  )
}