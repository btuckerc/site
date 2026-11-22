import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { preloadRoute } from './routeLoaders'
import './index.css'

const root = createRoot(document.getElementById('root'))

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

Promise.all([preloadRoute(window.location.pathname), waitForFont()])
  .catch(() => {})
  .finally(() => {
    root.render(
      <StrictMode>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <App />
        </BrowserRouter>
      </StrictMode>,
    )
  })
