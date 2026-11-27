import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { lazy, Suspense, useCallback, useRef, useState } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from './hooks/useTheme.jsx'
import { FontProvider } from './hooks/useFont.jsx'
import { FocusProvider } from './hooks/useRovingFocus.jsx'
import { useHotkeys, useScrollTargets } from './hooks/useHotkeys'
import { useIsomorphicLayoutEffect } from './hooks/useIsomorphicLayoutEffect'
import StatusBar from './components/StatusBar'
import CommandPalette from './components/CommandPalette'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import RouteErrorBoundary from './components/RouteErrorBoundary'
import { routeLoaders } from './routeLoaders'

const Home = lazy(routeLoaders['/'])
const Workflow = lazy(routeLoaders['/workflow'])
const About = lazy(routeLoaders['/about'])
const Projects = lazy(routeLoaders['/projects'])
const Omalo = lazy(routeLoaders['/projects/omalo'])
const S3Amoled = lazy(routeLoaders['/projects/s3-amoled'])
const Contact = lazy(routeLoaders['/contact'])
const FlippingSevenPrivacy = lazy(routeLoaders['/privacy/flipping-seven-calculator'])
const HerdwickPrivacy = lazy(routeLoaders['/privacy/herdwick'])
const HerdwickSupport = lazy(routeLoaders['/herdwick/support'])
const InkjoinPrivacy = lazy(routeLoaders['/privacy/inkjoin'])
const InkjoinSupport = lazy(routeLoaders['/inkjoin/support'])

function AppContent() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const backgroundRef = useRef(null)
  const paletteOpenerRef = useRef(null)
  const { scrollToTop, scrollToBottom } = useScrollTargets()
  const navigate = useNavigate()
  const location = useLocation()

  const resolvePersistentOpener = (element) => {
    if (!(element instanceof HTMLElement)) return null
    const popover = element.closest('#footer-font-picker, #footer-social-links')
    if (popover?.id) {
      const trigger = document.querySelector(`[aria-controls="${popover.id}"]`)
      if (trigger instanceof HTMLElement) return trigger
    }
    return element
  }

  const openCommandPalette = useCallback(() => {
    paletteOpenerRef.current = resolvePersistentOpener(document.activeElement)
    setIsCommandPaletteOpen(true)
  }, [])

  const toggleCommandPalette = useCallback((openerElement = null) => {
    setIsCommandPaletteOpen((open) => {
      if (!open) {
        const opener = openerElement instanceof HTMLElement ? openerElement : document.activeElement
        paletteOpenerRef.current = resolvePersistentOpener(opener)
      }
      return !open
    })
  }, [])

  useIsomorphicLayoutEffect(() => {
    if (backgroundRef.current) {
      backgroundRef.current.inert = isCommandPaletteOpen
    }
  }, [isCommandPaletteOpen])

  useHotkeys({
    disabled: isCommandPaletteOpen,
    onCommandPalette: openCommandPalette,
    onSearch: () => {
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
        navigate('/')
      }
    }
  })

  return (
    <div className="tui-app-shell min-h-svh text-fg relative isolate">
      <ScrollToTop />
      <div aria-hidden="true" className="site-backdrop" />

      <div className="relative z-10">
        <div ref={backgroundRef}>
          <a href="#main-content" className="skip-to-main">
            Skip to main content
          </a>

          <header role="banner" className="sticky top-0 z-40">
            <StatusBar />
          </header>

          <main id="main-content" role="main" tabIndex={-1}>
            <RouteErrorBoundary resetKey={location.pathname}>
              <Suspense fallback={null}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/workflow" element={<Workflow />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/omalo" element={<Omalo />} />
                  <Route path="/projects/s3-amoled" element={<S3Amoled />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route
                    path="/privacy/flipping-seven-calculator"
                    element={<FlippingSevenPrivacy />}
                  />
                  <Route path="/privacy/herdwick" element={<HerdwickPrivacy />} />
                  <Route path="/herdwick/support" element={<HerdwickSupport />} />
                  <Route path="/privacy/inkjoin" element={<InkjoinPrivacy />} />
                  <Route path="/inkjoin/support" element={<InkjoinSupport />} />
                </Routes>
              </Suspense>
            </RouteErrorBoundary>
          </main>

          <Footer
            isCommandPaletteOpen={isCommandPaletteOpen}
            onCommandPaletteToggle={toggleCommandPalette}
          />
        </div>

        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          returnFocusRef={paletteOpenerRef}
        />

        <div
          id="announcements"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        />
        <span id="new-tab-note" className="sr-only">Opens in a new tab.</span>
      </div>
    </div>
  )
}

function App({ helmetContext } = {}) {
  return (
    <HelmetProvider context={helmetContext}>
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
