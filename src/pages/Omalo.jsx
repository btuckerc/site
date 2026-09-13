import GrainCapture from '../components/GrainCapture'
import AppScreens from '../components/AppScreens'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageMeta from '../components/PageMeta'
import StarterSelectionCapture from '../components/StarterSelectionCapture'
import '../styles/omalo-refinements.css'
import '../styles/project-navigation.css'

const shareImage = 'https://btuckerc.dev/media/omalo/share.jpg'
const pageUrl = 'https://btuckerc.dev/projects/omalo'

const sectionLinks = [
  { id: 'device', label: 'The device' },
  { id: 'pokemon', label: 'Pokémon' },
  { id: 'grain', label: 'Grain' },
  { id: 'extensibility', label: 'Extend it' },
  { id: 'the-name', label: 'The name' },
]

const useActiveSection = () => {
  const [activeSection, setActiveSection] = useState('device')

  useEffect(() => {
    if (typeof IntersectionObserver !== 'function') return undefined

    const visibleSections = new Map()
    let atPageEnd = false
    const sections = sectionLinks
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean)

    const updateActiveSection = () => {
      if (atPageEnd) {
        setActiveSection(sectionLinks.at(-1).id)
        return
      }

      const visible = sectionLinks
        .map(({ id }) => ({ id, ...visibleSections.get(id) }))
        .filter(({ isIntersecting }) => isIntersecting)
        .sort((a, b) => a.top - b.top || b.ratio - a.ratio)

      if (visible[0]) setActiveSection(visible[0].id)
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        visibleSections.set(entry.target.id, {
          isIntersecting: entry.isIntersecting,
          top: entry.boundingClientRect.top,
          ratio: entry.intersectionRatio,
        })
      })
      updateActiveSection()
    }, {
      rootMargin: '-80px 0px -52% 0px',
      threshold: [0, 0.2, 0.5, 0.8, 1],
    })

    const endMarker = document.getElementById('omalo-page-end')
    const endObserver = new IntersectionObserver(([entry]) => {
      atPageEnd = entry.isIntersecting
      if (atPageEnd) {
        setActiveSection(sectionLinks.at(-1).id)
        return
      }

      // The section observer can keep its last intersection state while the
      // end marker leaves the viewport. Read the current rectangles here so
      // scrolling back from the page edge immediately restores the section
      // nearest the TOC activation line.
      const activationLine = 80
      const current = sections
        .map((section) => ({ id: section.id, top: section.getBoundingClientRect().top }))
        .filter(({ top }) => top <= activationLine)
        .at(-1)
      if (current) {
        setActiveSection(current.id)
      } else {
        updateActiveSection()
      }
    }, { threshold: 0 })

    sections.forEach((section) => observer.observe(section))
    if (endMarker) endObserver.observe(endMarker)
    return () => {
      observer.disconnect()
      endObserver.disconnect()
    }
  }, [])

  return activeSection
}

const OmaloTableOfContents = ({ activeSection }) => {
  const mobileNav = useRef(null)
  const links = sectionLinks.map(({ id, label }, index) => (
    <a
      key={id}
      href={`#${id}`}
      aria-current={activeSection === id ? 'location' : undefined}
      onClick={() => { if (mobileNav.current) mobileNav.current.open = false }}
    >
      <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{label}
    </a>
  ))

  return (
    <>
      <aside className="story-nav-desktop" aria-label="On this page">
        <p className="case-study-kicker">on this page</p>
        <nav className="story-section-links" aria-label="Omalo sections">
          {links}
        </nav>
        <Link to="/projects/s3-amoled" className="story-overview">technical notes ↗</Link>
      </aside>

      <details className="story-nav-mobile" ref={mobileNav}>
        <summary>On this page</summary>
        <nav className="story-section-links" aria-label="Omalo sections">
          {links}
        </nav>
        <Link to="/projects/s3-amoled" className="story-overview">technical notes ↗</Link>
      </details>
    </>
  )
}

