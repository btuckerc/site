import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { lazy, Suspense, useState } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from './hooks/useTheme.jsx'
import { FontProvider } from './hooks/useFont.jsx'
import { FocusProvider } from './hooks/useRovingFocus.jsx'
import { useHotkeys, useScrollTargets } from './hooks/useHotkeys'
import StatusBar from './components/StatusBar'
import CommandPalette from './components/CommandPalette'
import Footer from './components/Footer'

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Projects = lazy(() => import('./pages/Projects'))
const Contact = lazy(() => import('./pages/Contact'))

// Minimal loading component
const PageLoader = () => null

function AppContent() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const { topRef, bottomRef, scrollToTop, scrollToBottom } = useScrollTargets()
  const navigate = useNavigate()
  const location = useLocation()

  // Set up global hotkeys
  useHotkeys({
    onCommandPalette: () => setIsCommandPaletteOpen(true),
    onSearch: () => {
      // Focus search if on projects page, otherwise go to projects
      const searchInput = document.querySelector('[data-search-input]')
      if (searchInput) {
        searchInput.focus()
      } else {
        window.location.pathname = '/projects'
      }
    },
    onGoToTop: scrollToTop,
    onGoToBottom: scrollToBottom,
    onEscape: () => {
      if (isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false)
      } else if (location.pathname !== '/') {
        // Navigate back to home when ESC is pressed on modal pages
        navigate('/')
      }
    }
  })

  return (
    <div className="min-h-screen text-fg overflow-x-hidden relative">
      {/* Ambient overlays for TUI depth */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-bg/80 via-transparent to-bg/70" />
        <div
          className="absolute inset-0 opacity-10 mix-blend-soft-light"
          style={{
            backgroundImage: 'linear-gradient(rgba(201,205,210,0.06) 1px, transparent 1px)',
            backgroundSize: '100% 4px'
          }}
        />
        <div
          className="absolute inset-0 opacity-15 mix-blend-color-dodge"
          style={{
            background: 'radial-gradient(circle at 20% 20%, rgba(201,205,210,0.16), transparent 45%), radial-gradient(circle at 80% 25%, rgba(201,205,210,0.12), transparent 52%), radial-gradient(circle at 50% 85%, rgba(201,205,210,0.1), transparent 55%)'
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Skip to main content for accessibility */}
        <a href="#main-content" className="skip-to-main sr-only">
          Skip to main content
        </a>
        
        {/* Top scroll target */}
        <div ref={topRef} tabIndex={-1} className="absolute top-0" aria-hidden="true" />
        
        {/* Header/Banner landmark */}
        <header role="banner">
          <StatusBar />
        </header>
        
        {/* Main content landmark */}
        <main id="main-content" role="main" tabIndex={-1}>
          <Suspense fallback={<PageLoader />}>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </main>
        
        {/* Footer landmark */}
        <footer role="contentinfo">
          <Footer />
        </footer>
        
        {/* Bottom scroll target */}
        <div ref={bottomRef} tabIndex={-1} className="absolute bottom-0" aria-hidden="true" />
        
        {/* Command Palette - complementary landmark */}
        <aside role="complementary" aria-label="Command palette">
          <CommandPalette 
            isOpen={isCommandPaletteOpen}
            onClose={() => setIsCommandPaletteOpen(false)}
          />
        </aside>
        
        {/* Live region for announcements */}
        <div 
          id="announcements" 
          aria-live="polite" 
          aria-atomic="true"
          className="sr-only"
        />
      </div>
    </div>
  )
}

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <FontProvider>
          <FocusProvider>
            <AppContent />
          </FocusProvider>
        </FontProvider>
      </ThemeProvider>
    </HelmetProvider>
  )
}

export default App