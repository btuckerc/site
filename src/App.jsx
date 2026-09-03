import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import { lazy, Suspense, useEffect, useState } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from './hooks/useTheme.jsx'
import { FontProvider } from './hooks/useFont.jsx'
import { FocusProvider } from './hooks/useRovingFocus.jsx'
import { useHotkeys, useScrollTargets } from './hooks/useHotkeys'
import StatusBar from './components/StatusBar'
import CommandPalette from './components/CommandPalette'
import Footer from './components/Footer'

// Lazy load pages for better performance
const loadHomePage = () => import('./pages/Home')
const loadAboutPage = () => import('./pages/About')
const loadProjectsPage = () => import('./pages/Projects')
const loadContactPage = () => import('./pages/Contact')
const loadFlippingSevenPrivacyPage = () => import('./pages/FlippingSevenPrivacy')

const Home = lazy(loadHomePage)
const About = lazy(loadAboutPage)
const Projects = lazy(loadProjectsPage)
const Contact = lazy(loadContactPage)
const FlippingSevenPrivacy = lazy(loadFlippingSevenPrivacyPage)

const preloadPage = (loader) => {
  loader().catch(() => {})
}

const scheduleIdleTask = (callback) => {
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, { timeout: 1800 })
  }

  return window.setTimeout(callback, 450)
}

const cancelIdleTask = (taskId) => {
  if ('cancelIdleCallback' in window) {
    window.cancelIdleCallback(taskId)
    return
  }

  window.clearTimeout(taskId)
}

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
        searchInput.select?.()
      } else {
        navigate('/projects', { state: { focusSearch: Date.now() } })
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
    <div className="min-h-svh text-fg overflow-x-hidden relative isolate">
      <div aria-hidden="true" className="site-backdrop" />

      <div className="relative z-10">
        {/* Skip to main content for accessibility */}
        <a href="#main-content" className="skip-to-main">
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
                <Route
                  path="/privacy/flipping-seven-calculator"
                  element={<FlippingSevenPrivacy />}
                />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </main>
        
        <Footer onCommandPaletteOpen={() => setIsCommandPaletteOpen(true)} />
        
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
            <MotionConfig reducedMotion="user">
              <AppContent />
            </MotionConfig>
          </FocusProvider>
        </FontProvider>
      </ThemeProvider>
    </HelmetProvider>
  )
}

export default App
