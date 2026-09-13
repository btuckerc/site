import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import PageMeta from '../components/PageMeta'
import StarterSelectionCapture from '../components/StarterSelectionCapture'
import GrainCapture from '../components/GrainCapture'
import NavigationDemo from '../components/NavigationDemo'
import { CornerDemo, SectionVisual } from '../components/TechnicalDiagrams'
import copy from '../utils/storyCopy'
import '../styles/technical-readability.css'
import '../styles/project-navigation.css'

export default function S3Amoled() {
  const [activeSection, setActiveSection] = useState(copy.sections[0].id)
  const mobileNav = useRef(null)
  useEffect(() => {
    const update = () => {
      const sections = copy.sections.map(s => document.getElementById(s.id)).filter(Boolean)
      const passed = sections.filter(s => s.getBoundingClientRect().top <= 140)
      setActiveSection((passed.at(-1) || sections[0])?.id || copy.sections[0].id)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  const labels = ['The battle', 'AI controls', 'Getting there', 'Checking a catch', 'Asking questions', 'Grain', 'Rounded corners']
  const sectionLinks = copy.sections.map((section, index) => <a
    key={section.id} href={'#' + section.id} aria-current={activeSection === section.id ? 'location' : undefined}
    onClick={() => { if (mobileNav.current) mobileNav.current.open = false }}
  ><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{labels[index]}</a>)
  return <>
    <PageMeta title={copy.title} description="Inside omalo: a Pokémon battle handoff, checking what an agent actually did, and a tiny motion-controlled game." url="https://btuckerc.dev/projects/s3-amoled" type="article" image="https://btuckerc.dev/media/s3-amoled/share.jpg" />
    <div className="case-study-page technical-readability-page tui-page-shell min-h-svh px-4 pb-28">
      <div className="story-layout mx-auto max-w-6xl">
        <aside className="story-nav-desktop" aria-label="On this page">
          <p className="case-study-kicker">On this page</p>
          <nav className="story-section-links" aria-label="Case study sections">{sectionLinks}</nav>
          <Link className="story-overview" to="/projects/omalo">omalo overview →</Link>
        </aside>
      <article className="story-article">
        <header className="case-study-header mb-8">
          <p className="case-study-eyebrow">inside omalo / s3-amoled</p>
          <h1 className="tui-page-title mt-3 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">{copy.title}</h1>
          <p className="case-study-copy mt-5">{copy.intro}</p>
          <a className="tui-link-chip mt-4 inline-flex" href="https://tuckercraig.com/DIG101/the-future-of-ai-is-openai/">read my 2017 post on AI and Dota ↗</a>
          <p className="case-study-status mt-4 text-sm text-muted">Prototype · Waveshare ESP32-S3 touch AMOLED</p>
        </header>
        <details className="story-nav-mobile" ref={mobileNav}>
          <summary>On this page</summary>
          <nav className="story-section-links" aria-label="Case study sections">{sectionLinks}</nav>
        </details>
        <div className="technical-readability-panel space-y-12">
          {copy.sections.map(section => <section className="case-study-section scroll-mt-24" id={section.id} key={section.id} aria-labelledby={section.id + '-title'}>
            <p className="case-study-kicker">{section.title.split(' / ')[0]}</p>
            <h2 className="case-study-section-title mt-2" id={section.id + '-title'}><a href={'#' + section.id}>{section.title.split(' / ')[1]}</a></h2>
            {section.paragraphs.map(text => <p key={text} className="case-study-copy mt-4">{text}</p>)}
            <div className="mt-6">
              {section.id === 'navigation' && <NavigationDemo copy={section.visual} />}
              {section.id === 'handoff' && <><ol className="story-steps" aria-label="Battle replay sequence"><li>1. My request</li><li>2. The battle</li><li>3. The result</li></ol><StarterSelectionCapture className="story-capture" /></>}
              {section.id === 'grain' && <><GrainCapture className="story-capture" /><details className="story-detail"><summary>Look closer at the play area</summary><p className="text-sm text-muted my-3">Enlarged still from the same computer-rendered capture. Scroll to inspect the details.</p><div className="story-zoom"><img src="/media/s3-amoled/grain-bounce-off-on-catch-v4-poster.png" alt="Enlarged Grain capture, including the play area and its controls." /></div></details></>}
              {section.id === 'corners' ? <CornerDemo /> : <SectionVisual id={section.id} />}
            </div>
          </section>)}
          <footer className="case-study-section">
            <p className="case-study-copy">{copy.closing}</p>
            <Link className="tui-link-chip mt-5 inline-flex" to="/projects/omalo">explore omalo →</Link>
            <details className="story-detail"><summary>Current limits and source</summary><p className="case-study-copy mt-3">Gameplay goals can fail. Full autonomous completion of Pokémon Emerald has not been established. The clips identify how they were captured; the diagrams explain the current design. A source release will be linked here when it is ready.</p></details>
          </footer>
        </div>
      </article>
      </div>
    </div>
  </>
}
