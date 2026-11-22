import { Fragment, useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/workflow-visuals.css'

const LOOP_STEPS = [
  {
    id: 'brief',
    num: '01',
    short: 'Write brief',
    sub: 'Design + check',
    owner: 'Me',
    title: 'Design the change and write a short brief',
    body: 'I decide how the feature should work, name the exact files involved, and pick the check that proves it works.',
    example: 'Sample brief for Pace Bar: draw one quota ring per Codex and Claude subscription alongside local token speed and optional GPU readings.',
  },
  {
    id: 'worktree',
    num: '02',
    short: 'Worktree',
    sub: 'Isolated copy',
    owner: 'Agent',
    title: 'Run the task in its own Git worktree',
    body: "Each agent gets a clean checkout of the repo so parallel tasks don't collide or leave half-finished edits in each other's way.",
    example: 'Two UI fixes and a background refactor can run at the same time without stepping on each other or mixing diffs.',
  },
  {
    id: 'review',
    num: '03',
    short: 'Review',
    sub: 'Diff + bug pass',
    owner: 'Me + agent review',
    title: 'Read the patch before it lands',
    body: 'I read the diff myself, run an extra review pass on bigger changes to spot missed edge cases, and keep the diff small.',
    example: 'If a patch wanders outside the brief or adds layers nobody asked for, I trim it down before running checks.',
  },
  {
    id: 'test',
    num: '04',
    short: 'Test build',
    sub: 'Run it like a user',
    owner: 'Me',
    title: 'Run the built app the way a user will',
    body: 'Passing unit tests is the starting line. I open the signed Mac app, tap through the phone app, or run live benchmarks before calling it done. If something breaks, it loops back to a fresh worktree.',
    example: 'On iOS, a check means opening Herdwick over SSH to answer a live prompt, or playing an Inkjoin puzzle offline and in dark mode on an iPhone.',
  },
]

const CHECK_CASES = [
  {
    id: 'winstream',
    label: 'winstream',
    platform: 'Windows · Rust',
    lookedFine: 'A clean build and passing unit tests can still hide timer wakeups.',
    caughtTitle: 'Three 60-second synthetic game runs caught 2 ms timer wakeups',
    caughtBody: 'Running winstream side by side against OBS 32.0.2 on Windows 11 caught background timers waking every 2 ms and hurting frame pacing. Fixing those timers smoothed out frame delivery; idle RAM sits at 67 MB and GPU-bound 1% and 0.1% lows stay ahead of OBS.',
    // otherNum uses the midpoint of each published range solely to scale the proportional bar.
    bars: [
      { metric: 'Active private RAM (lower is better)', mine: '262 MB', mineNum: 262, otherLabel: 'OBS 32.0.2', other: '788-931 MB', otherNum: 860 },
      { metric: 'VRAM footprint (lower is better)', mine: '150 MB', mineNum: 150, otherLabel: 'OBS 32.0.2', other: '233-259 MB', otherNum: 246 },
      { metric: 'GPU-bound CPU overhead, 1 core (lower is better)', mine: '+13%', mineNum: 13, otherLabel: 'OBS + overlays', other: '+37%', otherNum: 37 },
    ],
    note: 'Under a 599 Hz cap, 0.1% lows still trail OBS because of Windows Graphics Capture overhead (465-469 fps vs. 563-570 fps).',
  },
  {
    id: 'angl',
    label: 'angl browser',
    platform: 'macOS · WebKit',
    lookedFine: 'Pages can render and block ads while filter compilation spikes memory.',
    caughtTitle: 'Moving ad-block compilation to a helper kept Wikipedia RAM below Safari',
    caughtBody: 'Running ad-block filter compilation inside a short-lived helper process kept memory low on Wikipedia instead of spiking inside the main browser process.',
    bars: [
      { metric: 'Memory on Wikipedia (lower is better)', mine: '227 MB', mineNum: 227, otherLabel: 'Safari', other: '287 MB', otherNum: 287 },
    ],
    note: 'Signed and notarized for Apple Silicon Macs on macOS 15 or newer.',
  },
  {
    id: 'omalo',
    label: 'omalo',
    platform: 'ESP32-S3 · GBA',
    lookedFine: 'An agent can report that the battle ended and the catch succeeded.',
    caughtTitle: 'Diffing party and PC box memory verifies a new catch',
    caughtBody: 'Before the controller reports a catch, it waits for Pokémon Emerald to settle and diffs party and PC storage boxes against how they looked before, checking for a newly added entry even if you already own that species.',
    memoryDiff: {
      before: ['Party + PC boxes', 'Existing Pokémon', 'New catch: not there yet'],
      after: ['Party + PC boxes', 'Existing Pokémon', '+ New catch: shows up once'],
    },
    note: 'Illustrative state diff (not a recorded catch).',
    link: { to: '/projects/s3-amoled#catch-check', label: 'read the omalo catch check' },
  },
  {
    id: 'herdwick',
    label: 'Herdwick',
    platform: 'iOS · SSH',
    lookedFine: 'A local preview can show the transcript layout without testing a live SSH session.',
    caughtTitle: 'A live session on iPhone or iPad over plain SSH or Tailscale',
    caughtBody: 'On the device I list the agents herdr is tracking, read an omp, Claude Code, or Codex transcript as chat, answer a permission prompt, read a diff, and confirm optional push alerts fire when a run needs input or finishes.',
    hops: ['iPhone / iPad', 'SSH / Tailscale', 'Live agents', 'Diffs + prompts + alerts'],
    note: 'No accounts or analytics; SSH keys stay in the iOS Keychain on the device.',
  },
]

const TOP_TOOLS = [
  {
    id: 'dictation',
    role: 'Voice in',
    name: 'Dictation',
    desc: 'Fast offline voice-to-text on Mac with custom technical vocabulary, so talking through a brief is quicker than typing it out.',
    links: [
      { label: 'download for mac', href: 'https://github.com/btuckerc/dictation/releases/latest' },
      { label: 'code', href: 'https://github.com/btuckerc/dictation' },
    ],
  },
  {
    id: 'pace-bar',
    role: 'Model routing',
    name: 'Pace Bar',
    desc: 'Menu bar tracker showing Codex and Claude limits next to local model speed and GPU usage, so small tasks go to local models and cloud quota stays for harder work.',
    links: [
      { label: 'download for mac', href: 'https://github.com/btuckerc/pace-bar/releases/latest' },
      { label: 'code', href: 'https://github.com/btuckerc/pace-bar' },
    ],
  },
]

const BOTTOM_TOOLS = [
  {
    id: 'herdwick',
    role: 'Away from desk',
    name: 'Herdwick',
    desc: 'iPhone and iPad app over SSH or Tailscale for answering agent prompts, reading diffs, and optional push alerts when a run needs input or finishes.',
    links: [
      { label: 'app store', href: 'https://apps.apple.com/app/id6815920496' },
      { label: 'code', href: 'https://github.com/btuckerc/herdwick' },
    ],
  },
  {
    id: 'boilerplate',
    role: 'Base setup',
    name: 'Boilerplate',
    desc: 'Shared Mac and Linux dotfiles managed with chezmoi and mise so every machine has the same shell, tools, and config.',
    links: [
      { label: 'browse config', href: 'https://github.com/btuckerc/boilerplate' },
    ],
  },
]

const DEMO_ITEMS = [
  'Works once on my machine in debug mode',
  'Needs manual setup steps nobody else will do',
  'Memory spikes or crashes lose what you were doing',
  "Doesn't say what's still broken",
]

const SHIPPED_ITEMS = [
  'Signed and notarized Apple Silicon Mac downloads',
  'App Store review, support pages, and plain privacy policies',
  'Crash-recoverable recordings in StreamApp',
  'Short-lived helper process for ad-block compilation in angl browser',
  "A section in the README listing what doesn't work yet",
]

function barWidthPct(value, max) {
  return Math.max(4, Math.min(100, Math.round((value / max) * 100)))
}

function useVerticalTabs() {
  const [vertical, setVertical] = useState(() => (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(max-width: 420px)').matches
  ))

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined
    const mql = window.matchMedia('(max-width: 420px)')
    const onChange = (event) => setVertical(event.matches)
    setVertical(mql.matches)
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    }
    return undefined
  }, [])

  return vertical
}

