import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/workflow-visuals.css'

/* Client-only orientation observer matching @media (max-width: 420px) so SSR
 * starts horizontal (no hydration mismatch) while narrow phones announce vertical. */
function useVerticalTabOrientation() {
  const [vertical, setVertical] = useState(false)

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

  return vertical ? 'vertical' : 'horizontal'
}

const LOOP_STEPS = [
  {
    id: 'brief',
    num: '01',
    short: 'Write brief',
    busLabel: 'Brief',
    sub: 'Design + check',
    lane: 'me',
    owner: 'Me',
    title: 'Design the change and name the check',
    body: 'I decide how the feature should work, scope the exact files, and pick the check before any agent starts.',
    example: 'For angl browser: move ad-block filter compilation into a short-lived helper so Wikipedia memory stays below Safari.',
    artifactLabel: 'Illustrative brief · angl browser',
    artifactKind: 'brief',
    artifactRows: [
      { key: 'goal', val: 'Move filter compile out of main process' },
      { key: 'scope', val: 'Swift / AppKit / WebKit · short-lived helper' },
      { key: 'check', val: 'Wikipedia RAM below Safari (287 MB)' },
    ],
  },
  {
    id: 'worktree',
    num: '02',
    short: 'Worktree',
    busLabel: 'Worktree',
    sub: 'Isolated copy',
    lane: 'agent',
    owner: 'Agent',
    title: 'Run each task in its own Git worktree',
    body: 'Each agent works in a clean checkout of main so parallel tasks never step on each other or mix diffs.',
    example: 'Local models take small jobs and cloud models take harder ones without colliding.',
    artifactLabel: 'Illustrative worktrees',
    artifactKind: 'tree',
    artifactRows: [
      { key: 'wt/filter-helper', val: 'cloud · implementation patch' },
      { key: 'wt/tab-shortcuts', val: 'local · implementation patch' },
      { key: 'wt/review-pass', val: 'read-only · bug findings' },
    ],
  },
  {
    id: 'review',
    num: '03',
    short: 'Review',
    busLabel: 'Review',
    sub: 'Diff + bug pass',
    lane: 'both',
    owner: 'Me + agent',
    title: 'Read the diff and trim extra scope',
    body: 'I read the patch myself and run a read-only bug pass on larger changes, trimming anything outside the brief.',
    example: 'If a patch wanders outside the brief or adds extra layers, it gets trimmed before testing.',
    artifactLabel: 'Illustrative diff check',
    artifactKind: 'diff',
    artifactRows: [
      { mark: '-', sr: 'Removed:', text: 'in-process filter compilation', tone: 'del' },
      { mark: '+', sr: 'Added:', text: 'short-lived helper compiles & exits', tone: 'add' },
      { mark: '~', sr: 'Trimmed:', text: 'extra layer outside brief trimmed', tone: 'trim' },
    ],
  },
  {
    id: 'test',
    num: '04',
    short: 'Test build',
    busLabel: 'Test',
    sub: 'Run like a user',
    lane: 'me',
    owner: 'Me',
    title: 'Run the built app the way a user will',
    body: 'Unit tests are the floor. I test signed builds, live SSH sessions, or benchmarks; failures loop back to a fresh worktree.',
    example: 'The same check means a live Herdwick SSH session on iPhone, or playing Inkjoin offline in dark mode.',
    artifactLabel: 'angl browser · measured check',
    artifactKind: 'gate',
    artifactRows: [
      { key: 'build', val: 'Signed & notarized Apple Silicon Mac app' },
      { key: 'ram', val: '227 MB on Wikipedia vs. Safari 287 MB' },
      { key: 'gate', val: 'Pass: merge to main. Fail: back to step 02.' },
    ],
  },
]

