import { useState, useEffect, createContext, useContext } from 'react'
import { safeGetItem, safeSetItem } from '../utils/safeStorage'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

const VALID_THEMES = ['dark', 'light', 'amber']

const THEME_COLORS = {
  dark: '#0f1115',
  light: '#e8eaed',
  amber: '#1d2021',
}

export const ThemeProvider = ({ children }) => {
  // Always start on the SSR default so initial client render matches server HTML.
  const [theme, setTheme] = useState('dark')
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const saved = safeGetItem('theme-mode')
    if (saved && VALID_THEMES.includes(saved) && saved !== 'dark') {
      setTheme(saved)
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    const root = document.documentElement

    root.classList.remove('light', 'amber')
    if (theme === 'light') {
      root.classList.add('light')
    } else if (theme === 'amber') {
      root.classList.add('amber')
    }

    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      THEME_COLORS[theme] || THEME_COLORS.dark
    )

    safeSetItem('theme-mode', theme)
  }, [theme, hydrated])

  const cycleTheme = () => {
    const currentIndex = VALID_THEMES.indexOf(theme)
    const nextIndex = (currentIndex + 1) % VALID_THEMES.length
    setTheme(VALID_THEMES[nextIndex])
  }

  const setSpecificTheme = (newTheme) => {
    if (VALID_THEMES.includes(newTheme)) {
      setTheme(newTheme)
    }
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === 'dark',
        cycleTheme,
        setTheme: setSpecificTheme,
        themes: VALID_THEMES,
        toggleMode: cycleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
