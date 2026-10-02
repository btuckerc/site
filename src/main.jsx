import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { preloadRoute } from './routeLoaders'
import './index.css'
import './styles/interaction.css'

const root = createRoot(document.getElementById('root'))

// The selected web font swaps in once it's ready; when it's cached, that
// happens right after the first paint and the text visibly jumps. Wait briefly
// for it so the first paint uses the real font. Slow networks still swap.
const FONT_WAIT_MS = 500
const waitForFont = () => {
  const family = getComputedStyle(document.documentElement).getPropertyValue('--font-family').trim()
  if (!family || !document.fonts?.load) return Promise.resolve()
  return Promise.race([
    document.fonts.load(`1em ${family}`),
    new Promise((resolve) => setTimeout(resolve, FONT_WAIT_MS)),
  ])
}

// Render once the current page's chunk and font are ready, so a reload goes
// straight to the finished page instead of flashing an empty route or the
// fallback font. A failed preload still renders; the route error boundary
// handles the retry.
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