const CHECK_CASES = [
  {
    id: 'winstream',
    label: 'winstream',
    platform: 'Windows · Rust',
    lookedFine: 'Clean build + unit tests pass, hiding idle timer wakeups.',
    caughtTitle: 'Three 60-second synthetic runs caught idle timer wakeups hurting frame pacing',
    caughtBody: '1080p60 NVENC vs. OBS 32.0.2 + overlays on Windows 11 (67 MB idle, -7.9 ms median A/V sync, GPU-bound 1%/0.1% lows 205/201 vs. 201/185 fps).',
    kind: 'bars',
    bars: [
      {
        metric: 'Active private RAM (lower is better)',
        mine: '262 MB',
        mineNum: 262,
        otherLabel: 'OBS 32.0.2',
        other: '788–931 MB',
        otherLow: 788,
        otherHigh: 931,
      },
      {
        metric: 'VRAM footprint (lower is better)',
        mine: '150 MB',
        mineNum: 150,
        otherLabel: 'OBS 32.0.2',
        other: '233–259 MB',
        otherLow: 233,
        otherHigh: 259,
      },
      {
        metric: 'GPU-bound CPU overhead, 1 core',
        mine: '+13%',
        mineNum: 13,
        otherLabel: 'OBS + overlays',
        other: '+37%',
        otherLow: 37,
        otherHigh: 37,
      },
    ],
    note: 'Under a 599 Hz cap, 0.1% lows still trail OBS because of Windows Graphics Capture overhead (465–469 fps vs. 563–570 fps).',
  },
  {
    id: 'angl',
    label: 'angl browser',
    platform: 'macOS · WebKit',
    lookedFine: 'Pages load and block ads while filter compilation spikes browser RAM.',
    caughtTitle: 'Moving filter compilation to a short-lived helper kept Wikipedia RAM below Safari',
    caughtBody: 'Running ad-block compilation in a separate helper process that exits after compiling keeps memory out of the main Swift/AppKit/WebKit browser process.',
    kind: 'process',
    bars: [
      {
        metric: 'Memory on Wikipedia (lower is better)',
        mine: '227 MB',
        mineNum: 227,
        otherLabel: 'Safari',
        other: '287 MB',
        otherLow: 287,
        otherHigh: 287,
      },
    ],
    note: 'Signed and notarized for Apple Silicon Macs on macOS 15 or newer.',
  },
  {
    id: 'omalo',
    label: 'omalo',
    platform: 'ESP32-S3 · GBA',
    lookedFine: 'Agent reports the battle ended and the catch succeeded.',
    caughtTitle: 'Waiting for the game to settle and diffing party + PC memory verifies a catch',
    caughtBody: 'Lets Pokémon Emerald settle and diffs party and PC boxes against the pre-battle snapshot—even for a species you already own.',
    kind: 'memory',
    partyBefore: ['slot 1', 'slot 2', 'slot 3', 'slot 4', 'empty', 'empty'],
    partyAfter: ['slot 1', 'slot 2', 'slot 3', 'slot 4', '+catch', 'empty'],
    note: 'Illustrative state diff (not a recorded catch).',
    link: { to: '/projects/s3-amoled#catch-check', label: 'read the omalo catch check' },
  },
  {
    id: 'herdwick',
    label: 'Herdwick',
    platform: 'iOS · SSH',
    lookedFine: 'Local preview renders chat layout without a live SSH or Tailscale host.',
    caughtTitle: 'Live iPhone / iPad session over plain SSH or Tailscale against herdr',
    caughtBody: 'On-device check connects to a Mac or Linux host, lists tracked agents, reads transcripts as chat, answers a live permission prompt, reviews a diff, and checks optional push alerts.',
    kind: 'topology',
    verifiedItems: ['Chat transcripts', 'Permission prompts', 'Patch diffs', 'Optional push alerts'],
    note: 'No accounts or analytics; SSH keys stay in the iOS Keychain on the device.',
  },
]

const WORKTREE_STATUS = {
  isolated: 'Each task runs in its own directory with its own brief and check, so every patch is small enough to review and test before merging.',
  shared: 'When multiple tasks share one checkout, agents edit the same files, tests fail for unrelated reasons, and the diff turns into a pile you have to pick apart by hand.',
}

const TOP_TOOLS = [
  {
    id: 'dictation',
    role: 'Voice in',
    stageTag: 'feeds 01 brief',
    stages: ['brief'],
    name: 'Dictation',
    desc: 'Offline Mac voice-to-text with custom technical vocabulary so talking through a brief beats typing.',
    links: [
      { label: 'download for mac', href: 'https://github.com/btuckerc/dictation/releases/latest' },
      { label: 'code', href: 'https://github.com/btuckerc/dictation' },
    ],
  },
  {
    id: 'pace-bar',
    role: 'Quota & speed',
    stageTag: 'informs 02 worktree',
    stages: ['worktree'],
    name: 'Pace Bar',
    desc: 'Menu bar tracker for Codex/Claude quotas beside local token speed and GPU use, so I can send small jobs to local models.',
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
    stageTag: 'feeds 03 review · 04 test',
    stages: ['review', 'test'],
    name: 'Herdwick',
    desc: 'iPhone and iPad app over SSH or Tailscale for answering prompts, reading diffs, and optional push alerts when a run needs input or finishes.',
    links: [
      { label: 'app store', href: 'https://apps.apple.com/app/id6815920496' },
      { label: 'code', href: 'https://github.com/btuckerc/herdwick' },
    ],
  },
  {
    id: 'boilerplate',
    role: 'Base setup',
    stageTag: 'underpins 01–04',
    stages: ['brief', 'worktree', 'review', 'test'],
    name: 'Boilerplate',
    desc: 'Shared Mac and Linux dotfiles managed with chezmoi and mise so every machine shares one shell and toolchain.',
    links: [
      { label: 'browse config', href: 'https://github.com/btuckerc/boilerplate' },
    ],
  },
]

