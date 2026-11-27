import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { preloadRoute } from './routeLoaders'
import './index.css'

const container = document.getElementById('root')

// Wait briefly on desktop so cached reloads paint in the chosen font without
// visibly jumping, while slow/cold networks still render promptly and swap.
const FONT_WAIT_MS = 120
const isPrimaryTouch = () => (
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(hover: none) and (pointer: coarse)').matches
)
const waitForFont = () => {
  if (isPrimaryTouch()) return Promise.resolve()
  const family = getComputedStyle(document.documentElement).getPropertyValue('--font-family').trim()
  if (!family || !document.fonts?.load) return Promise.resolve()
  return Promise.race([
    document.fonts.load(`1em ${family}`),
    new Promise((resolve) => setTimeout(resolve, FONT_WAIT_MS)),
  ])
}

const appTree = (
  <StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </BrowserRouter>
  </StrictMode>
)

const preloadPromise = preloadRoute(window.location.pathname)
  .then(() => true)
  .catch(() => false)

Promise.all([preloadPromise, waitForFont().catch(() => {})]).then(([routeLoaded]) => {
  if (container.hasChildNodes()) {
    if (!routeLoaded) {
      const retryKey = `route-preload-retry:${window.location.pathname}`
      try {
        if (!sessionStorage.getItem(retryKey)) {
          sessionStorage.setItem(retryKey, '1')
          window.location.reload()
        }
      } catch {
        // Storage unavailable; keep static SSR HTML intact.
      }
      return
    }
    hydrateRoot(container, appTree)
  } else {
    createRoot(container).render(appTree)
  }
})