const OmaloDeviceCard = () => (
  <div className="omalo-device-card">
    <figure className="omalo-device-figure">
      <div className="omalo-device-photo-frame">
        <img
          src="/media/s3-amoled/device-in-hand-public.jpg"
          alt="A hand holds a small rounded device running Pokémon Emerald. The screen shows a queued ‘Beat the game’ goal and asks the player to continue, then say go."
          width="756"
          height="1008"
          loading="eager"
          decoding="async"
        />
      </div>
      <figcaption>Prototype with a gameplay goal queued.</figcaption>
    </figure>
    <div
      className="omalo-identity-card"
      role="img"
      aria-label="omalo is a pocket companion and ichr is the life inside."
    >
      <div className="omalo-identity-line omalo-identity-device">
        <span className="omalo-identity-name">omalo</span>
        <span className="omalo-identity-role">a pocket companion</span>
      </div>
      <div className="omalo-identity-rule" aria-hidden="true" />
      <div className="omalo-identity-line omalo-identity-software">
        <span className="omalo-identity-name">ichr</span>
        <span className="omalo-identity-role">the life inside</span>
      </div>
      <div className="omalo-identity-footer">
        <span className="omalo-patina-dot" aria-hidden="true" />
        <span>omalo / ichr</span>
      </div>
    </div>
  </div>
)

