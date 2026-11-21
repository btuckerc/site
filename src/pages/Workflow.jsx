import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import PageMeta from '../components/PageMeta'
import '../styles/technical-readability.css'
import '../styles/project-navigation.css'

const sections = [
  { id: 'paper-cuts', num: '01', nav: 'Fix paper cuts', title: 'Fix the paper cut' },
  { id: 'verification', num: '02', nav: 'Verification', title: 'Verification is the real bottleneck' },
  { id: 'boundaries', num: '03', nav: 'Scope & boundaries', title: 'Tight scope, clean boundaries' },
  { id: 'harness', num: '04', nav: 'The harness', title: 'Build the harness around the models' },
  { id: 'shipping', num: '05', nav: 'Shipping', title: 'Ship real artifacts, not demos' },
]

export default function Workflow() {
  const [activeSection, setActiveSection] = useState(sections[0].id)
  const mobileNav = useRef(null)

  useEffect(() => {
    const update = () => {
      const nodes = sections.map((section) => document.getElementById(section.id)).filter(Boolean)
      const passed = nodes.filter((node) => node.getBoundingClientRect().top <= 140)
      setActiveSection((passed.at(-1) || nodes[0])?.id || sections[0].id)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

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
        description="How I use coding agents to ship real software across macOS, Windows, iOS, web, and hardware: tight scope, clean harnesses, and real verification."
        url="https://btuckerc.dev/workflow"
        type="article"
        image="https://btuckerc.dev/og/workflow.jpg"
        imageAlt="Tucker Craig, workflow: how I build with AI."
      />

      <div className="case-study-page technical-readability-page tui-page-shell min-h-svh px-4 pb-28">
        <div className="story-layout mx-auto max-w-6xl">
          <aside className="story-nav-desktop" aria-label="On this page">
            <p className="case-study-kicker">On this page</p>
            <nav className="story-section-links" aria-label="Workflow sections">
              {sectionLinks}
            </nav>
            <Link className="story-overview" to="/projects">all projects</Link>
          </aside>

          <article className="story-article">
            <header className="case-study-header mb-8">
              <p className="case-study-eyebrow">workflow / how i build</p>
              <h1 className="tui-page-title mt-3 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">
                How I build with AI
              </h1>
              <p className="case-study-copy mt-5">
                The biggest idea I&apos;ve borrowed from{' '}
                <a
                  href="https://omarchy.org/"
                  className="text-accent underline underline-offset-4"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-describedby="new-tab-note"
                >
                  Omarchy
                </a>{' '}
                is simple:{' '}
                <a
                  href="https://wecanfixeverything.com"
                  className="text-accent underline underline-offset-4"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-describedby="new-tab-note"
                >
                  we can fix everything
                </a>
                . Every missing app, every weird incompatibility, every daily paper cut. Coding agents make it realistic for one person to actually live that way, as long as you treat them like an engineering harness instead of a slot machine.
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

            <div className="technical-readability-panel space-y-12">
              <section className="case-study-section scroll-mt-24" id="paper-cuts" aria-labelledby="paper-cuts-title">
                <p className="case-study-kicker">01</p>
                <h2 className="case-study-section-title mt-2" id="paper-cuts-title">
                  <a href="#paper-cuts">Fix the paper cut</a>
                </h2>
                <p className="case-study-copy mt-4">
                  Most of what I build starts with something small that annoys me every day. Instead of living with a clunky tool or paying for something that almost fits, I&apos;d rather build a focused version and actually use it.
                </p>
                <p className="case-study-copy mt-4">
                  In the last few months that has meant shipping across very different stacks: a lightweight Swift 6 and WebKit macOS browser (<a href="https://github.com/btuckerc/angl-browser" className="text-accent underline underline-offset-4" target="_blank" rel="noopener noreferrer" aria-describedby="new-tab-note">angl browser</a>) with tree tabs, isolated Containers, and plain-file config, a Rust Windows streaming studio (winstream) built on WGC, Direct3D 11, and NVENC that uses ~3x less RAM than OBS, an iPhone and iPad app (<a href="https://github.com/btuckerc/herdwick" className="text-accent underline underline-offset-4" target="_blank" rel="noopener noreferrer" aria-describedby="new-tab-note">Herdwick</a>) to manage coding agents over SSH, a local Rust and Tauri voice-to-text app (<a href="https://github.com/btuckerc/dictation" className="text-accent underline underline-offset-4" target="_blank" rel="noopener noreferrer" aria-describedby="new-tab-note">Dictation</a>), a Mac quota and local-inference monitor (<a href="https://github.com/btuckerc/pace-bar" className="text-accent underline underline-offset-4" target="_blank" rel="noopener noreferrer" aria-describedby="new-tab-note">Pace Bar</a>), an iPhone puzzle game (<a href="https://github.com/btuckerc/inkjoin" className="text-accent underline underline-offset-4" target="_blank" rel="noopener noreferrer" aria-describedby="new-tab-note">Inkjoin</a>), and ESP32 firmware (<Link to="/projects/omalo" className="text-accent underline underline-offset-4">omalo</Link>).
                </p>
              </section>

              <section className="case-study-section scroll-mt-24" id="verification" aria-labelledby="verification-title">
                <p className="case-study-kicker">02</p>
                <h2 className="case-study-section-title mt-2" id="verification-title">
                  <a href="#verification">Verification is the real bottleneck</a>
                </h2>
                <p className="case-study-copy mt-4">
                  Generating code is the cheap part now. Knowing whether you can trust it is where the real engineering lives. A lot of how I think about this is inspired by engineers like{' '}
                  <a
                    href="https://x.com/poteto"
                    className="text-accent underline underline-offset-4"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-describedby="new-tab-note"
                  >
                    Lauren Tan (@poteto)
                  </a>
                  , who treat verification loops, context boundaries, and test harnesses as the actual work of AI engineering.
                </p>
                <p className="case-study-copy mt-4">
                  &quot;It compiles&quot; is never the finish line. Every change has to survive the real path a user hits: launching the signed app on macOS, exercising the iOS flows on a phone, running synthetic game loads and PresentMon ablations against OBS on Windows (which caught 2 ms idle wake-ups delaying the game&apos;s frame limiter in winstream), measuring real browser RAM (angl browser at 227 MB vs. Safari&apos;s 287 MB), or checking actual game RAM in{' '}
                  <Link to="/projects/s3-amoled#catch-check" className="text-accent underline underline-offset-4">
                    omalo
                  </Link>{' '}
                  instead of taking a model&apos;s word that a catch worked.
                </p>
              </section>

              <section className="case-study-section scroll-mt-24" id="boundaries" aria-labelledby="boundaries-title">
                <p className="case-study-kicker">03</p>
                <h2 className="case-study-section-title mt-2" id="boundaries-title">
                  <a href="#boundaries">Tight scope, clean boundaries</a>
                </h2>
                <p className="case-study-copy mt-4">
                  Agents write slop when you hand them a vague goal in a messy repo and hope for the best. They do surprisingly strong work when you own the architecture, write a tight brief with explicit invariants and an acceptance command, and run independent work in isolated Git worktrees so parallel tasks never step on each other.
                </p>
                <p className="case-study-copy mt-4">
                  The same habit carries into agent-powered products themselves. In{' '}
                  <Link to="/projects/s3-amoled#party" className="text-accent underline underline-offset-4">
                    omalo&apos;s technical notes
                  </Link>
                  , read-only questions (&quot;Who&apos;s in my party?&quot;) stay strictly separated from actions that change game state (&quot;Win this battle&quot;), and deterministic local controllers sit between the model and the inputs. Clear boundaries beat prompt gymnastics every time.
                </p>
                <div className="story-pair story-visual">
                  <div>
                    <h3>What I keep</h3>
                    <p>Problem framing, architecture, and tricky design tradeoffs.</p>
                    <p className="text-muted">Final review, integration, and running the real user path end to end.</p>
                  </div>
                  <div>
                    <h3>What I delegate</h3>
                    <p>Scoped implementation slices in isolated worktrees.</p>
                    <p className="text-muted">Independent review passes to catch bugs before they land.</p>
                  </div>
                </div>
              </section>

              <section className="case-study-section scroll-mt-24" id="harness" aria-labelledby="harness-title">
                <p className="case-study-kicker">04</p>
                <h2 className="case-study-section-title mt-2" id="harness-title">
                  <a href="#harness">Build the harness around the models</a>
                </h2>
                <p className="case-study-copy mt-4">
                  A huge part of working well with AI is smoothing out the ergonomics around it. When something slows down my loop, I treat it like any other paper cut and build the missing piece:
                </p>
                <div className="story-visual">
                  <ul className="space-y-3 text-sm leading-7 text-muted sm:text-base">
                    <li>
                      <strong className="text-fg">Herdwick</strong> keeps parallel coding agents reachable from my iPhone and iPad over SSH or Tailscale, with native permission prompts, diffs, and a zero-storage push relay so I only get nudged when an agent actually needs a decision.
                    </li>
                    <li>
                      <strong className="text-fg">Pace Bar</strong> sits in my macOS menu bar tracking Codex and Claude quotas alongside local llama-server token speed and GPU readings, so I can route bounded tasks locally and save frontier capacity for harder problems.
                    </li>
                    <li>
                      <strong className="text-fg">Dictation</strong> gives me fast, offline technical speech-to-text with custom vocabulary so writing clear specs and reviews doesn&apos;t bottleneck on typing.
                    </li>
                    <li>
                      <strong className="text-fg">Boilerplate</strong> keeps my macOS and Linux machines aligned with chezmoi and mise so the exact same tools, configs, and agent setup follow me everywhere.
                    </li>
                  </ul>
                </div>
              </section>

              <section className="case-study-section scroll-mt-24" id="shipping" aria-labelledby="shipping-title">
                <p className="case-study-kicker">05</p>
                <h2 className="case-study-section-title mt-2" id="shipping-title">
                  <a href="#shipping">Ship real artifacts, not demos</a>
                </h2>
                <p className="case-study-copy mt-4">
                  It&apos;s easy to stop at a neat screen recording. I try to push through the unglamorous last 20%: Developer ID signing and Apple notarization, App Store review and honest privacy pages, crash-recoverable screen recording in StreamApp, out-of-process filter list compilation in angl browser so memory spikes never land in the browser, and plain-English READMEs that list what doesn&apos;t work yet.
                </p>
                <p className="case-study-copy mt-4">
                  That&apos;s what &quot;we can fix everything&quot; actually looks like in practice: not claiming to be a 100x anything, just steadily turning small frustrations into real software you can download and use.
                </p>
              </section>

              <footer className="case-study-section">
                <p className="case-study-copy">
                  If you&apos;re working on coding agents, evaluation harnesses, or developer tools, I&apos;d love to talk.
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
    </>
  )
}
