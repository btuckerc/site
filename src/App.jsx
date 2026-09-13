import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import { lazy, Suspense, useState } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from './hooks/useTheme.jsx'
import { FontProvider } from './hooks/useFont.jsx'
import { FocusProvider } from './hooks/useRovingFocus.jsx'
import { useHotkeys, useScrollTargets } from './hooks/useHotkeys'
import StatusBar from './components/StatusBar'
import CommandPalette from './components/CommandPalette'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import CloseButton from './components/CloseButton'
import RouteErrorBoundary from './components/RouteErrorBoundary'

// Lazy load pages for better performance
const loadHomePage = () => import('./pages/Home')
const loadAboutPage = () => import('./pages/About')
const loadProjectsPage = () => import('./pages/Projects')
const loadOmaloPage = () => import('./pages/Omalo')
const loadS3AmoledPage = () => import('./pages/S3Amoled')
const loadContactPage = () => import('./pages/Contact')
const loadFlippingSevenPrivacyPage = () => import('./pages/FlippingSevenPrivacy')

const Home = lazy(loadHomePage)
const About = lazy(loadAboutPage)
const Projects = lazy(loadProjectsPage)
const Omalo = lazy(loadOmaloPage)
const S3Amoled = lazy(loadS3AmoledPage)
const Contact = lazy(loadContactPage)
const FlippingSevenPrivacy = lazy(loadFlippingSevenPrivacyPage)

const PageLoader = () => (
  <div
    className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6"
    role="status"
    aria-live="polite"
  >
    <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
      loading page…
    </span>
  </div>
)

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
    <div className="tui-app-shell min-h-svh text-fg relative isolate">
      <ScrollToTop />
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
          {location.pathname !== '/' && (
            <div className="tui-global-back-row">
              <div className="tui-global-back-inner">
                <CloseButton />
              </div>
            </div>
          )}
          <RouteErrorBoundary resetKey={location.pathname}>
            <Suspense fallback={<PageLoader />}>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/omalo" element={<Omalo />} />
                  <Route path="/projects/s3-amoled" element={<S3Amoled />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route
                    path="/privacy/flipping-seven-calculator"
                    element={<FlippingSevenPrivacy />}
                  />
                </Routes>
              </AnimatePresence>
            </Suspense>
          </RouteErrorBoundary>
        </main>
        
        <Footer isCommandPaletteOpen={isCommandPaletteOpen} onCommandPaletteToggle={() => setIsCommandPaletteOpen(open => !open)} />
        
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