const FINISHING_ROWS = [
  {
    demo: 'Works once on my machine in debug mode',
    shipped: 'Signed and notarized Apple Silicon Mac downloads',
    apps: ['angl browser', 'Pace Bar', 'Dictation', 'StreamApp'],
  },
  {
    demo: 'Needs manual setup steps nobody else will do',
    shipped: 'App Store review, support pages, and plain privacy policies',
    apps: ['Herdwick', 'Inkjoin'],
  },
  {
    demo: 'Memory spikes or crashes lose what you were doing',
    shipped: 'Crash-recoverable recordings in StreamApp and a short-lived ad-block helper in angl browser',
    apps: ['StreamApp', 'angl browser'],
  },
  {
    demo: "Doesn't say what's still broken",
    shipped: "A section in the README listing what doesn't work yet",
    apps: [],
  },
]

function barPct(value, max) {
  return Math.max(4, Math.min(100, Math.round((value / max) * 100)))
}

function moveTabIndex(event, currentIndex, count, orientation, onSelect) {
  const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight'
  const prevKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft'
  if (event.key === nextKey) {
    event.preventDefault()
    onSelect((currentIndex + 1) % count)
  } else if (event.key === prevKey) {
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

function StepArtifact({ step }) {
  return (
    <div className="wf-artifact" role="group" aria-label={step.artifactLabel}>
      <div className="wf-artifact-head">
        <span>{step.artifactLabel}</span>
        <span className="wf-artifact-step-tag" aria-hidden="true">{step.num}</span>
      </div>
      {step.artifactKind === 'brief' && (
        <dl className="wf-artifact-kv">
          {step.artifactRows.map((row) => (
            <div key={row.key} className="wf-artifact-kv-row">
              <dt>{row.key}</dt>
              <dd>{row.val}</dd>
            </div>
          ))}
        </dl>
      )}
      {step.artifactKind === 'tree' && (
        <div className="wf-artifact-tree">
          <div className="wf-artifact-tree-root">main · clean base</div>
          {step.artifactRows.map((row) => (
            <div key={row.key} className="wf-artifact-tree-branch">
              <span className="wf-artifact-branch-name">{row.key}</span>
              <span className="wf-artifact-branch-meta">{row.val}</span>
            </div>
          ))}
        </div>
      )}
      {step.artifactKind === 'diff' && (
        <div className="wf-artifact-diff">
          {step.artifactRows.map((row) => (
            <div key={row.text} className={`wf-artifact-diff-row wf-artifact-diff-${row.tone}`}>
              <span className="wf-artifact-diff-mark" aria-hidden="true">{row.mark}</span>
              <span>
                <span className="sr-only">{row.sr} </span>
                {row.text}
              </span>
            </div>
          ))}
        </div>
      )}
      {step.artifactKind === 'gate' && (
        <div className="wf-artifact-gate">
          {step.artifactRows.map((row) => (
            <div key={row.key} className="wf-artifact-gate-row">
              <span className="wf-artifact-check" aria-hidden="true">[x]</span>
              <span className="wf-artifact-gate-key">{row.key}</span>
              <span className="wf-artifact-gate-val">{row.val}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function WorkflowLoopDiagram({ compact = false }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const orientation = useVerticalTabOrientation()
  const uid = useId().replace(/:/g, '')
  const tabRefs = useRef([])

  const selectStep = (index, shouldFocus = false) => {
    setActiveIndex(index)
    if (shouldFocus) tabRefs.current[index]?.focus()
  }

  return (
    <figure className={`wf-visual ${compact ? 'wf-visual-compact' : ''}`}>
      <figcaption className="wf-visual-head">
        <span className="wf-visual-kicker">one change, start to finish</span>
        <span className="wf-visual-hint">angl browser · filter helper</span>
      </figcaption>

      <div className="wf-loop-stage">
        <div className="wf-swimlane-shell">
          <div className="wf-swimlane-rails" aria-hidden="true">
            <span className="wf-swimlane-rail wf-swimlane-rail-me">me</span>
            <span className="wf-swimlane-rail wf-swimlane-rail-agent">agent</span>
          </div>

          <div
            className="wf-swimlane-grid"
            role="tablist"
            aria-label="Workflow steps"
            aria-orientation={orientation}
          >
            {LOOP_STEPS.map((step, index) => (
              <button
                key={step.id}
                ref={(el) => { tabRefs.current[index] = el }}
                type="button"
                role="tab"
                id={`${uid}-tab-${step.id}`}
                aria-selected={activeIndex === index}
                aria-controls={`${uid}-panel-${step.id}`}
                tabIndex={activeIndex === index ? 0 : -1}
                className={`wf-loop-step wf-loop-step-${step.id} wf-owner-${step.lane}`}
                onClick={() => selectStep(index)}
                onKeyDown={(e) => moveTabIndex(e, index, LOOP_STEPS.length, orientation, (next) => selectStep(next, true))}
              >
                <span className="wf-loop-step-top">
                  <span className="wf-loop-step-num">{step.num}</span>
                  <span className="wf-loop-step-title">{step.short}</span>
                </span>
                <span className="wf-loop-step-sub">{step.sub}</span>
                <span className="wf-loop-step-lane-tag">{step.owner}</span>
              </button>
            ))}

            {/* Orthogonal stepped SVG lines + crisp CSS arrowheads (never distorted) */}
            <span
              className={`wf-lane-wire wf-lane-wire-12 ${activeIndex === 0 || activeIndex === 1 ? 'is-active' : ''}`}
              aria-hidden="true"
            >
              <svg viewBox="0 0 28 100" preserveAspectRatio="none">
                <path d="M 0 24 H 14 V 76 H 23" fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              </svg>
            </span>
            <span
              className={`wf-lane-wire wf-lane-wire-23 ${activeIndex === 1 || activeIndex === 2 ? 'is-active' : ''}`}
              aria-hidden="true"
            >
              <svg viewBox="0 0 28 100" preserveAspectRatio="none">
                <path d="M 0 76 H 23" fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              </svg>
            </span>
            <span
              className={`wf-lane-wire wf-lane-wire-34 ${activeIndex === 2 || activeIndex === 3 ? 'is-active' : ''}`}
              aria-hidden="true"
            >
              <svg viewBox="0 0 28 100" preserveAspectRatio="none">
                <path d="M 0 24 H 23" fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              </svg>
            </span>

            {/* Vertical drop-through stems directly beneath 04 Test build bridging row 2 into return & pass exits */}
            <span className="wf-loop-test-drops" aria-hidden="true">
              <span className={`wf-loop-drop-fail ${activeIndex === 1 || activeIndex === 3 ? 'is-active' : ''}`} />
              <span className={`wf-loop-drop-pass ${activeIndex === 3 ? 'is-active' : ''}`} />
            </span>
          </div>
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

      {/* Zero-shift CSS Grid 1/1 stack (React 18 uses string inert=''; React 19 requires boolean inert={!isActive}) */}
      <div className="wf-panel-stack wf-detail-stack">
        {LOOP_STEPS.map((step, index) => {
          const isActive = index === activeIndex
          return (
            <div
              key={step.id}
              inert={isActive ? undefined : ''}
              id={`${uid}-panel-${step.id}`}
              role={isActive ? 'tabpanel' : undefined}
              tabIndex={isActive ? 0 : undefined}
              aria-labelledby={isActive ? `${uid}-tab-${step.id}` : undefined}
              aria-hidden={isActive ? undefined : 'true'}
              data-active={isActive ? 'true' : 'false'}
              className="wf-panel-slot wf-detail-bar"
            >
              <div className="wf-detail-prose">
                <div className="wf-detail-meta">
                  <span className={`wf-owner-badge wf-owner-badge-${step.lane}`}>{step.owner}</span>
                  <span className="wf-detail-title">{step.title}</span>
                </div>
                <p className="wf-detail-copy">{step.body}</p>
                {!compact && (
                  <p className="wf-detail-example-inline">
                    <span className="wf-detail-example-tag">Example:</span> {step.example}
                  </p>
                )}
              </div>
              <StepArtifact step={step} />
            </div>
          )
        })}
      </div>
    </figure>
  )
}

function MetricBars({ label, bars }) {
  return (
    <div className="wf-bars" role="group" aria-label={`${label} measured numbers`}>
      {bars.map((bar) => {
        const maxVal = Math.max(bar.mineNum, bar.otherHigh)
        const minePct = barPct(bar.mineNum, maxVal)
        const otherLowPct = barPct(bar.otherLow, maxVal)
        const otherHighPct = barPct(bar.otherHigh, maxVal)
        const isRange = bar.otherHigh > bar.otherLow
        return (
          <div key={bar.metric} className="wf-bar-group">
            <span className="wf-bar-metric">{bar.metric}</span>
            <div className="wf-bar-row">
              <span className="wf-bar-name wf-bar-name-win">{label}</span>
              <div className="wf-bar-track" aria-hidden="true">
                <div className="wf-bar-fill wf-bar-fill-win" style={{ width: `${minePct}%` }} />
              </div>
              <span className="wf-bar-val wf-bar-val-win">{bar.mine}</span>
            </div>
            <div className="wf-bar-row">
              <span className="wf-bar-name">{bar.otherLabel}</span>
              <div className="wf-bar-track" aria-hidden="true">
                {isRange ? (
                  <>
                    <div className="wf-bar-fill wf-bar-fill-base" style={{ width: `${otherLowPct}%` }} />
                    <div
                      className="wf-bar-range-band"
                      style={{
                        left: `${otherLowPct}%`,
                        width: `${Math.max(4, otherHighPct - otherLowPct)}%`,
                      }}
                    />
                  </>
                ) : (
                  <div className="wf-bar-fill" style={{ width: `${otherHighPct}%` }} />
                )}
              </div>
              <span className="wf-bar-val">{bar.other}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function RealCheckCases() {
  const [activeIndex, setActiveIndex] = useState(0)
  const orientation = useVerticalTabOrientation()
  const uid = useId().replace(/:/g, '')
  const tabRefs = useRef([])

  const selectCase = (index, shouldFocus = false) => {
    setActiveIndex(index)
    if (shouldFocus) tabRefs.current[index]?.focus()
  }

  return (
    <figure className="wf-visual">
      <figcaption className="wf-visual-head">
        <span className="wf-visual-kicker">checks across my apps</span>
        <span className="wf-visual-hint">real runs vs. unit tests</span>
      </figcaption>

      <div
        className="wf-tab-row"
        role="tablist"
        aria-label="Verification examples by project"
        aria-orientation={orientation}
      >
        {CHECK_CASES.map((item, index) => (
          <button
            key={item.id}
            ref={(el) => { tabRefs.current[index] = el }}
            type="button"
            role="tab"
            id={`${uid}-case-${item.id}`}
            aria-selected={activeIndex === index}
            aria-controls={`${uid}-case-panel-${item.id}`}
            tabIndex={activeIndex === index ? 0 : -1}
            className="wf-tab-btn"
            onClick={() => selectCase(index)}
            onKeyDown={(e) => moveTabIndex(e, index, CHECK_CASES.length, orientation, (next) => selectCase(next, true))}
          >
            <span className="wf-tab-num">{item.platform}</span>
            <span className="wf-tab-title">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Zero-shift CSS Grid 1/1 stack with tightly balanced natural panel heights */}
      <div className="wf-panel-stack wf-check-stack">
        {CHECK_CASES.map((item, index) => {
          const isActive = index === activeIndex
          return (
            <div
              key={item.id}
              inert={isActive ? undefined : ''}
              id={`${uid}-case-panel-${item.id}`}
              role={isActive ? 'tabpanel' : undefined}
              tabIndex={isActive ? 0 : undefined}
              aria-labelledby={isActive ? `${uid}-case-${item.id}` : undefined}
              aria-hidden={isActive ? undefined : 'true'}
              data-active={isActive ? 'true' : 'false'}
              className="wf-panel-slot wf-check-panel"
            >
              <div className="wf-check-baseline">
                <span className="wf-check-baseline-label">Looked fine</span>
                <span className="wf-check-baseline-text">{item.lookedFine}</span>
              </div>

              <div className="wf-check-box">
                <div className="wf-check-box-head">
                  <p className="wf-check-label">What the real check verifies</p>
                  <p className="wf-check-headline">{item.caughtTitle}</p>
                  <p className="wf-check-body">{item.caughtBody}</p>
                </div>

                <div className="wf-evidence-plate">
                  {item.kind === 'bars' && (
                    <MetricBars label={item.label} bars={item.bars} />
                  )}

                  {item.kind === 'process' && (
                    <>
                      <div className="wf-proc-schematic" role="group" aria-label="angl browser process isolation">
                        <div className="wf-proc-node wf-proc-main">
                          <span className="wf-proc-tag">main process</span>
                          <span className="wf-proc-title">angl browser</span>
                          <span className="wf-proc-sub">Swift · AppKit · WebKit · stays lean</span>
                        </div>
                        <div className="wf-proc-link" aria-hidden="true">
                          <span className="wf-proc-link-label">spawns</span>
                          <span className="wf-proc-line" />
                        </div>
                        <div className="wf-proc-node wf-proc-helper">
                          <span className="wf-proc-tag">short-lived helper</span>
                          <span className="wf-proc-title">ad-block compiler</span>
                          <span className="wf-proc-sub">compiles filters · exits &amp; frees RAM</span>
                        </div>
                      </div>
                      <MetricBars label={item.label} bars={item.bars} />
                    </>
                  )}

                  {item.kind === 'memory' && (
                    <div className="wf-omalo-plate" role="group" aria-label="Illustrative game memory diff before and after catch">
                      <div className="wf-settle-strip" aria-hidden="true">
                        <span className="wf-settle-step">1. Battle ends</span>
                        <span className="wf-settle-dash" />
                        <span className="wf-settle-step">2. Wait to settle</span>
                        <span className="wf-settle-dash" />
                        <span className="wf-settle-step wf-settle-step-accent">3. Diff party + PC RAM</span>
                      </div>
                      <div className="wf-mem-diff">
                        <div className="wf-mem-col">
                          <p className="wf-mem-head">Before battle · Party [4/6] + PC boxes</p>
                          <div className="wf-slot-grid">
                            {item.partyBefore.map((slot, sIdx) => (
                              <span key={`b-${sIdx}`} className={`wf-slot-cell ${slot === 'empty' ? 'wf-slot-empty' : ''}`}>
                                {slot}
                              </span>
                            ))}
                          </div>
                          <p className="wf-mem-line">PC boxes: existing Pokémon snapshot</p>
                        </div>
                        <div className="wf-mem-col wf-mem-col-after">
                          <p className="wf-mem-head">After settle · Party [5/6] + PC boxes</p>
                          <div className="wf-slot-grid">
                            {item.partyAfter.map((slot, sIdx) => (
                              <span
                                key={`a-${sIdx}`}
                                className={`wf-slot-cell ${slot === 'empty' ? 'wf-slot-empty' : ''} ${slot.startsWith('+') ? 'wf-slot-added' : ''}`}
                              >
                                {slot}
                              </span>
                            ))}
                          </div>
                          <p className="wf-mem-line wf-mem-added">+ New catch: shows up once (even duplicate species)</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {item.kind === 'topology' && (
                    <div className="wf-topo-plate" role="group" aria-label="Herdwick live SSH session topology">
                      <div className="wf-topo-row">
                        <div className="wf-topo-node wf-topo-device">
                          <span className="wf-proc-tag">on device</span>
                          <span className="wf-proc-title">iPhone / iPad</span>
                          <span className="wf-proc-sub">SSH keys stay in iOS Keychain</span>
                        </div>
                        <div className="wf-topo-tunnel" aria-hidden="true">
                          <span className="wf-topo-tunnel-label">SSH / Tailscale</span>
                          <span className="wf-proc-line" />
                        </div>
                        <div className="wf-topo-node wf-topo-host">
                          <span className="wf-proc-tag">your machine</span>
                          <span className="wf-proc-title">Mac / Linux · herdr</span>
                          <span className="wf-proc-sub">omp · Claude Code · Codex</span>
                        </div>
                      </div>
                      <div className="wf-topo-checks">
                        {item.verifiedItems.map((check) => (
                          <span key={check} className="wf-topo-check-item">
                            <span className="wf-artifact-check" aria-hidden="true">[x]</span>
                            <span>{check}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="wf-check-foot">
                  <p className="wf-check-note">{item.note}</p>
                  {item.link && (
                    <Link className="tui-link-chip wf-check-link" to={item.link.to}>
                      {item.link.label}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )
        })}
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
        <span className="wf-visual-hint">isolated vs. shared checkout</span>
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

      {/* Zero-shift CSS Grid 1/1 stack for both diagram stages */}
      <div className="wf-wt-stage wf-panel-stack">
        <div
          inert={isolated ? undefined : ''}
          aria-hidden={isolated ? undefined : 'true'}
          data-active={isolated ? 'true' : 'false'}
          className="wf-panel-slot wf-wt-flow"
          role={isolated ? 'group' : undefined}
          aria-label={isolated ? 'Clean parallel workflow: main branches into two implementation worktrees that produce separate patches and a read-only bug pass that reports findings. Patches are reviewed and tested in the built app before merging back to main.' : undefined}
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

        <div
          inert={!isolated ? undefined : ''}
          aria-hidden={!isolated ? undefined : 'true'}
          data-active={!isolated ? 'true' : 'false'}
          className="wf-panel-slot wf-wt-flow wf-wt-flow-shared"
          role={!isolated ? 'group' : undefined}
          aria-label={!isolated ? 'Messy shared workspace: three tasks write into one shared checkout, causing overwritten edits, mixed diffs, and unclear build failures.' : undefined}
        >
          <div className="wf-wt-stack">
            <div className="wf-wt-box">
              <p className="wf-wt-box-title">Task A: filter helper</p>
              <p className="wf-wt-box-meta">writes directly to tree</p>
            </div>
            <div className="wf-wt-box">
              <p className="wf-wt-box-title">Task B: tab shortcuts</p>
              <p className="wf-wt-box-meta">writes directly to tree</p>
            </div>
            <div className="wf-wt-box">
              <p className="wf-wt-box-title">Task C: cleanup</p>
              <p className="wf-wt-box-meta">writes directly to tree</p>
            </div>
          </div>

          <div className="wf-wt-wire" aria-hidden="true">
            <svg viewBox="0 0 36 160" preserveAspectRatio="none">
              <defs>
                <marker id={`${uid}-sh-a`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                  <path d="M 1 1.5 L 8.5 5 L 1 8.5 z" fill="var(--muted)" />
                </marker>
              </defs>
              <path d="M 0 26 C 16 26, 16 74, 33 74" fill="none" stroke="var(--muted)" strokeWidth="1.5" strokeDasharray="4 4" markerEnd={`url(#${uid}-sh-a)`} />
              <path d="M 0 80 H 33" fill="none" stroke="var(--muted)" strokeWidth="1.5" strokeDasharray="4 4" markerEnd={`url(#${uid}-sh-a)`} />
              <path d="M 0 134 C 16 134, 16 86, 33 86" fill="none" stroke="var(--muted)" strokeWidth="1.5" strokeDasharray="4 4" markerEnd={`url(#${uid}-sh-a)`} />
            </svg>
          </div>
          <div className="wf-wt-wire-mobile wf-wt-wire-mobile-muted" aria-hidden="true">↓</div>

          <div className="wf-wt-col-center">
            <div className="wf-wt-box wf-wt-box-warn">
              <p className="wf-wt-box-title">One shared checkout</p>
              <ul className="wf-wt-warn-list">
                <li><span className="wf-warn-mark" aria-hidden="true">!</span><span>edits overwrite each other</span></li>
                <li><span className="wf-warn-mark" aria-hidden="true">!</span><span>git diff mixes all 3 tasks</span></li>
                <li><span className="wf-warn-mark" aria-hidden="true">!</span><span>build breaks mid-run</span></li>
              </ul>
            </div>
          </div>

          <div className="wf-wt-wire" aria-hidden="true">
            <svg viewBox="0 0 32 160" preserveAspectRatio="none">
              <defs>
                <marker id={`${uid}-sh-b`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                  <path d="M 1 1.5 L 8.5 5 L 1 8.5 z" fill="var(--muted)" />
                </marker>
              </defs>
              <line x1="0" y1="80" x2="29" y2="80" stroke="var(--muted)" strokeWidth="1.5" strokeDasharray="4 4" markerEnd={`url(#${uid}-sh-b)`} />
            </svg>
          </div>
          <div className="wf-wt-wire-mobile wf-wt-wire-mobile-muted" aria-hidden="true">↓</div>

          <div className="wf-wt-col-center">
            <div className="wf-wt-box wf-wt-box-warn">
              <p className="wf-wt-box-title">Hard to untangle</p>
              <p className="wf-wt-box-meta">which task broke the build?</p>
            </div>
          </div>
        </div>
      </div>

      {/* Zero-shift stacked status caption + single live status announcer */}
      <div className="wf-panel-stack wf-wt-status-stack">
        {(['isolated', 'shared']).map((key) => {
          const isCurrent = mode === key
          return (
            <p
              key={key}
              aria-hidden="true"
              data-active={isCurrent ? 'true' : 'false'}
              className={`wf-panel-slot wf-wt-status ${key === 'shared' ? 'wf-wt-status-warn' : ''}`}
            >
              {WORKTREE_STATUS[key]}
            </p>
          )
        })}
      </div>
      <p role="status" className="sr-only">{WORKTREE_STATUS[mode]}</p>

      <div className="wf-ownership-strip">
        <p>
          <span className="wf-lane-swatch wf-lane-swatch-me" aria-hidden="true" />
          <strong>I keep:</strong> design decisions, short briefs, live testing, and merging.
        </p>
        <p>
          <span className="wf-lane-swatch wf-lane-swatch-agent" aria-hidden="true" />
          <strong>Agents take:</strong> scoped work in separate worktrees (local for small jobs, cloud for harder ones) and read-only bug passes.
        </p>
      </div>
    </figure>
  )
}

function ToolCard({ tool, onHover }) {
  return (
    <div
      className="wf-tool-card"
      onMouseEnter={() => onHover(tool.stages)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(tool.stages)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) onHover(null)
      }}
    >
      <div>
        <div className="wf-tool-top">
          <span className="wf-tool-role">{tool.role}</span>
          <span className="wf-tool-stage-tag">{tool.stageTag}</span>
        </div>
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
  const [activeStages, setActiveStages] = useState(null)

  return (
    <figure className="wf-visual">
      <figcaption className="wf-visual-head">
        <span className="wf-visual-kicker">four tools wired into the loop</span>
        <span className="wf-visual-hint">each tool serves a stage</span>
      </figcaption>

      <div className="wf-hub-row">
        {TOP_TOOLS.map((tool) => (
          <ToolCard key={tool.id} tool={tool} onHover={setActiveStages} />
        ))}
      </div>

      <div className="wf-hub-connectors" aria-hidden="true">
        <span className="wf-hub-stem" />
        <span className="wf-hub-stem" />
      </div>

      <div className="wf-hub-spine">
        <div className="wf-hub-spine-head">
          <span className="wf-hub-spine-title">Coding session (Mac + Linux)</span>
          <span className="wf-hub-spine-meta">briefs · worktrees · diffs</span>
        </div>
        <ol className="wf-hub-bus" aria-label="Loop stages served by tools">
          {LOOP_STEPS.map((stage) => {
            const lit = activeStages?.includes(stage.id)
            return (
              <li key={stage.id} className={`wf-hub-bus-node ${lit ? 'is-lit' : ''}`}>
                <span className="wf-hub-bus-num">{stage.num}</span>
                <span>{stage.busLabel}</span>
              </li>
            )
          })}
        </ol>
      </div>

      <div className="wf-hub-connectors" aria-hidden="true">
        <span className="wf-hub-stem" />
        <span className="wf-hub-stem" />
      </div>

      <div className="wf-hub-row">
        {BOTTOM_TOOLS.map((tool) => (
          <ToolCard key={tool.id} tool={tool} onHover={setActiveStages} />
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
        <span className="wf-visual-hint">demo trap vs. shipped work</span>
      </figcaption>

      <div className="wf-finish-ledger">
        <div className="wf-finish-ledger-head" aria-hidden="true">
          <span>Easy place to stop</span>
          <span>What makes it usable</span>
        </div>

        <ul className="wf-finish-rows">
          {FINISHING_ROWS.map((row) => (
            <li key={row.demo} className="wf-finish-row">
              <div className="wf-finish-cell-demo">
                <span className="wf-finish-cell-kicker">Easy place to stop</span>
                <p>
                  <span className="wf-finish-mark wf-finish-mark-dim" aria-hidden="true">-</span>
                  <span>{row.demo}</span>
                </p>
              </div>
              <div className="wf-finish-cell-ship">
                <span className="wf-finish-cell-kicker wf-finish-cell-kicker-accent">What makes it usable</span>
                <p>
                  <span className="wf-finish-mark" aria-hidden="true">+</span>
                  <span>{row.shipped}</span>
                </p>
                {row.apps.length > 0 && (
                  <div className="wf-finish-apps">
                    {row.apps.map((app) => (
                      <span key={app} className="wf-finish-app-tag">{app}</span>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  )
}
