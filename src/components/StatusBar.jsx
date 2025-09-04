import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme.jsx'
import { SYMBOLS, LABELS, bracketed } from '../constants/symbols'

const StatusBar = () => {
  const navigate = useNavigate()
  const { theme, cycleTheme } = useTheme()
  
  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <title>Light theme - cycle to amber</title>
            <path d="M12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16ZM11 1H13V4H11V1ZM11 20H13V23H11V20ZM3.51472 4.92893L4.92893 3.51472L7.05025 5.63604L5.63604 7.05025L3.51472 4.92893ZM16.9497 18.364L18.364 16.9497L20.4853 19.0711L19.0711 20.4853L16.9497 18.364ZM19.0711 3.51472L20.4853 4.92893L18.364 7.05025L16.9497 5.63604L19.0711 3.51472ZM5.63604 16.9497L7.05025 18.364L4.92893 20.4853L3.51472 19.0711L5.63604 16.9497ZM23 11V13H20V11H23ZM4 11V13H1V11H4Z" />
          </svg>
        )
      case 'amber':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <title>Amber theme - cycle to dark</title>
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2M21 10.5C21 11.6 20.1 12.5 19 12.5C17.9 12.5 17 11.6 17 10.5C17 9.4 17.9 8.5 19 8.5C20.1 8.5 21 9.4 21 10.5M5 10.5C5 11.6 4.1 12.5 3 12.5C1.9 12.5 1 11.6 1 10.5C1 9.4 1.9 8.5 3 8.5C4.1 8.5 5 9.4 5 10.5M12 8C15.31 8 18 10.69 18 14S15.31 20 12 20S6 17.31 6 14S8.69 8 12 8M7.76 15.64L6.34 17.05L4.24 14.95L5.66 13.54L7.76 15.64M16.24 15.64L18.34 13.54L19.76 14.95L17.66 17.05L16.24 15.64M12 16C13.1 16 14 15.1 14 14S13.1 12 12 12S10 12.9 10 14S10.9 16 12 16Z"/>
          </svg>
        )
      default: // dark
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <title>Dark theme - cycle to light</title>
            <path d="M10 7C10 10.866 13.134 14 17 14C18.9584 14 20.729 13.1957 21.9995 11.8995C22 11.933 22 11.9665 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C12.0335 2 12.067 2 12.1005 2.0005C10.8043 3.27099 10 5.04157 10 7ZM4 12C4 16.4183 7.58172 20 12 20C15.0583 20 17.7158 18.2839 19.062 15.7621C18.3945 15.9187 17.7035 16 17 16C12.0294 16 8 11.9706 8 7C8 6.29648 8.08133 5.60547 8.2379 4.938C5.71611 6.28423 4 8.9417 4 12Z" />
          </svg>
        )
    }
  }
  
  const getNextThemeLabel = () => {
    switch (theme) {
      case 'dark': return 'light'
      case 'light': return 'amber'
      case 'amber': return 'dark'
      default: return 'light'
    }
  }

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-40 bg-bg-elev/90 backdrop-blur-sm border-b border-line"
      role="navigation"
      aria-label="Site header and theme controls"
    >
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between text-sm">
          {/* Site branding */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="font-mono text-accent font-bold hover:text-fg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 px-1"
              aria-label="Go to homepage"
              title="Return to homepage"
            >
              {bracketed(LABELS.SITE_INITIALS)}
            </button>
            <span className="text-muted" aria-label="Full name">
              {LABELS.SITE_NAME}
            </span>
          </div>

          {/* Center hint */}
          <div 
            className="absolute left-1/2 -translate-x-1/2 font-mono text-muted text-xs hidden sm:block"
            aria-label="Keyboard shortcut hint"
          >
type <kbd 
              className="px-1 bg-line"
              aria-label="colon key"
            >{SYMBOLS.COMMAND_PREFIX}</kbd> for commands
          </div>
          
          {/* Theme controls */}
          <div className="flex items-center gap-2" role="group" aria-label="Theme controls">
            {/* Theme toggle */}
            <button
              onClick={cycleTheme}
              className="p-1 text-muted hover:text-accent transition-colors
                focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
              aria-label={`Switch to ${getNextThemeLabel()} theme`}
              title={`Switch to ${getNextThemeLabel()} theme`}
            >
              <motion.div 
                className="w-4 h-4" 
                aria-hidden="true"
                key={theme}
                initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {getThemeIcon()}
              </motion.div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default StatusBar