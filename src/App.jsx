import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { lazy, Suspense, useState } from 'react'
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
    <div className="min-h-screen bg-bg text-fg overflow-x-hidden">
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
  )
}

function App() {
  return (
    <ThemeProvider>
      <FontProvider>
        <FocusProvider>
          <AppContent />
        </FocusProvider>
      </FontProvider>
    </ThemeProvider>
  )
}

export default App