const Omalo = () => {
  const activeSection = useActiveSection()

  return <>
    <PageMeta
      title="omalo — a pocket companion running ichr"
      description="omalo is a pocket companion running ichr. Pokémon Emerald runs on the device with an AI handoff for gameplay goals."
      url={pageUrl}
      type="article"
      image={shareImage}
      imageAlt="omalo, a pocket companion running ichr, with Pokémon Emerald on omalo."
    />

    <div className="omalo-page tui-page-shell min-h-svh px-4 pb-32">
      <div className="mx-auto max-w-6xl">
        <div className="story-layout">
          <OmaloTableOfContents activeSection={activeSection} />
          <div className="omalo-content">
            <motion.section
              id="device"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="omalo-hero omalo-device-hero"
              aria-labelledby="omalo-title"
            >
          <div className="omalo-hero-copy">
            <p className="omalo-kicker">omalo</p>
            <h1 id="omalo-title" className="omalo-title">omalo</h1>
            <p className="omalo-subtitle">a pocket companion running ichr</p>
            <p className="omalo-copy">
              I&apos;m writing the firmware for it. You can play Pokémon Emerald yourself or give the AI a gameplay goal.
            </p>
            <p className="omalo-status">
              <span aria-hidden="true">●</span> Prototype
            </p>
            <div className="omalo-actions">
              <a href="#pokemon" className="omalo-action omalo-action-primary">see Pokémon →</a>
              <Link to="/projects/s3-amoled" className="omalo-action">technical notes</Link>
            </div>
          </div>
          <OmaloDeviceCard />
            </motion.section>

            <motion.section
              id="pokemon"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04, duration: 0.2, ease: 'easeOut' }}
              className="omalo-hero omalo-game-hero"
              aria-labelledby="pokemon-title"
            >
          <div className="omalo-hero-copy">
            <p className="omalo-kicker">Pokémon Emerald</p>
            <h2 id="pokemon-title" className="omalo-section-title">Pokémon Emerald on omalo</h2>
            <p className="omalo-copy">
              I chose Mudkip, then asked Luna to defeat the Zigzagoon. The local battle controller takes it from there. You can take over again with the device controls.
            </p>
            <p className="omalo-copy omalo-copy-muted">
              Speech transcription and model requests use network services over Wi-Fi.
            </p>
            <div className="omalo-actions">
              <Link to="/projects/s3-amoled#handoff" className="omalo-action omalo-action-light">how the handoff works</Link>
            </div>
          </div>
          <StarterSelectionCapture className="omalo-game-capture-status" />
            </motion.section>

            <section id="grain" className="omalo-support-section" aria-labelledby="grain-title">
          <div className="omalo-support-copy">
            <p className="omalo-kicker">Grain</p>
            <h2 id="grain-title" className="omalo-section-title">A tiny game you play by moving it</h2>
            <p className="omalo-copy">
              Move omalo to steer a fleck around a rounded play area. The capture compares what happens with bounce off and on.
            </p>
            <div className="omalo-actions">
              <Link to="/projects/s3-amoled#grain" className="omalo-action">read the Grain notes</Link>
            </div>
          </div>
          <GrainCapture className="omalo-support-note" />
            </section>

            <section id="extensibility" className="omalo-technical-link scroll-mt-20" aria-labelledby="omalo-extend-title">
              <div>
                <p className="omalo-kicker">ichr</p>
                <h2 id="omalo-extend-title" className="omalo-section-title">Built to be extended</h2>
                <p className="omalo-copy">
                  ichr is the software inside omalo. I&apos;m building it with open source in mind, so people can modify it, extend it, and adapt it to their own hardware.
                </p>
                <AppScreens />
              </div>
            </section>

            <section id="the-name" className="omalo-support-section" aria-labelledby="omalo-name-title">
              <div className="omalo-support-copy">
                <p className="omalo-kicker">the name</p>
                <h2 id="omalo-name-title" className="omalo-section-title">How omalo got its name</h2>
                <p className="omalo-copy">
                  I first wanted to call it talos, but that name was taken. Then came talo. I love oma projects like{' '}
                  <a href="https://omarchy.org/" className="underline underline-offset-4" target="_blank" rel="noopener noreferrer">Omarchy</a>,
                  {' '}so oma + talo became omalo.
                </p>
                <h3 className="mt-7 font-mono text-lg font-semibold">ichor → ichr</h3>
                <p className="omalo-copy">
                  <code>ichr</code> is short for <em>ichor</em>. In the Greek story of Talos, ichor is the life fluid inside a bronze body. I use that idea as a metaphor for a soul: ichr is the software inside omalo that makes it respond.{' '}
                  <a href="https://www.greekmythology.com/Myths/Elements/Ichor/ichor.html" className="underline underline-offset-4" target="_blank" rel="noopener noreferrer">A quick read on ichor ↗</a>
                </p>
              </div>
              <figure className="omalo-name-diagram" aria-label="The name blends oma with talo">
                <div className="omalo-name-origins">
                  <div>
                    <span className="omalo-name-step">first idea</span>
                    <span className="omalo-name-source">talo<s>s</s></span>
                    <span className="omalo-name-change">→ talo</span>
                  </div>
                  <div>
                    <span className="omalo-name-step">the influence</span>
                    <a href="https://omarchy.org/" target="_blank" rel="noopener noreferrer" className="omalo-name-source">Omarchy ↗</a>
                    <span className="omalo-name-change">→ oma</span>
                  </div>
                </div>
                <div className="omalo-name-blend"><span>oma</span><span aria-hidden="true">+</span><span>talo</span></div>
                <span className="omalo-name-arrow" aria-hidden="true">↓</span>
                <strong className="omalo-name-result"><span>oma</span>lo</strong>
              </figure>
            </section>

            <section className="omalo-technical-link" aria-labelledby="omalo-technical-title">
          <div>
            <p className="omalo-kicker">s3-amoled</p>
            <h2 id="omalo-technical-title" className="omalo-section-title">How it works</h2>
            <p className="omalo-copy">
              The detailed project page covers the handoff boundary, rounded tray, and catch-check explanation.
            </p>
          </div>
          <Link to="/projects/s3-amoled" className="omalo-action omalo-action-primary">open s3-amoled →</Link>
            </section>
          </div>
        </div>
      </div>
    </div>
    <div id="omalo-page-end" className="h-px" aria-hidden="true" />
  </>
}

export default Omalo
