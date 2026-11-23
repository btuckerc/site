import { Link } from 'react-router-dom'
import { useRef } from 'react'
import Breadcrumb from '../components/Breadcrumb'
import PageMeta from '../components/PageMeta'
import {
  FinishingGap,
  RealCheckCases,
  ToolingSystemMap,
  WorkflowLoopDiagram,
  WorktreeDiagram,
} from '../components/WorkflowVisuals'
import { useActiveSection } from '../hooks/useActiveSection'
import '../styles/technical-readability.css'
import '../styles/project-navigation.css'

const sections = [
  { id: 'annoyances', num: '01', nav: 'Why I build', title: 'Start with something annoying' },
  { id: 'verification', num: '02', nav: 'Testing', title: 'Checking the work is the hard part' },
  { id: 'scope', num: '03', nav: 'Small tasks', title: 'Keep tasks small and separate' },
  { id: 'tooling', num: '04', nav: 'Tooling', title: 'Build the tools that save time' },
  { id: 'finishing', num: '05', nav: 'Finishing', title: 'Finish the boring parts' },
]

const sectionIds = sections.map((section) => section.id)

export default function Workflow() {
  const activeSection = useActiveSection(sectionIds)
  const mobileNav = useRef(null)

  const sectionLinks = sections.map((section) => (
    <a
      key={section.id}
      href={`#${section.id}`}
      aria-current={activeSection === section.id ? 'location' : undefined}
      onClick={() => {
        if (mobileNav.current) mobileNav.current.open = false
      }}
    >
      <span aria-hidden="true">{section.num}</span>
      {section.nav}
    </a>
  ))

  return (
    <>
      <PageMeta
        title="How I build with AI - Tucker Craig"
        description="How I use coding agents to build and test my own apps across Mac, Windows, iOS, and hardware."
        url="https://btuckerc.dev/workflow"
        type="article"
        image="https://btuckerc.dev/og/workflow.jpg"
        imageAlt="Tucker Craig, workflow: how I build with AI."
      />

      <div className="case-study-page technical-readability-page tui-page-shell min-h-svh">
        <div className="tui-rail">
          <Breadcrumb items={[{ label: 'home', to: '/' }, { label: 'workflow' }]} />

          <div className="story-layout">
            <aside className="story-nav-desktop" aria-label="On this page">
              <p className="case-study-kicker">On this page</p>
              <nav className="story-section-links" aria-label="Workflow sections">
                {sectionLinks}
              </nav>
              <Link className="story-overview" to="/projects">all projects</Link>
            </aside>

            <article className="story-article">
              <header className="case-study-header">
                <p className="case-study-eyebrow">how i build</p>
                <h1 className="tui-page-title mt-3 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">
                  How I build with AI
                </h1>
                <p className="case-study-copy mt-4">
                  I use coding agents to build my own apps across Mac, Windows, iOS, and hardware. Keeping tasks small, separating parallel work, and testing the finished build is what makes one-person projects hold up.
                </p>
              </header>

              <details className="story-nav-mobile" ref={mobileNav}>
                <summary className="tui-summary">
                  <span className="tui-disclosure" aria-hidden="true" />
                  <span>On this page</span>
                </summary>
                <nav className="story-section-links" aria-label="Workflow sections">
                  {sectionLinks}
                </nav>
              </details>

              <div className="technical-readability-panel space-y-10">
                <section className="case-study-section" aria-label="Workflow overview diagram">
                  <WorkflowLoopDiagram />
                </section>

                <section className="case-study-section scroll-mt-24" id="annoyances" aria-labelledby="annoyances-title">
                  <p className="case-study-kicker">01</p>
                  <h2 className="case-study-section-title mt-2" id="annoyances-title">
                    <a href="#annoyances">Start with something annoying</a>
                  </h2>
                  <p className="case-study-copy mt-4">
                    Almost everything on this site started with something small that bugged me. Instead of living with a clunky tool or paying for software that mostly gets in my way, I&apos;d rather spend a week building a smaller version that fits how I work.
                  </p>
                  <p className="case-study-copy mt-4">
                    Everything is solvable, and all it takes right now is someone pointing their tokens at it. We&apos;re seeing real progress on math, iOS keyboards, and plenty else just because someone decided to put some of their agentic bandwidth toward a problem.
                  </p>
                  <p className="case-study-copy mt-4">
                    Lately that&apos;s bounced across a bunch of platforms: a lightweight Mac browser (<a href="https://github.com/btuckerc/angl-browser" className="text-accent underline underline-offset-4" target="_blank" rel="noopener noreferrer" aria-describedby="new-tab-note">angl browser</a>), a Rust streaming app for Windows (winstream) that uses about a third as much memory as OBS, an iPhone app (<a href="https://github.com/btuckerc/herdwick" className="text-accent underline underline-offset-4" target="_blank" rel="noopener noreferrer" aria-describedby="new-tab-note">Herdwick</a>) for checking on coding agents over SSH, local voice-to-text on Mac (<a href="https://github.com/btuckerc/dictation" className="text-accent underline underline-offset-4" target="_blank" rel="noopener noreferrer" aria-describedby="new-tab-note">Dictation</a>), a menu bar usage tracker (<a href="https://github.com/btuckerc/pace-bar" className="text-accent underline underline-offset-4" target="_blank" rel="noopener noreferrer" aria-describedby="new-tab-note">Pace Bar</a>), an iPhone puzzle game (<a href="https://github.com/btuckerc/inkjoin" className="text-accent underline underline-offset-4" target="_blank" rel="noopener noreferrer" aria-describedby="new-tab-note">Inkjoin</a>), and handheld firmware (<Link to="/projects/omalo" className="text-accent underline underline-offset-4">omalo</Link>).
                  </p>
                </section>

                <section className="case-study-section scroll-mt-24" id="verification" aria-labelledby="verification-title">
                  <p className="case-study-kicker">02</p>
                  <h2 className="case-study-section-title mt-2" id="verification-title">
                    <a href="#verification">Checking the work is the hard part</a>
                  </h2>
                  <p className="case-study-copy mt-4">
                    I&apos;ve learned a lot from watching engineers like{' '}
                    <a
                      href="https://x.com/poteto"
                      className="text-accent underline underline-offset-4"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-describedby="new-tab-note"
                    >
                      Lauren Tan (@poteto)
                    </a>{' '}
                    put the focus on repeatable checks and hands-on testing instead of piling up diffs.
                  </p>
                  <p className="case-study-copy mt-4">
                    Before I merge anything, I want to run it the same way a user will. Unit tests catch regressions, while running the built app catches timer wakeups, memory spikes, and signing problems.
                  </p>
                  <RealCheckCases />
                </section>

                <section className="case-study-section scroll-mt-24" id="scope" aria-labelledby="scope-title">
                  <p className="case-study-kicker">03</p>
                  <h2 className="case-study-section-title mt-2" id="scope-title">
                    <a href="#scope">Keep tasks small and separate</a>
                  </h2>
                  <p className="case-study-copy mt-4">
                    Coding agents get messy fast when you give them a vague prompt in a crowded workspace. Results get much better when I figure out the design first, write a short brief with an exact check to run, and put each task in its own Git worktree.
                  </p>
                  <p className="case-study-copy mt-4">
                    That same split shows up in the software too. In{' '}
                    <Link to="/projects/s3-amoled#party" className="text-accent underline underline-offset-4">
                      omalo
                    </Link>
                    , asking a question (&quot;Who&apos;s in my party?&quot;) takes a separate read-only path from asking the AI to change the game (&quot;Win this battle&quot;), and local code handles the button presses.
                  </p>
                  <WorktreeDiagram />
                </section>

                <section className="case-study-section scroll-mt-24" id="tooling" aria-labelledby="tooling-title">
                  <p className="case-study-kicker">04</p>
                  <h2 className="case-study-section-title mt-2" id="tooling-title">
                    <a href="#tooling">Build the tools that save time</a>
                  </h2>
                  <p className="case-study-copy mt-4">
                    Most of the gain from coding agents comes from fixing small annoyances in your own setup. Every tool below grew out of something that slowed me down while running parallel sessions.
                  </p>
                  <ToolingSystemMap />
                </section>

                <section className="case-study-section scroll-mt-24" id="finishing" aria-labelledby="finishing-title">
                  <p className="case-study-kicker">05</p>
                  <h2 className="case-study-section-title mt-2" id="finishing-title">
                    <a href="#finishing">Finish the boring parts</a>
                  </h2>
                  <p className="case-study-copy mt-4">
                    It&apos;s easy to stop once something works in a quick demo. Most of what makes an app pleasant to use happens in the &quot;What makes it usable&quot; list below.
                  </p>
                  <FinishingGap />
                </section>

                <footer className="case-study-section">
                  <p className="case-study-copy">
                    If you&apos;re working on coding agents or developer tools, I&apos;d like to hear about it.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link className="tui-link-chip" to="/projects">browse all projects</Link>
                    <Link className="tui-link-chip" to="/projects/s3-amoled">omalo technical notes</Link>
                    <Link className="tui-link-chip" to="/contact">say hello</Link>
                  </div>
                </footer>
              </div>
            </article>
          </div>
        </div>
      </div>
    </>
  )
}
