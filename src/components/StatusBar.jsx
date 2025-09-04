import { motion } from 'framer-motion'
import { useTheme } from '../hooks/useTheme.jsx'

const StatusBar = () => {
  const { isDark, toggleMode, cycleVariant, themeVariant } = useTheme()

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-40 bg-bg-elev/90 backdrop-blur-sm border-b border-line"
      initial={{ y: -40 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      role="navigation"
      aria-label="Site header and theme controls"
    >
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between text-sm">
          {/* Site branding */}
          <div className="flex items-center gap-3">
            <span 
              className="font-mono text-accent font-bold"
              role="img" 
              aria-label="Site initials"
            >
              [TC]
            </span>
            <span className="text-muted" aria-label="Full name">
              tucker craig
            </span>
          </div>

          {/* Center hint */}
          <div 
            className="absolute left-1/2 -translate-x-1/2 font-mono text-muted text-xs hidden sm:block"
            aria-label="Keyboard shortcut hint"
          >
            type <kbd 
              className="px-1 bg-line rounded"
              aria-label="colon key"
            >:</kbd> for commands
          </div>
          
          {/* Theme controls */}
          <div className="flex items-center gap-2" role="group" aria-label="Theme controls">
            {/* Theme variant indicator */}
            <button
              onClick={cycleVariant}
              className="font-mono text-xs text-muted hover:text-accent transition-colors px-1
                focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded"
              aria-label={`Current theme variant: ${themeVariant}. Click to cycle to next variant.`}
              title={`Theme: ${themeVariant} (click to cycle)`}
            >
              {themeVariant.charAt(0).toUpperCase()}
            </button>
            
            {/* Mode toggle */}
            <button
              onClick={toggleMode}
              className="p-1 rounded text-muted hover:text-accent transition-colors
                focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              <motion.div
                key={isDark}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="w-4 h-4"
                aria-hidden="true"
              >
                {isDark ? (
                  // Sun icon
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <title>Sun icon - switch to light mode</title>
                    <path d="M12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16ZM11 1H13V4H11V1ZM11 20H13V23H11V20ZM3.51472 4.92893L4.92893 3.51472L7.05025 5.63604L5.63604 7.05025L3.51472 4.92893ZM16.9497 18.364L18.364 16.9497L20.4853 19.0711L19.0711 20.4853L16.9497 18.364ZM19.0711 3.51472L20.4853 4.92893L18.364 7.05025L16.9497 5.63604L19.0711 3.51472ZM5.63604 16.9497L7.05025 18.364L4.92893 20.4853L3.51472 19.0711L5.63604 16.9497ZM23 11V13H20V11H23ZM4 11V13H1V11H4Z" />
                  </svg>
                ) : (
                  // Moon icon  
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <title>Moon icon - switch to dark mode</title>
                    <path d="M10 7C10 10.866 13.134 14 17 14C18.9584 14 20.729 13.1957 21.9995 11.8995C22 11.933 22 11.9665 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C12.0335 2 12.067 2 12.1005 2.0005C10.8043 3.27099 10 5.04157 10 7ZM4 12C4 16.4183 7.58172 20 12 20C15.0583 20 17.7158 18.2839 19.062 15.7621C18.3945 15.9187 17.7035 16 17 16C12.0294 16 8 11.9706 8 7C8 6.29648 8.08133 5.60547 8.2379 4.938C5.71611 6.28423 4 8.9417 4 12Z" />
                  </svg>
                )}
              </motion.div>
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default StatusBar