function moveTabIndex(event, currentIndex, count, onSelect) {
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    event.preventDefault()
    onSelect((currentIndex + 1) % count)
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    event.preventDefault()
    onSelect((currentIndex - 1 + count) % count)
  } else if (event.key === 'Home') {
    event.preventDefault()
    onSelect(0)
  } else if (event.key === 'End') {
    event.preventDefault()
    onSelect(count - 1)
  }
}

export function WorkflowLoopDiagram({ compact = false }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const vertical = useVerticalTabs()
  const uid = useId().replace(/:/g, '')
  const tabRefs = useRef([])
  const activeStep = LOOP_STEPS[activeIndex]

  const selectStep = (index, shouldFocus = false) => {
    setActiveIndex(index)
    if (shouldFocus) tabRefs.current[index]?.focus()
  }

  return (
    <figure className={`wf-visual ${compact ? 'wf-visual-compact' : ''}`}>
      <figcaption className="wf-visual-head">
        <span className="wf-visual-kicker">one change, start to finish</span>
        <span className="wf-visual-hint">Pick a step</span>
      </figcaption>

      <div className="wf-loop-stage">
        <div
          className="wf-loop-grid"
          role="tablist"
          aria-label="Workflow steps"
          aria-orientation={vertical ? 'vertical' : 'horizontal'}
        >
          {LOOP_STEPS.map((step, index) => {
            const activeEdge = activeIndex === index || activeIndex === index + 1
            return (
              <Fragment key={step.id}>
                <button
                  ref={(el) => { tabRefs.current[index] = el }}
                  type="button"
                  role="tab"
                  id={`${uid}-tab-${step.id}`}
                  aria-selected={activeIndex === index}
                  aria-controls={`${uid}-panel`}
                  tabIndex={activeIndex === index ? 0 : -1}
                  className="wf-loop-step"
                  onClick={() => selectStep(index)}
                  onKeyDown={(e) => moveTabIndex(e, index, LOOP_STEPS.length, (next) => selectStep(next, true))}
                >
                  <span className="wf-loop-step-top">
                    <span className="wf-loop-step-num">{step.num}</span>
                    <span className="wf-loop-step-title">{step.short}</span>
                  </span>
                  <span className="wf-loop-step-sub">{step.sub}</span>
                </button>
                {index < LOOP_STEPS.length - 1 && (
                  <span className="wf-loop-connector" aria-hidden="true">
                    <svg viewBox="0 0 24 16">
                      <line
                        x1="2"
                        y1="8"
                        x2="17"
                        y2="8"
                        stroke={activeEdge ? 'var(--accent)' : 'var(--muted)'}
                        strokeWidth={activeEdge ? '1.8' : '1.3'}
                      />
                      <path
                        d="M 14 4 L 21 8 L 14 12 Z"
                        fill={activeEdge ? 'var(--accent)' : 'var(--muted)'}
                      />
                    </svg>
                  </span>
                )}
              </Fragment>
            )
          })}
        </div>

        <div className="wf-loop-return-grid" aria-hidden="true">
          <div className={`wf-loop-return-arc ${activeIndex === 1 || activeIndex === 3 ? 'is-active' : ''}`}>
            <span className="wf-loop-return-wire" />
            <span className="wf-loop-return-label">
              check fails: fix in a fresh worktree and retest
            </span>
          </div>
          <div className={`wf-loop-pass-exit ${activeIndex === 3 ? 'is-active' : ''}`}>
            <span className="wf-loop-pass-stem" />
            <span className="wf-loop-pass-label">pass: merge</span>
          </div>
        </div>

        <p className="wf-loop-summary">
          Flow: steps 01 through 04. If testing the build fails, loop back to step 02 in a fresh worktree. If it passes, merge to main.
        </p>
      </div>

      <div
        id={`${uid}-panel`}
        role="tabpanel"
        tabIndex={0}
        aria-labelledby={`${uid}-tab-${activeStep.id}`}
        className="wf-detail-bar"
      >
        <div>
          <div className="wf-detail-meta">
            <span className="wf-owner-badge">{activeStep.owner}</span>
            <span className="wf-detail-title">{activeStep.title}</span>
          </div>
          <p className="wf-detail-copy">{activeStep.body}</p>
        </div>
        {!compact && (
          <div className="wf-detail-example">
            <p className="wf-detail-example-label">Example</p>
            <p>{activeStep.example}</p>
          </div>
        )}
      </div>
    </figure>
  )
}

