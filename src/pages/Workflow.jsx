import { Link } from 'react-router-dom'
import { useRef } from 'react'
import Breadcrumb from '../components/Breadcrumb'
import PageMeta from '../components/PageMeta'
import {
  AgentStackDiagram,
  FinishingGap,
  FullCouncilDiagram,
  RealCheckCases,
  ToolingSystemMap,
  WorktreeDiagram,
} from '../components/WorkflowVisuals'
import { useActiveSection } from '../hooks/useActiveSection'
import '../styles/technical-readability.css'
import '../styles/project-navigation.css'

const sections = [
  { id: 'annoyances', num: '01', nav: 'Why I build', title: 'Start with what you use' },
  { id: 'models', num: '02', nav: 'Model stack', title: 'Right model for the job' },
  { id: 'council', num: '03', nav: 'Full council', title: 'Five models, blind review' },
  { id: 'scope', num: '04', nav: 'Worktrees', title: 'Keep tasks small and separate' },
  { id: 'verification', num: '05', nav: 'Testing', title: 'Checking the work is the hard part' },
  { id: 'tooling', num: '06', nav: 'Tooling', title: 'Build the tools that save time' },
  { id: 'finishing', num: '07', nav: 'Finishing', title: 'Finish the boring parts' },
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
        description="How I split work across Gemini 4 Neon, Claude Opus 5.5, GPT-6.2 Sol, local Qwen 3.8, and a five-model blind council to build and test my own apps."
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
                  I split work across different models instead of asking one chat window to design, code, and grade its own work. One model directs, sandboxed workers write patches in separate copies of the repo, a five-model blind council checks big changes, and I test the built app myself.
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
                <section className="case-study-section scroll-mt-24" id="annoyances" aria-labelledby="annoyances-title">
                  <p className="case-study-kicker">01</p>
                  <h2 className="case-study-section-title mt-2" id="annoyances-title">
                    <a href="#annoyances">Start with what you use</a>
                  </h2>
                  <p className="case-study-copy mt-4">
                    Most of the projects here started with a tool I use every day that didn&apos;t quite fit how I work. It&apos;s fast enough now to build a smaller, focused version instead of working around it.
                  </p>
                  <p className="case-study-copy mt-4">
                    Everything is solvable. It&apos;s something that hit me while I was putting this together. Every single problem is solvable right now, all it takes is someone pointing their tokens in the right place. People are proving{' '}
                    <a
                      href="https://leanprover-community.github.io/blog/posts/riemann-hypothesis/"
                      className="text-accent underline underline-offset-4"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-describedby="new-tab-note"
                    >
                      the Riemann hypothesis
                    </a>
                    , building Linux distros, and shipping everyday software simply by deciding to put some of their agentic bandwidth toward a problem.
                  </p>
                  <p className="case-study-copy mt-4">
                    Lately for me that&apos;s been a lightweight Mac browser (<a href="https://github.com/btuckerc/angl-browser" className="text-accent underline underline-offset-4" target="_blank" rel="noopener noreferrer" aria-describedby="new-tab-note">angl browser</a>), a Rust streaming app for Windows (winstream) that uses about a third as much memory as OBS, an iPhone app (<a href="https://github.com/btuckerc/herdwick" className="text-accent underline underline-offset-4" target="_blank" rel="noopener noreferrer" aria-describedby="new-tab-note">Herdwick</a>) for checking on coding agents over SSH, local voice-to-text on Mac (<a href="https://github.com/btuckerc/dictation" className="text-accent underline underline-offset-4" target="_blank" rel="noopener noreferrer" aria-describedby="new-tab-note">Dictation</a>), a menu bar usage tracker (<a href="https://github.com/btuckerc/pace-bar" className="text-accent underline underline-offset-4" target="_blank" rel="noopener noreferrer" aria-describedby="new-tab-note">Pace Bar</a>), an iPhone puzzle game (<a href="https://github.com/btuckerc/inkjoin" className="text-accent underline underline-offset-4" target="_blank" rel="noopener noreferrer" aria-describedby="new-tab-note">Inkjoin</a>), and handheld firmware (<Link to="/projects/omalo" className="text-accent underline underline-offset-4">omalo</Link>).
                  </p>
                </section>

                <section className="case-study-section scroll-mt-24" id="models" aria-labelledby="models-title">
                  <p className="case-study-kicker">02</p>
                  <h2 className="case-study-section-title mt-2" id="models-title">
                    <a href="#models">Right model for the job</a>
                  </h2>
                  <p className="case-study-copy mt-4">
                    I treat models like specialists with clear handoffs. Either Gemini 4 Neon (in Antigravity) or Claude Opus 5.5 (in Claude Code) sits at the top as the director. It works out the design with me, writes short briefs, applies the finished patches, and runs the final checks.
                  </p>
                  <p className="case-study-copy mt-4">
                    Both directors share one ruleset from my <a href="https://github.com/btuckerc/boilerplate" className="text-accent underline underline-offset-4" target="_blank" rel="noopener noreferrer" aria-describedby="new-tab-note">boilerplate</a> dotfiles and delegate through a small Python wrapper called <code>agent-run</code>. Hard changes go to GPT-6.2 Sol in its own Git worktree. Smaller bounded edits go to a local Qwen 3.8 27B model running on my Linux box (<code>nous</code>, Radeon AI PRO R9700 32 GB VRAM, vLLM with a DFlash2 drafter) inside a <code>bwrap</code> sandbox with read/edit tools only and no shell access. Quick summaries go to GPT-6 Luna.
                  </p>
                  <p className="case-study-copy mt-4">
                    Every worker run writes a receipt that inspects the child&apos;s own transcript afterward (<code>model_ok</code>, <code>effort_ok</code>, <code>sandbox_ok</code>) so a silent model downgrade, wrong reasoning effort, or stray tool call fails the receipt instead of slipping by.
                  </p>
                  <AgentStackDiagram />
                </section>

                <section className="case-study-section scroll-mt-24" id="council" aria-labelledby="council-title">
                  <p className="case-study-kicker">03</p>
                  <h2 className="case-study-section-title mt-2" id="council-title">
                    <a href="#council">Five models, blind review</a>
                  </h2>
                  <p className="case-study-copy mt-4">
                    The easiest mistake with coding agents is asking the model that wrote a diff whether the diff looks good. For big changes or tricky design calls, I run a full council (adapted from Theo Browne&apos;s <code>council</code> and <code>sol-loop</code>): five read-only seats across three model families, each given a slightly different review prompt.
                  </p>
                  <p className="case-study-copy mt-4">
                    Every seat reads the same frozen <code>git archive</code> snapshot and diff. Nobody sees another seat&apos;s findings, my reasoning, or whether I have a target score in mind. Independent first opinions carry most of the value, and reviewer precision is still low even with strong models, so agreement between seats is never proof. I check every claim against the code or write a test before fixing or declining it.
                  </p>
                  <p className="case-study-copy mt-4">
                    If a seat still disagrees after I send back counter-evidence, a fresh Claude Opus 5.5 tiebreaker sees only the claim, evidence, and both sides. I wrote the code, so I don&apos;t get to rule on my own decline. On high-stakes commits, a strict read-only GPT-6.2 Sol (<code>xhigh</code>) audit also runs last and only clears the boundary on concrete evidence.
                  </p>
                  <FullCouncilDiagram />
                </section>

                <section className="case-study-section scroll-mt-24" id="scope" aria-labelledby="scope-title">
                  <p className="case-study-kicker">04</p>
                  <h2 className="case-study-section-title mt-2" id="scope-title">
                    <a href="#scope">Keep tasks small and separate</a>
                  </h2>
                  <p className="case-study-copy mt-4">
                    Coding agents get messy fast when you give them a vague prompt in a crowded workspace. Results get much better when I figure out the design first, write a short brief with an exact check to run, and put each worker in its own Git worktree.
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

                <section className="case-study-section scroll-mt-24" id="verification" aria-labelledby="verification-title">
                  <p className="case-study-kicker">05</p>
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

                <section className="case-study-section scroll-mt-24" id="tooling" aria-labelledby="tooling-title">
                  <p className="case-study-kicker">06</p>
                  <h2 className="case-study-section-title mt-2" id="tooling-title">
                    <a href="#tooling">Build the tools that save time</a>
                  </h2>
                  <p className="case-study-copy mt-4">
                    Most of the gain from coding agents comes from fixing small annoyances in your own setup. Every tool below grew out of something that slowed me down while running parallel sessions across my Mac and Linux GPU box.
                  </p>
                  <ToolingSystemMap />
                </section>

                <section className="case-study-section scroll-mt-24" id="finishing" aria-labelledby="finishing-title">
                  <p className="case-study-kicker">07</p>
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
