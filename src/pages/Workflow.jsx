import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import PageMeta from '../components/PageMeta'
import '../styles/technical-readability.css'
import '../styles/project-navigation.css'

const sections = [
  { id: 'annoyances', num: '01', nav: 'Why I build', title: 'Start with something annoying' },
  { id: 'verification', num: '02', nav: 'Testing', title: 'Checking the work takes the most care' },
  { id: 'scope', num: '03', nav: 'Small tasks', title: 'Keep tasks small and separate' },
  { id: 'tooling', num: '04', nav: 'Tooling', title: 'Build the tools that save time' },
  { id: 'finishing', num: '05', nav: 'Finishing', title: 'Finish the boring parts' },
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
        description="How I use coding agents to build and test my own apps across Mac, Windows, iOS, and hardware."
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
                I really like{' '}
                <a
                  href="https://omarchy.org/"
                  className="text-accent underline underline-offset-4"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-describedby="new-tab-note"
                >
                  Omarchy&apos;s
                </a>{' '}
                line that{' '}
                <a
                  href="https://wecanfixeverything.com"
                  className="text-accent underline underline-offset-4"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-describedby="new-tab-note"
                >
                  we can fix everything
                </a>
                . If an app I want doesn&apos;t exist, or an app I use every day drives me crazy, I&apos;d rather just build my own. Coding agents have made that practical for one person, as long as you stay pretty disciplined about how you use them.
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
              <section className="case-study-section scroll-mt-24" id="annoyances" aria-labelledby="annoyances-title">
                <p className="case-study-kicker">01</p>
                <h2 className="case-study-section-title mt-2" id="annoyances-title">
                  <a href="#annoyances">Start with something annoying</a>
                </h2>
                <p className="case-study-copy mt-4">
                  Almost everything on this site started with something small that bugged me. Instead of living with a clunky tool or paying for something that mostly got in my way, I&apos;d rather spend a week building a smaller version that fits how I actually work.
                </p>
                <p className="case-study-copy mt-4">
                  Lately that has bounced across a bunch of platforms: a lightweight Mac browser (<a href="https://github.com/btuckerc/angl-browser" className="text-accent underline underline-offset-4" target="_blank" rel="noopener noreferrer" aria-describedby="new-tab-note">angl browser</a>), a Rust streaming app for Windows (winstream) that uses about a third as much memory as OBS, an iPhone app (<a href="https://github.com/btuckerc/herdwick" className="text-accent underline underline-offset-4" target="_blank" rel="noopener noreferrer" aria-describedby="new-tab-note">Herdwick</a>) for checking on coding agents over SSH, local voice-to-text on Mac (<a href="https://github.com/btuckerc/dictation" className="text-accent underline underline-offset-4" target="_blank" rel="noopener noreferrer" aria-describedby="new-tab-note">Dictation</a>), a menu bar usage tracker (<a href="https://github.com/btuckerc/pace-bar" className="text-accent underline underline-offset-4" target="_blank" rel="noopener noreferrer" aria-describedby="new-tab-note">Pace Bar</a>), an iPhone puzzle game (<a href="https://github.com/btuckerc/inkjoin" className="text-accent underline underline-offset-4" target="_blank" rel="noopener noreferrer" aria-describedby="new-tab-note">Inkjoin</a>), and handheld firmware (<Link to="/projects/omalo" className="text-accent underline underline-offset-4">omalo</Link>).
                </p>
              </section>

              <section className="case-study-section scroll-mt-24" id="verification" aria-labelledby="verification-title">
                <p className="case-study-kicker">02</p>
                <h2 className="case-study-section-title mt-2" id="verification-title">
                  <a href="#verification">Checking the work takes the most care</a>
                </h2>
                <p className="case-study-copy mt-4">
                  Writing code quickly is easy now; trusting it is the hard part. I&apos;ve learned a lot from watching engineers like{' '}
                  <a
                    href="https://x.com/poteto"
                    className="text-accent underline underline-offset-4"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-describedby="new-tab-note"
                  >
                    Lauren Tan (@poteto)
                  </a>{' '}
                  put the focus on repeatable checks and real testing instead of just churning out diffs.
                </p>
                <p className="case-study-copy mt-4">
                  Before I consider something done, I want to run it the same way a user will. That means opening the signed Mac app, tapping through the phone app, running game benchmarks against OBS on Windows (which caught background timers waking up every 2 ms and throwing off the game&apos;s frame pacing in winstream), measuring real memory in angl browser (227 MB vs. Safari&apos;s 287 MB on Wikipedia), or checking actual game memory in{' '}
                  <Link to="/projects/s3-amoled#catch-check" className="text-accent underline underline-offset-4">
                    omalo
                  </Link>{' '}
                  to see if a Pokémon was actually caught.
                </p>
              </section>

              <section className="case-study-section scroll-mt-24" id="scope" aria-labelledby="scope-title">
                <p className="case-study-kicker">03</p>
                <h2 className="case-study-section-title mt-2" id="scope-title">
                  <a href="#scope">Keep tasks small and separate</a>
                </h2>
                <p className="case-study-copy mt-4">
                  Coding agents get messy fast when you hand them a vague prompt in a crowded workspace. I get much better results when I handle the design myself, write a short clear brief with an exact check to run, and let each task run in its own Git worktree so parallel work never steps on itself.
                </p>
                <p className="case-study-copy mt-4">
                  That same habit shows up in the software too. In{' '}
                  <Link to="/projects/s3-amoled#party" className="text-accent underline underline-offset-4">
                    omalo
                  </Link>
                  , asking a question (&quot;Who&apos;s in my party?&quot;) takes a completely separate path from asking the AI to change the game (&quot;Win this battle&quot;), and local code handles the actual button presses.
                </p>
                <div className="story-pair story-visual">
                  <div>
                    <h3>What I handle myself</h3>
                    <p>Deciding what to build, working out the design, and making the tricky calls.</p>
                    <p className="text-muted">Reviewing the patch, merging it, and testing the app myself.</p>
                  </div>
                  <div>
                    <h3>What I hand to agents</h3>
                    <p>Well-scoped pieces of implementation in separate worktrees.</p>
                    <p className="text-muted">Extra review passes to spot bugs before anything lands.</p>
                  </div>
                </div>
              </section>

              <section className="case-study-section scroll-mt-24" id="tooling" aria-labelledby="tooling-title">
                <p className="case-study-kicker">04</p>
                <h2 className="case-study-section-title mt-2" id="tooling-title">
                  <a href="#tooling">Build the tools that save time</a>
                </h2>
                <p className="case-study-copy mt-4">
                  A lot of getting good mileage out of coding agents comes down to fixing small annoyances in your own setup:
                </p>
                <div className="story-visual">
                  <ul className="space-y-3 text-sm leading-7 text-muted sm:text-base">
                    <li>
                      <strong className="text-fg">Herdwick</strong> lets me check on agents from my iPhone or iPad over SSH or Tailscale, answer prompts, read diffs, and get a push alert only when something actually needs me.
                    </li>
                    <li>
                      <strong className="text-fg">Pace Bar</strong> sits in my Mac menu bar watching Codex and Claude limits next to local model speed and GPU usage, so I can send small tasks to local models and save cloud limits for harder stuff.
                    </li>
                    <li>
                      <strong className="text-fg">Dictation</strong> gives me fast offline voice-to-text with custom technical vocabulary so explaining a task doesn&apos;t slow down on typing.
                    </li>
                    <li>
                      <strong className="text-fg">Boilerplate</strong> keeps my Mac and Linux setups synced with chezmoi and mise so my configs and tools stay the same everywhere.
                    </li>
                  </ul>
                </div>
              </section>

              <section className="case-study-section scroll-mt-24" id="finishing" aria-labelledby="finishing-title">
                <p className="case-study-kicker">05</p>
                <h2 className="case-study-section-title mt-2" id="finishing-title">
                  <a href="#finishing">Finish the boring parts</a>
                </h2>
                <p className="case-study-copy mt-4">
                  It&apos;s easy to stop once something works in a quick demo. I try to push through the boring stuff that makes an app actually usable: Apple signing and notarization, App Store privacy pages, crash-recoverable recordings in StreamApp, running ad-block list compilation in a short-lived helper process in angl browser so memory stays low, and writing down what doesn&apos;t work yet right in the README.
                </p>
              </section>

              <footer className="case-study-section">
                <p className="case-study-copy">
                  If you&apos;re working on coding agents or developer tools and want to chat, feel free to reach out.
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
