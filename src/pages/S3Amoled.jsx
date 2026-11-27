import { Link, useLocation } from 'react-router-dom'
import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react'
import Breadcrumb from '../components/Breadcrumb'
import PageMeta from '../components/PageMeta'
import StarterSelectionCapture from '../components/StarterSelectionCapture'
import GrainCapture from '../components/GrainCapture'
import { CornerDemo, SectionVisual } from '../components/TechnicalDiagrams'
import { useActiveSection } from '../hooks/useActiveSection'
import copy from '../utils/storyCopy'
import '../styles/technical-readability.css'
import '../styles/project-navigation.css'

const NavigationDemo = lazy(() => import('../components/NavigationDemo'))

class NavigationDemoErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Unable to load the interactive Route 102 map.', error, info)
    this.props.onError?.()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="story-visual text-sm text-muted font-mono" role="alert">
          <p>The interactive Route 102 map could not load.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="tui-link-chip mt-4"
            data-nav-demo-error-action
          >
            reload page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

const DeferredNavigationDemo = ({ copy: visualCopy }) => {
  const location = useLocation()
  const hostRef = useRef(null)
  const pendingFocusRef = useRef(false)
  const [shouldLoad, setShouldLoad] = useState(false)

  const focusSettledContent = () => {
    if (!pendingFocusRef.current) return
    const host = hostRef.current
    if (!host) return
    // Only move focus if it still belongs to the loader host.
    if (document.activeElement && document.activeElement !== host && !host.contains(document.activeElement)) {
      pendingFocusRef.current = false
      return
    }
    const errorBtn = host.querySelector('[data-nav-demo-error-action]')
    if (errorBtn instanceof HTMLElement) {
      pendingFocusRef.current = false
      errorBtn.focus()
      return
    }
    const demoRoot = host.querySelector('.navigation-demo')
    if (demoRoot instanceof HTMLElement) {
      pendingFocusRef.current = false
      const target = demoRoot.querySelector('h3, input, select, button') || demoRoot
      if (!target.hasAttribute('tabindex') && target.tagName === 'H3') {
        target.setAttribute('tabindex', '-1')
      }
      target.focus()
    }
  }

  const handleManualLoad = () => {
    pendingFocusRef.current = true
    hostRef.current?.focus()
    setShouldLoad(true)
  }

  useEffect(() => {
    if (!shouldLoad || !pendingFocusRef.current) return undefined
    const host = hostRef.current
    if (!host) return undefined

    focusSettledContent()
    if (!pendingFocusRef.current || typeof MutationObserver !== 'function') return undefined

    const observer = new MutationObserver(() => {
      focusSettledContent()
      if (!pendingFocusRef.current) observer.disconnect()
    })
    observer.observe(host, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [shouldLoad])

  useEffect(() => {
    if (shouldLoad) return undefined
    if (location.hash === '#navigation' || typeof IntersectionObserver !== 'function') {
      setShouldLoad(true)
      return undefined
    }
    const target = hostRef.current
    if (!target) return undefined

    let observer = null
    let timerId = null

    const startObserving = () => {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            if (hostRef.current?.contains(document.activeElement)) {
              pendingFocusRef.current = true
              hostRef.current.focus({ preventScroll: true })
            }
            setShouldLoad(true)
            observer?.disconnect()
          }
        },
        { rootMargin: '0px 0px 300px 0px' }
      )
      observer.observe(target)
    }

    // If arriving at another section hash (e.g. #grain), wait for the hash jump
    // to settle (or the user's first scroll gesture) before observing so off-screen
    // deep links do not eagerly download the Route 102 map.
    const onUserScrollIntent = () => {
      if (timerId !== null) {
        window.clearTimeout(timerId)
        timerId = null
      }
      window.removeEventListener('wheel', onUserScrollIntent)
      window.removeEventListener('touchstart', onUserScrollIntent)
      if (!observer) startObserving()
    }

    if (location.hash && location.hash !== '#navigation') {
      window.addEventListener('wheel', onUserScrollIntent, { passive: true, once: true })
      window.addEventListener('touchstart', onUserScrollIntent, { passive: true, once: true })
      timerId = window.setTimeout(() => {
        window.removeEventListener('wheel', onUserScrollIntent)
        window.removeEventListener('touchstart', onUserScrollIntent)
        startObserving()
      }, 1200)
    } else {
      startObserving()
    }

    return () => {
      if (timerId !== null) window.clearTimeout(timerId)
      window.removeEventListener('wheel', onUserScrollIntent)
      window.removeEventListener('touchstart', onUserScrollIntent)
      observer?.disconnect()
    }
  }, [shouldLoad, location.hash])

  const placeholder = (
    <div className="story-visual min-h-[54rem] flex flex-col items-start justify-center gap-3 text-sm text-muted font-mono">
      <p>Interactive Route 102 map loads as you scroll here.</p>
      <button
        type="button"
        onClick={handleManualLoad}
        className="tui-link-chip"
      >
        load Route 102 map
      </button>
    </div>
  )

  return (
    <div ref={hostRef} tabIndex={-1} className="outline-none">
      {shouldLoad ? (
        <NavigationDemoErrorBoundary onError={() => window.requestAnimationFrame(focusSettledContent)}>
          <Suspense
            fallback={
              <div className="story-visual min-h-[54rem] flex items-center text-sm text-muted font-mono" role="status">
                Loading interactive Route 102 map...
              </div>
            }
          >
            <NavigationDemo copy={visualCopy} />
          </Suspense>
        </NavigationDemoErrorBoundary>
      ) : (
        placeholder
      )}
    </div>
  )
}