export function RealCheckCases() {
  const [activeIndex, setActiveIndex] = useState(0)
  const vertical = useVerticalTabs()
  const uid = useId().replace(/:/g, '')
  const tabRefs = useRef([])
  const active = CHECK_CASES[activeIndex]

  const selectCase = (index, shouldFocus = false) => {
    setActiveIndex(index)
    if (shouldFocus) tabRefs.current[index]?.focus()
  }

  return (
    <figure className="wf-visual">
      <figcaption className="wf-visual-head">
        <span className="wf-visual-kicker">checks across my apps</span>
        <span className="wf-visual-hint">Pick a project</span>
      </figcaption>

      <div
        className="wf-tab-row"
        role="tablist"
        aria-label="Verification examples by project"
        aria-orientation={vertical ? 'vertical' : 'horizontal'}
      >
        {CHECK_CASES.map((item, index) => (
          <button
            key={item.id}
            ref={(el) => { tabRefs.current[index] = el }}
            type="button"
            role="tab"
            id={`${uid}-case-${item.id}`}
            aria-selected={activeIndex === index}
            aria-controls={`${uid}-case-panel`}
            tabIndex={activeIndex === index ? 0 : -1}
            className="wf-tab-btn"
            onClick={() => selectCase(index)}
            onKeyDown={(e) => moveTabIndex(e, index, CHECK_CASES.length, (next) => selectCase(next, true))}
          >
            <span className="wf-tab-num">{item.platform}</span>
            <span className="wf-tab-title">{item.label}</span>
          </button>
        ))}
      </div>

      <div
        id={`${uid}-case-panel`}
        role="tabpanel"
        tabIndex={0}
        aria-labelledby={`${uid}-case-${active.id}`}
        className="wf-check-panel"
      >
        <div className="wf-check-baseline">
          <span className="wf-check-baseline-label">Looked fine</span>
          <span className="wf-check-baseline-text">{active.lookedFine}</span>
        </div>

        <div className="wf-check-box">
          <p className="wf-check-label">What the real check verifies</p>
          <p className="wf-check-headline">{active.caughtTitle}</p>
          <p className="wf-check-body">{active.caughtBody}</p>

          {active.bars && (
            <div className="wf-bars" role="group" aria-label={`${active.label} measured numbers`}>
              {active.bars.map((bar) => {
                const maxVal = Math.max(bar.mineNum, bar.otherNum)
                const minePct = barWidthPct(bar.mineNum, maxVal)
                const otherPct = barWidthPct(bar.otherNum, maxVal)
                return (
                  <div key={bar.metric} className="wf-bar-group">
                    <span className="wf-bar-metric">{bar.metric}</span>
                    <div className="wf-bar-row">
                      <span className="wf-bar-name wf-bar-name-win">{active.label}</span>
                      <div className="wf-bar-track" aria-hidden="true">
                        <div className="wf-bar-fill wf-bar-fill-win" style={{ width: `${minePct}%` }} />
                      </div>
                      <span className="wf-bar-val wf-bar-val-win">{bar.mine}</span>
                    </div>
                    <div className="wf-bar-row">
                      <span className="wf-bar-name">{bar.otherLabel}</span>
                      <div className="wf-bar-track" aria-hidden="true">
                        <div className="wf-bar-fill" style={{ width: `${otherPct}%` }} />
                      </div>
                      <span className="wf-bar-val">{bar.other}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {active.memoryDiff && (
            <div className="wf-mem-diff" role="group" aria-label="Illustrative game memory diff before and after catch">
              <div className="wf-mem-col">
                <p className="wf-mem-head">Before</p>
                {active.memoryDiff.before.map((line) => (
                  <p key={line} className="wf-mem-line">{line}</p>
                ))}
              </div>
              <div className="wf-mem-col wf-mem-col-after">
                <p className="wf-mem-head">After the game settles</p>
                {active.memoryDiff.after.map((line) => (
                  <p key={line} className={`wf-mem-line ${line.startsWith('+') ? 'wf-mem-added' : ''}`}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          )}

          {active.hops && (
            <div className="wf-hop-strip" role="group" aria-label="Herdwick connection path">
              {active.hops.map((hop, idx) => (
                <span key={hop} className="inline-flex items-center gap-2">
                  <span className="wf-hop-node">{hop}</span>
                  {idx < active.hops.length - 1 && (
                    <span className="wf-hop-arrow" aria-hidden="true">→</span>
                  )}
                </span>
              ))}
            </div>
          )}

          {active.note && <p className="wf-check-note">{active.note}</p>}
          {active.link && (
            <div className="mt-4">
              <Link className="tui-link-chip" to={active.link.to}>
                {active.link.label}
              </Link>
            </div>
          )}
        </div>
      </div>
    </figure>
  )
}

export function WorktreeDiagram() {
  const [mode, setMode] = useState('isolated')
  const uid = useId().replace(/:/g, '')
  const isolated = mode === 'isolated'

  return (
    <figure className="wf-visual">
      <figcaption className="wf-visual-head">
        <span className="wf-visual-kicker">parallel work without collisions</span>
        <span className="wf-visual-hint">Compare workspace layouts</span>
      </figcaption>

      <div className="wf-tab-row wf-tab-row-two" role="group" aria-label="Workspace layout comparison">
        <button
          type="button"
          className="wf-tab-btn"
          aria-pressed={isolated}
          onClick={() => setMode('isolated')}
        >
          <span className="wf-tab-num">How I work</span>
          <span className="wf-tab-title">Separate Git worktrees</span>
        </button>
        <button
          type="button"
          className="wf-tab-btn"
          aria-pressed={!isolated}
          onClick={() => setMode('shared')}
        >
          <span className="wf-tab-num">What goes wrong</span>
          <span className="wf-tab-title">One shared checkout</span>
        </button>
      </div>

      <div className="wf-wt-stage">
        {isolated ? (
          <div
            className="wf-wt-flow"
            role="group"
            aria-label="Clean parallel workflow: main branches into two implementation worktrees that produce separate patches and a read-only bug pass that reports findings. Patches are reviewed and tested in the built app before merging back to main."
          >
            <div className="wf-wt-col-center">
              <div className="wf-wt-box wf-wt-box-accent">
                <p className="wf-wt-box-title">main</p>
                <p className="wf-wt-box-meta">clean base</p>
              </div>
            </div>

            <div className="wf-wt-wire" aria-hidden="true">
              <svg viewBox="0 0 36 160" preserveAspectRatio="none">
                <defs>
                  <marker id={`${uid}-wt-a`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                    <path d="M 1 1.5 L 8.5 5 L 1 8.5 z" fill="var(--accent)" />
                  </marker>
                </defs>
                <path d="M 0 70 C 16 70, 16 26, 33 26" fill="none" stroke="var(--accent)" strokeWidth="1.5" markerEnd={`url(#${uid}-wt-a)`} />
                <path d="M 0 80 H 33" fill="none" stroke="var(--accent)" strokeWidth="1.5" markerEnd={`url(#${uid}-wt-a)`} />
                <path d="M 0 90 C 16 90, 16 134, 33 134" fill="none" stroke="var(--accent)" strokeWidth="1.5" markerEnd={`url(#${uid}-wt-a)`} />
              </svg>
            </div>
            <div className="wf-wt-wire-mobile" aria-hidden="true">↓</div>

            <div className="wf-wt-stack">
              <div className="wf-wt-box wf-wt-box-branch">
                <p className="wf-wt-box-title">wt/filter-helper</p>
                <p className="wf-wt-box-meta">cloud model · implementation patch</p>
              </div>
              <div className="wf-wt-box wf-wt-box-branch">
                <p className="wf-wt-box-title">wt/tab-shortcuts</p>
                <p className="wf-wt-box-meta">local model · implementation patch</p>
              </div>
              <div className="wf-wt-box wf-wt-box-branch">
                <p className="wf-wt-box-title">wt/review-pass</p>
                <p className="wf-wt-box-meta">read-only · bug findings</p>
              </div>
            </div>

            <div className="wf-wt-wire" aria-hidden="true">
              <svg viewBox="0 0 36 160" preserveAspectRatio="none">
                <defs>
                  <marker id={`${uid}-wt-b`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                    <path d="M 1 1.5 L 8.5 5 L 1 8.5 z" fill="var(--accent)" />
                  </marker>
                </defs>
                <path d="M 0 26 C 18 26, 18 70, 33 70" fill="none" stroke="var(--accent)" strokeWidth="1.5" markerEnd={`url(#${uid}-wt-b)`} />
                <path d="M 0 80 H 33" fill="none" stroke="var(--accent)" strokeWidth="1.5" markerEnd={`url(#${uid}-wt-b)`} />
                <path d="M 0 134 C 18 134, 18 90, 33 90" fill="none" stroke="var(--muted)" strokeWidth="1.4" strokeDasharray="4 4" markerEnd={`url(#${uid}-wt-b)`} />
              </svg>
            </div>
            <div className="wf-wt-wire-mobile" aria-hidden="true">↓</div>

            <div className="wf-wt-col-center">
              <div className="wf-wt-box wf-wt-box-accent">
                <p className="wf-wt-box-title">Review &amp; test</p>
                <p className="wf-wt-box-meta">one patch at a time, run the built app</p>
                <p className="wf-wt-box-accent-line">merge once it passes</p>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="wf-wt-flow wf-wt-flow-shared"
            role="group"
            aria-label="Messy shared workspace: three tasks write into one shared checkout, causing overwritten edits, mixed diffs, and unclear build failures."
          >
            <div className="wf-wt-stack">
              <div className="wf-wt-box">
                <p className="wf-wt-box-title">Task A: filter helper</p>
              </div>
              <div className="wf-wt-box">
                <p className="wf-wt-box-title">Task B: tab shortcuts</p>
              </div>
              <div className="wf-wt-box">
                <p className="wf-wt-box-title">Task C: cleanup</p>
              </div>
            </div>

            <div className="wf-wt-wire" aria-hidden="true">
              <svg viewBox="0 0 32 160" preserveAspectRatio="none">
                <defs>
                  <marker id={`${uid}-sh-a`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                    <path d="M 1 1.5 L 8.5 5 L 1 8.5 z" fill="var(--muted)" />
                  </marker>
                </defs>
                <path d="M 0 26 C 14 26, 14 70, 29 70" fill="none" stroke="var(--muted)" strokeWidth="1.5" strokeDasharray="4 4" markerEnd={`url(#${uid}-sh-a)`} />
                <path d="M 0 80 H 29" fill="none" stroke="var(--muted)" strokeWidth="1.5" strokeDasharray="4 4" markerEnd={`url(#${uid}-sh-a)`} />
                <path d="M 0 134 C 14 134, 14 90, 29 90" fill="none" stroke="var(--muted)" strokeWidth="1.5" strokeDasharray="4 4" markerEnd={`url(#${uid}-sh-a)`} />
              </svg>
            </div>
            <div className="wf-wt-wire-mobile wf-wt-wire-mobile-muted" aria-hidden="true">↓</div>

            <div className="wf-wt-col-center">
              <div className="wf-wt-box wf-wt-box-warn">
                <p className="wf-wt-box-title">One shared checkout</p>
                <ul className="wf-wt-warn-list">
                  <li>edits overwrite each other</li>
                  <li>git diff mixes all 3 tasks</li>
                  <li>build breaks mid-run</li>
                </ul>
              </div>
            </div>

            <div className="wf-wt-wire" aria-hidden="true">
              <svg viewBox="0 0 28 160" preserveAspectRatio="none">
                <defs>
                  <marker id={`${uid}-sh-b`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                    <path d="M 1 1.5 L 8.5 5 L 1 8.5 z" fill="var(--muted)" />
                  </marker>
                </defs>
                <line x1="0" y1="80" x2="25" y2="80" stroke="var(--muted)" strokeWidth="1.5" strokeDasharray="4 4" markerEnd={`url(#${uid}-sh-b)`} />
              </svg>
            </div>
            <div className="wf-wt-wire-mobile wf-wt-wire-mobile-muted" aria-hidden="true">↓</div>

            <div className="wf-wt-col-center">
              <div className="wf-wt-box">
                <p className="wf-wt-box-title">Hard to untangle</p>
                <p className="wf-wt-box-meta">which task broke it?</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <p role="status" className={`wf-wt-status ${isolated ? '' : 'wf-wt-status-warn'}`}>
        {isolated
          ? 'Each task runs in its own directory with its own brief and check, so every patch is small enough to review and test before merging.'
          : 'When multiple tasks share one checkout, agents edit the same files, tests fail for unrelated reasons, and the diff turns into a pile you have to pick apart by hand.'}
      </p>

      <div className="wf-ownership-strip">
        <p><strong>I keep:</strong> design decisions, short briefs, live testing, and merging.</p>
        <p><strong>Agents take:</strong> scoped work in separate worktrees (local models for small jobs, cloud for harder ones) and read-only bug passes.</p>
      </div>
    </figure>
  )
}

function ToolCard({ tool }) {
  return (
    <div className="wf-tool-card">
      <div>
        <span className="wf-tool-role">{tool.role}</span>
        <span className="wf-tool-name">{tool.name}</span>
        <p className="wf-tool-desc">{tool.desc}</p>
      </div>
      <div className="wf-tool-links">
        {tool.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="tui-link-chip"
            target="_blank"
            rel="noopener noreferrer"
            aria-describedby="new-tab-note"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  )
}

export function ToolingSystemMap() {
  return (
    <figure className="wf-visual">
      <figcaption className="wf-visual-head">
        <span className="wf-visual-kicker">four tools around the loop</span>
      </figcaption>

      <div className="wf-hub-row">
        {TOP_TOOLS.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      <div className="wf-hub-connectors" aria-hidden="true">
        <span className="wf-hub-stem" />
        <span className="wf-hub-stem" />
      </div>

      <div className="wf-hub-spine">
        <span className="wf-hub-spine-title">Coding session (Mac + Linux)</span>
        <span className="wf-hub-spine-meta">briefs · worktrees · diffs</span>
      </div>

      <div className="wf-hub-connectors" aria-hidden="true">
        <span className="wf-hub-stem" />
        <span className="wf-hub-stem" />
      </div>

      <div className="wf-hub-row">
        {BOTTOM_TOOLS.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </figure>
  )
}

export function FinishingGap() {
  return (
    <figure className="wf-visual">
      <figcaption className="wf-visual-head">
        <span className="wf-visual-kicker">after the first working build</span>
      </figcaption>
      <div className="wf-finish-grid">
        <div className="wf-finish-col">
          <p className="wf-finish-kicker">Easy place to stop</p>
          <ul className="wf-finish-list">
            {DEMO_ITEMS.map((item) => (
              <li key={item}>
                <span className="wf-finish-mark" aria-hidden="true">-</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="wf-finish-col wf-finish-col-ship">
          <p className="wf-finish-kicker">What makes it usable</p>
          <ul className="wf-finish-list">
            {SHIPPED_ITEMS.map((item) => (
              <li key={item}>
                <span className="wf-finish-mark" aria-hidden="true">+</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </figure>
  )
}