const sectionIds = copy.sections.map((section) => section.id)

export default function S3Amoled() {
  const activeSection = useActiveSection(sectionIds)
  const mobileNav = useRef(null)
  const labels = ['The battle', 'AI controls', 'Getting there', 'Checking a catch', 'Asking questions', 'Grain', 'Rounded corners']
  const sectionLinks = copy.sections.map((section, index) => (
    <a
      key={section.id}
      href={`#${section.id}`}
      aria-current={activeSection === section.id ? 'location' : undefined}
      onClick={() => { if (mobileNav.current) mobileNav.current.open = false }}
    >
      <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
      {labels[index]}
    </a>
  ))

  return (
    <>
      <PageMeta route="/projects/s3-amoled" />
      <div className="case-study-page technical-readability-page tui-page-shell min-h-svh">
        <div className="tui-rail">
          <Breadcrumb
            items={[
              { label: 'home', to: '/' },
              { label: 'omalo', to: '/projects/omalo' },
              { label: 's3-amoled' },
            ]}
          />

          <div className="story-layout">
            <aside className="story-nav-desktop" aria-label="On this page">
              <p className="case-study-kicker">On this page</p>
              <nav className="story-section-links" aria-label="Case study sections">{sectionLinks}</nav>
              <Link className="story-overview" to="/projects/omalo">omalo overview</Link>
            </aside>

            <article className="story-article">
              <header className="case-study-header">
                <p className="case-study-eyebrow">inside omalo / s3-amoled</p>
                <h1 className="tui-page-title mt-3 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">{copy.title}</h1>
                <p className="case-study-copy mt-4">{copy.intro}</p>
                <a className="tui-link-chip mt-5 inline-flex" href="https://tuckercraig.com/DIG101/the-future-of-ai-is-openai/" target="_blank" rel="noopener noreferrer" aria-describedby="new-tab-note">read my 2017 post on AI and Dota</a>
                <p className="case-study-status mt-4 text-xs font-mono text-muted">Prototype · Waveshare ESP32-S3 touch AMOLED</p>
              </header>

              <details className="story-nav-mobile" ref={mobileNav}>
                <summary className="tui-summary"><span className="tui-disclosure" aria-hidden="true" /><span>On this page</span></summary>
                <nav className="story-section-links" aria-label="Case study sections">{sectionLinks}</nav>
              </details>

              <div className="technical-readability-panel space-y-10">
                {copy.sections.map((section) => (
                  <section className="case-study-section scroll-mt-24" id={section.id} key={section.id} aria-labelledby={`${section.id}-title`}>
                    <p className="case-study-kicker">{section.title.split(' / ')[0]}</p>
                    <h2 className="case-study-section-title mt-2" id={`${section.id}-title`}>
                      <a href={`#${section.id}`}>{section.title.split(' / ')[1]}</a>
                    </h2>
                    {section.paragraphs.map((text) => (
                      <p key={text} className="case-study-copy mt-4">{text}</p>
                    ))}
                    <div className="mt-6">
                      {section.id === 'navigation' && (
                        <DeferredNavigationDemo copy={section.visual} />
                      )}
                      {section.id === 'handoff' && (
                        <>
                          <ol className="story-steps" aria-label="Battle replay sequence">
                            <li>1. My request</li>
                            <li>2. The battle</li>
                            <li>3. The result</li>
                          </ol>
                          <StarterSelectionCapture className="story-capture" />
                        </>
                      )}
                      {section.id === 'grain' && (
                        <>
                          <GrainCapture className="story-capture" />
                          <details className="story-detail">
                            <summary className="tui-summary">
                              <span className="tui-disclosure" aria-hidden="true" />
                              <span>Look closer at the play area</span>
                            </summary>
                            <p className="text-sm text-muted my-3">Zoomed-in still from the same desktop capture. Scroll around to inspect the pixels.</p>
                            <div className="story-zoom">
                              <img src="/media/s3-amoled/grain-bounce-off-on-catch-v4-poster.png" alt="Enlarged Grain capture, including the play area and its controls." width="368" height="448" loading="lazy" decoding="async" />
                            </div>
                          </details>
                        </>
                      )}
                      {section.id === 'corners' ? <CornerDemo /> : <SectionVisual id={section.id} />}
                    </div>
                  </section>
                ))}
                <footer className="case-study-section">
                  <p className="case-study-copy">{copy.closing}</p>
                  <Link className="tui-link-chip mt-5 inline-flex" to="/projects/omalo">explore omalo</Link>
                  <details className="story-detail">
                    <summary className="tui-summary">
                      <span className="tui-disclosure" aria-hidden="true" />
                      <span>Current limits and source</span>
                    </summary>
                    <p className="case-study-copy mt-3">Goals can still fail, and I haven&apos;t proven out a full autonomous run of Pokémon Emerald. Each clip notes how it was captured, and the diagrams show the current design. I&apos;ll link the source here once it&apos;s ready to share.</p>
                  </details>
                </footer>
              </div>
            </article>
          </div>
        </div>
      </div>
    </>
  )
}
