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

/* ==========================================================================
 * Data: Current Model Stack (Directors, Workers, Receipts, Review Gate)
 * ========================================================================== */

const STACK_LAYERS = [
  {
    id: 'direct',
    num: '01',
    short: 'Direct',
    sub: 'Design, split, check',
    headline: 'Two peer directors own the plan and the final build',
    plain:
      'One model sits with me as the lead. We decide how a feature should work, split it into small briefs, review every patch, and run the built app.',
    detail:
      'Both directors share one ruleset from my dotfiles and delegate through one wrapper (agent-run), never loose subagents. They never grade their own big changes.',
    models: [
      {
        name: 'Gemini 4 Neon',
        effort: 'high',
        family: 'google',
        runner: 'Antigravity (agy)',
        role: 'Primary director for daily work, prose, design, and verification.',
      },
      {
        name: 'Claude Opus 5.5',
        effort: 'high',
        family: 'anthropic',
        runner: 'Claude Code',
        role: 'Peer director for coordinating multi-step work and overall product quality.',
      },
    ],
    receiptTitle: 'Director rule',
    receiptRows: [
      { key: 'owns', val: 'Requirements, briefs, patch apply, real app check' },
      { key: 'guard', val: 'PreToolUse hook blocks nested or detached launches' },
    ],
  },
  {
    id: 'build',
    num: '02',
    short: 'Build',
    sub: 'Sandboxed workers',
    headline: 'Isolated workers write patches in clean copies of the repo',
    plain:
      'Each coding job runs in its own copy of the codebase so parallel work never collides. Hard tasks go to the cloud; small edits run on my home GPU.',
    detail:
      'After every run, agent-run checks the worker transcript to confirm the exact model, effort, and sandbox actually ran. Local Qwen gets read/edit tools only, with no shell access.',
    models: [
      {
        name: 'GPT-6.2 Sol',
        effort: 'high',
        family: 'openai',
        runner: 'agent-run sol · worktree',
        role: 'Detail-oriented worker for hard changes in an isolated Git worktree. Returns result.patch.',
      },
      {
        name: 'Qwen 3.8 27B',
        effort: 'local GPU',
        family: 'local',
        runner: 'nous · Radeon R9700 · bwrap',
        role: 'Bounded edits on my Linux box (vLLM + DFlash2). Read/edit only; I run checks.',
      },
      {
        name: 'GPT-6 Luna',
        effort: 'low',
        family: 'openai',
        runner: 'agent-run ask --model luna',
        role: 'Fast, cheap extraction and bounded summaries.',
      },
    ],
    receiptTitle: 'Transcript receipt (~/.local/state/agent-runs)',
    receiptRows: [
      { key: 'check', val: 'model_ok: true · effort_ok: true · sandbox_ok: true' },
      { key: 'note', val: 'Local bwrap is runner-attested; cloud checks rollout/API log' },
    ],
  },
  {
    id: 'gate',
    num: '03',
    short: 'Council & Audit',
    sub: 'Blind review + gate',
    headline: 'Five blind reviewers plus a strict release auditor',
    plain:
      'Before big changes ship, five models from three companies inspect the exact same frozen snapshot without seeing each other. High-stakes commits also get a pass/fail audit.',
    detail:
      'Agreement between models is not proof because reviewer precision is low. I verify every finding in code or tests, send disputed declines to a fresh Opus tiebreaker, and run the real app.',
    models: [
      {
        name: 'Full Council',
        effort: '5 seats · 3 families',
        family: 'mixed',
        runner: 'Sol · Opus · Fable · Astra · Neon',
        role: 'Read-only JSON review of a frozen git archive snapshot. Loops until done or plateau.',
      },
      {
        name: 'GPT-6.2 Sol',
        effort: 'xhigh · audit',
        family: 'openai',
        runner: 'agent-run audit · read-only',
        role: 'Strict PASS / BLOCK / UNVERIFIED gate on one exact commit. Stops at counterexamples.',
      },
    ],
    receiptTitle: 'Merge gate',
    receiptRows: [
      { key: 'blind', val: 'Frozen git archive · no other seats, no score targets' },
      { key: 'ship', val: 'Real build run like a user clears merge, not test green alone' },
    ],
  },
]

/* ==========================================================================
 * Data: Full Council (5 Independent Seats + Blind Tiebreaker)
 * ========================================================================== */

const COUNCIL_SEATS = [
  {
    id: 'sol',
    name: 'Sol',
    model: 'GPT-6.2 Sol',
    effort: 'xhigh',
    family: 'openai',
    familyLabel: 'OpenAI',
    whyIUseIt: 'Detail-oriented. Good at catching small mistakes and edge cases that are easy to gloss over.',
    briefPrompt: 'In council, its brief asks it to try to make the change fail with concrete inputs.',
    x: 68,
    y: 164,
    sample: {
      score: '8.4',
      verdict: 'CHANGES',
      topRisk: 'Filter helper exits before flushing compiled rule cache on rapid reload.',
      raise: 'Atomic rename on the compiled rule file plus a reload race test.',
      receipt: 'rollout · model_ok · effort_ok · sandbox_ok',
    },
  },
  {
    id: 'opus',
    name: 'Opus',
    model: 'Claude Opus 5.5',
    effort: 'high',
    family: 'anthropic',
    familyLabel: 'Anthropic',
    whyIUseIt: 'Strong at coordinating multi-step work and consistently high quality in the finished product.',
    briefPrompt: 'In council, its brief asks it to question assumptions in the review packet.',
    x: 134,
    y: 78,
    sample: {
      score: '8.6',
      verdict: 'CHANGES',
      topRisk: 'Benchmark script measured idle process after cache warmup, not cold startup.',
      raise: 'Include cold-start capture output in the verification packet.',
      receipt: 'api-log · model_ok · effort_ok · tool-allowlist',
    },
  },
  {
    id: 'fable',
    name: 'Fable',
    model: 'Claude Fable',
    effort: 'high',
    family: 'anthropic',
    familyLabel: 'Anthropic',
    whyIUseIt: 'Strong eye for design and visual polish alongside Neon.',
    briefPrompt: 'In council, its brief asks what can be simplified or cut.',
    x: 230,
    y: 50,
    sample: {
      score: '9.1',
      verdict: 'APPROVE',
      topRisk: 'Fallback queue wrapper adds 90 lines for a single caller.',
      raise: 'Inline the retry loop and drop the extra queue type.',
      receipt: 'api-log · model_ok · effort_ok · tool-allowlist',
    },
  },
  {
    id: 'astra',
    name: 'Astra',
    model: 'GPT-6.2 Astra',
    effort: 'high',
    family: 'openai',
    familyLabel: 'OpenAI',
    whyIUseIt: "I haven't been burning through my Codex subscription lately, so Astra puts those spare tokens to work as another independent review.",
    briefPrompt: 'In council, its brief asks it to walk through real end-to-end use.',
    x: 326,
    y: 78,
    sample: {
      score: '8.8',
      verdict: 'CHANGES',
      topRisk: 'SSH reconnect prompt loses draft reply when iOS wakes from background.',
      raise: 'Persist unsent draft per session before re-establishing the tunnel.',
      receipt: 'rollout · model_ok · effort_ok · sandbox_ok',
    },
  },
  {
    id: 'neon',
    name: 'Neon',
    model: 'Gemini 4 Neon',
    effort: 'read-only',
    family: 'google',
    familyLabel: 'Google',
    whyIUseIt: 'My go-to for prose and design. Clean writing and a fresh perspective when it sits in on review.',
    briefPrompt: 'In council, it starts fresh with no prior chat history and checks for blind spots and clarity.',
    x: 392,
    y: 164,
    sample: {
      score: '9.0',
      verdict: 'APPROVE',
      topRisk: 'Read-only status check shares retry code with mutating game actions.',
      raise: 'Keep read queries on a separate path with zero write side effects.',
      receipt: 'fresh research subagent · strict JSON schema',
    },
  },
]

const COUNCIL_RULES = [
  {
    num: '01',
    title: 'Blind frozen snapshots',
    body: 'Every seat reads the same git archive export and diff. No seat sees another seat, my reasoning, or whether a score target exists.',
  },
  {
    num: '02',
    title: 'Agreement is not proof',
    body: 'Reviewer precision is low even across three model families. I verify every finding in code or tests before fixing or declining it.',
  },
  {
    num: '03',
    title: 'Blind Opus tiebreaker',
    body: 'If a seat still disagrees after counter-evidence, a fresh Opus session rules on the claim alone. I wrote the code, so I never rule on my own decline.',
  },
]

/* ==========================================================================
 * Data: Real Checks, Worktrees, Tooling Hub, Finishing Ledger
 * ========================================================================== */

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
    caughtBody: 'Lets Pokémon Emerald settle and diffs party and PC boxes against the pre-battle snapshot, even for a species you already own.',
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

const TOOLING_STAGES = [
  { id: 'direct', num: '01', label: 'Direct' },
  { id: 'build', num: '02', label: 'Worktrees' },
  { id: 'council', num: '03', label: 'Council' },
  { id: 'test', num: '04', label: 'Test build' },
]

const TOP_TOOLS = [
  {
    id: 'dictation',
    role: 'Voice in',
    stageTag: 'feeds 01 direct',
    stages: ['direct'],
    name: 'Dictation',
    desc: 'Offline Mac voice-to-text with custom technical vocabulary so talking through a brief beats typing.',
    links: [
      { label: 'download for mac', href: 'https://github.com/btuckerc/dictation/releases/latest' },
      { label: 'code', href: 'https://github.com/btuckerc/dictation' },
    ],
  },
  {
    id: 'pace-bar',
    role: 'Quota & local GPU',
    stageTag: 'informs 02 worktrees · 03 council',
    stages: ['build', 'council'],
    name: 'Pace Bar',
    desc: 'Menu bar tracker for Codex/Claude quotas beside local token speed and GPU use on nous, so I can skip low pools or send small jobs to local Qwen.',
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
    stageTag: 'feeds 03 council · 04 test',
    stages: ['council', 'test'],
    name: 'Herdwick',
    desc: 'iPhone and iPad app over SSH or Tailscale for answering prompts, reading diffs, and optional push alerts when a run needs input or finishes.',
    links: [
      { label: 'app store', href: 'https://apps.apple.com/app/id6815920496' },
      { label: 'code', href: 'https://github.com/btuckerc/herdwick' },
    ],
  },
  {
    id: 'boilerplate',
    role: 'Rules & agent-run',
    stageTag: 'underpins 01–04',
    stages: ['direct', 'build', 'council', 'test'],
    name: 'Boilerplate',
    desc: 'Shared Mac and Linux dotfiles managed with chezmoi and mise. Ships agent-run, the council skill, and one shared ruleset for Claude Code and Antigravity.',
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

/* ==========================================================================
 * 3D Isometric Stack SVG (Directors -> Sandboxed Workers -> Council & Audit)
 * ========================================================================== */

function IsometricStackSvg({ activeIndex, onSelect, uid }) {
  const slabPath = (cx, cy, rx = 166, ry = 50) =>
    `M ${cx} ${cy - ry} L ${cx + rx} ${cy} L ${cx} ${cy + ry} L ${cx - rx} ${cy} Z`
  const leftEdge = (cx, cy, rx = 166, ry = 50, h = 15) =>
    `M ${cx - rx} ${cy} L ${cx} ${cy + ry} L ${cx} ${cy + ry + h} L ${cx - rx} ${cy + h} Z`
  const rightEdge = (cx, cy, rx = 166, ry = 50, h = 15) =>
    `M ${cx} ${cy + ry} L ${cx + rx} ${cy} L ${cx + rx} ${cy + h} L ${cx} ${cy + ry + h} Z`

  // Crisp elevated hardware-chip block sitting cleanly on top of an isometric slab
  const renderChip = (x, y, w, h, colorVar, label, sublabel) => (
    <g className="wf-iso-pod" key={`${label}-${x}`}>
      {/* Extruded 3D underside shadow/bevel */}
      <rect x={x} y={y + 4} width={w} height={h} className="wf-iso-chip-base" />
      {/* Top machined face */}
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        className="wf-iso-pod-top"
        style={{ stroke: colorVar }}
      />
      {/* Top color accent bar */}
      <rect x={x} y={y} width={w} height="3" style={{ fill: colorVar }} />
      <text x={x + w / 2} y={y + 16} textAnchor="middle" className="wf-iso-pod-label">
        {label}
      </text>
      {sublabel && (
        <text x={x + w / 2} y={y + 27} textAnchor="middle" className="wf-iso-pod-sub">
          {sublabel}
        </text>
      )}
    </g>
  )

  return (
    <svg
      className="wf-iso-svg"
      viewBox="0 0 440 370"
      role="img"
      aria-label="Three-layer isometric architecture: top plane for Gemini 4 Neon and Claude Opus 5.5 directors, middle plane for isolated GPT-6.2 Sol, local Qwen 3.8, and GPT-6 Luna workers with receipt verification, and bottom plane for the five-seat blind council and Sol release audit."
    >
      <defs>
        <linearGradient id={`${uid}-beam`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.75" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.18" />
        </linearGradient>
        <filter id={`${uid}-shadow`} x="-15%" y="-15%" width="130%" height="145%">
          <feDropShadow dx="0" dy="10" stdDeviation="6" floodColor="#000000" floodOpacity="0.26" />
        </filter>
      </defs>

      {/* Soft ground shadow beneath the bottom slab */}
      <path d={slabPath(226, 308, 154, 42)} className="wf-iso-ground-shadow" />

      {/* LAYER 03 (Bottom): Full Council + Release Audit */}
      <g
        className={`wf-iso-layer ${activeIndex === 2 ? 'is-active' : 'is-dim'}`}
        onClick={() => onSelect(2)}
        filter={`url(#${uid}-shadow)`}
      >
        <path d={leftEdge(226, 266, 174, 52, 16)} className="wf-iso-edge-left" />
        <path d={rightEdge(226, 266, 174, 52, 16)} className="wf-iso-edge-right" />
        <path d={slabPath(226, 266, 174, 52)} className="wf-iso-face" />

        <line x1="140" y1="240" x2="312" y2="292" className="wf-iso-gridline" />
        <line x1="140" y1="292" x2="312" y2="240" className="wf-iso-gridline" />

        {/* 5 Council family seats arranged in perspective arc */}
        <ellipse cx="182" cy="264" rx="68" ry="24" className="wf-iso-council-ring" />
        <circle cx="132" cy="261" r="4.5" style={{ fill: 'var(--fam-openai)' }} />
        <circle cx="155" cy="245" r="4.5" style={{ fill: 'var(--fam-anthropic)' }} />
        <circle cx="184" cy="240" r="4.5" style={{ fill: 'var(--fam-anthropic)' }} />
        <circle cx="212" cy="246" r="4.5" style={{ fill: 'var(--fam-openai)' }} />
        <circle cx="232" cy="261" r="4.5" style={{ fill: 'var(--fam-google)' }} />
        <text x="182" y="266" textAnchor="middle" className="wf-iso-pod-label">
          5-seat council
        </text>
        <text x="182" y="278" textAnchor="middle" className="wf-iso-pod-sub">
          blind snapshot
        </text>

        {renderChip(262, 246, 86, 34, 'var(--fam-openai)', 'Sol audit', 'xhigh gate')}

        <text x="20" y="328" className="wf-iso-plane-tag">03 · REVIEW &amp; GATE</text>
      </g>

      {/* Vertical connectors from Layer 02 -> Layer 03 */}
      <g className="wf-iso-connectors" aria-hidden="true">
        <line x1="172" y1="204" x2="172" y2="244" stroke={`url(#${uid}-beam)`} strokeWidth="1.6" strokeDasharray="3 3" />
        <line x1="286" y1="204" x2="286" y2="246" stroke={`url(#${uid}-beam)`} strokeWidth="1.6" strokeDasharray="3 3" />
        <circle cx="172" cy="244" r="2.6" className="wf-iso-anchor" />
        <circle cx="286" cy="246" r="2.6" className="wf-iso-anchor" />
      </g>

      {/* LAYER 02 (Middle): Sandboxed Workers (agent-run) */}
      <g
        className={`wf-iso-layer ${activeIndex === 1 ? 'is-active' : 'is-dim'}`}
        onClick={() => onSelect(1)}
        filter={`url(#${uid}-shadow)`}
      >
        <path d={leftEdge(226, 170, 174, 52, 16)} className="wf-iso-edge-left" />
        <path d={rightEdge(226, 170, 174, 52, 16)} className="wf-iso-edge-right" />
        <path d={slabPath(226, 170, 174, 52)} className="wf-iso-face" />

        {renderChip(96, 150, 84, 34, 'var(--fam-openai)', 'GPT-6.2 Sol', 'git worktree')}
        {renderChip(188, 150, 84, 34, 'var(--fam-local)', 'Qwen 3.8', 'local bwrap')}
        {renderChip(280, 150, 78, 34, 'var(--fam-openai)', 'GPT-6 Luna', 'extract')}

        {/* Receipt verification tag */}
        <g transform="translate(274, 198)">
          <rect x="0" y="0" width="118" height="17" className="wf-iso-chip-bg" />
          <text x="59" y="11.5" textAnchor="middle" className="wf-iso-chip-text">
            receipt: model_ok
          </text>
        </g>

        <text x="20" y="232" className="wf-iso-plane-tag">02 · BUILD (AGENT-RUN)</text>
      </g>

      {/* Vertical connectors from Layer 01 -> Layer 02 */}
      <g className="wf-iso-connectors" aria-hidden="true">
        <line x1="176" y1="108" x2="176" y2="150" stroke={`url(#${uid}-beam)`} strokeWidth="1.6" />
        <line x1="278" y1="108" x2="278" y2="150" stroke={`url(#${uid}-beam)`} strokeWidth="1.6" />
        <circle cx="176" cy="150" r="2.6" className="wf-iso-anchor" />
        <circle cx="278" cy="150" r="2.6" className="wf-iso-anchor" />
      </g>

      {/* LAYER 01 (Top): Peer Directors */}
      <g
        className={`wf-iso-layer ${activeIndex === 0 ? 'is-active' : 'is-dim'}`}
        onClick={() => onSelect(0)}
        filter={`url(#${uid}-shadow)`}
      >
        <path d={leftEdge(226, 74, 174, 52, 16)} className="wf-iso-edge-left" />
        <path d={rightEdge(226, 74, 174, 52, 16)} className="wf-iso-edge-right" />
        <path d={slabPath(226, 74, 174, 52)} className="wf-iso-face" />

        <line x1="140" y1="48" x2="312" y2="100" className="wf-iso-gridline" />
        <line x1="140" y1="100" x2="312" y2="48" className="wf-iso-gridline" />

        {renderChip(114, 54, 106, 35, 'var(--fam-google)', 'Gemini 4 Neon', 'Antigravity')}
        {renderChip(234, 54, 106, 35, 'var(--fam-anthropic)', 'Claude Opus 5.5', 'Claude Code')}

        <text x="20" y="136" className="wf-iso-plane-tag">01 · DIRECT (ME + LEAD)</text>
      </g>
    </svg>
  )
}

export function AgentStackDiagram({ compact = false }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const orientation = useVerticalTabOrientation()
  const uid = useId().replace(/:/g, '')
  const tabRefs = useRef([])

  const selectLayer = (index, shouldFocus = false) => {
    setActiveIndex(index)
    if (shouldFocus) tabRefs.current[index]?.focus()
  }

  return (
    <figure className={`wf-visual wf-visual-elevated ${compact ? 'wf-visual-compact' : ''}`}>
      <figcaption className="wf-visual-head">
        <span className="wf-visual-kicker">current model stack</span>
        <span className="wf-visual-hint">3 cloud families + 1 local GPU · click a plane</span>
      </figcaption>

      <div className="wf-family-legend" aria-label="Model families">
        <span className="wf-family-pill"><span className="wf-fam-dot wf-fam-google" aria-hidden="true" />Google (Neon)</span>
        <span className="wf-family-pill"><span className="wf-fam-dot wf-fam-anthropic" aria-hidden="true" />Anthropic (Opus, Fable)</span>
        <span className="wf-family-pill"><span className="wf-fam-dot wf-fam-openai" aria-hidden="true" />OpenAI (Sol, Astra, Luna)</span>
        <span className="wf-family-pill"><span className="wf-fam-dot wf-fam-local" aria-hidden="true" />Local GPU (Qwen 3.8)</span>
      </div>

      <div
        className="wf-tab-row wf-tab-row-three wf-full-tabs"
        role="tablist"
        aria-label="Agent stack layers"
        aria-orientation={orientation}
      >
        {STACK_LAYERS.map((layer, index) => (
          <button
            key={layer.id}
            ref={(el) => { tabRefs.current[index] = el }}
            type="button"
            role="tab"
            id={`${uid}-layer-${layer.id}`}
            aria-selected={activeIndex === index}
            aria-controls={`${uid}-layer-panel-${layer.id}`}
            tabIndex={activeIndex === index ? 0 : -1}
            className="wf-tab-btn"
            onClick={() => selectLayer(index)}
            onKeyDown={(e) => moveTabIndex(e, index, STACK_LAYERS.length, orientation, (next) => selectLayer(next, true))}
          >
            <span className="wf-tab-num">{layer.num} · {layer.short}</span>
            <span className="wf-tab-title">{layer.sub}</span>
          </button>
        ))}
      </div>

      <div className="wf-stack-layout">
        <div className="wf-iso-stage">
          <IsometricStackSvg activeIndex={activeIndex} onSelect={(idx) => selectLayer(idx)} uid={uid} />
        </div>

        <div className="wf-stack-inspector">
          <div className="wf-panel-stack wf-layer-panel-stack">
            {STACK_LAYERS.map((layer, index) => {
              const isActive = index === activeIndex
              return (
                <div
                  key={layer.id}
                  inert={isActive ? undefined : ''}
                  id={`${uid}-layer-panel-${layer.id}`}
                  role={isActive ? 'tabpanel' : undefined}
                  tabIndex={isActive ? 0 : undefined}
                  aria-labelledby={isActive ? `${uid}-layer-${layer.id}` : undefined}
                  aria-hidden={isActive ? undefined : 'true'}
                  data-active={isActive ? 'true' : 'false'}
                  className="wf-panel-slot wf-layer-panel"
                >
                  <p className="wf-detail-title">{layer.headline}</p>
                  <p className="wf-detail-copy">{layer.plain}</p>
                  {!compact && <p className="wf-detail-note">{layer.detail}</p>}

                  <ul className="wf-model-list" aria-label={`${layer.short} models`}>
                    {layer.models.map((m) => (
                      <li key={`${m.name}-${m.effort}`} className="wf-model-row">
                        <div className="wf-model-row-top">
                          <span className="wf-model-name-wrap">
                            <span className={`wf-fam-dot wf-fam-${m.family}`} aria-hidden="true" />
                            <span className="wf-model-name">{m.name}</span>
                            <span className="wf-model-effort">{m.effort}</span>
                          </span>
                          <span className="wf-model-runner">{m.runner}</span>
                        </div>
                        <p className="wf-model-role">{m.role}</p>
                      </li>
                    ))}
                  </ul>

                  <div className="wf-receipt-plate" role="group" aria-label={layer.receiptTitle}>
                    <div className="wf-receipt-head">
                      <span>{layer.receiptTitle}</span>
                      <span className="wf-receipt-badge">verified</span>
                    </div>
                    <dl className="wf-artifact-kv">
                      {layer.receiptRows.map((row) => (
                        <div key={row.key} className="wf-artifact-kv-row">
                          <dt>{row.key}</dt>
                          <dd>{row.val}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </figure>
  )
}

/* ==========================================================================
 * Dimensional Full Council Roundtable (5 Blind Seats + Fresh Opus Tiebreaker)
 * ========================================================================== */

function familyCssVar(family) {
  if (family === 'google') return 'var(--fam-google)'
  if (family === 'anthropic') return 'var(--fam-anthropic)'
  if (family === 'local') return 'var(--fam-local)'
  return 'var(--fam-openai)'
}

function CouncilRoundtableSvg({ activeIndex, onSelect, uid }) {
  const cx = 230
  const cy = 186

  // Radial privacy walls positioned between adjacent seats on the arc
  const wallAnglesDeg = [-150, -112, -68, -30]

  return (
    <svg
      className="wf-council-svg"
      viewBox="0 0 460 320"
      role="img"
      aria-label="Full council roundtable: five independent seats from three model families (Sol, Opus, Fable, Astra, Neon) arranged around a frozen git archive snapshot with privacy walls between seats and a fresh Opus tiebreaker off to the side."
    >
      <defs>
        <filter id={`${uid}-pedestal`} x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="8" stdDeviation="5" floodColor="#000000" floodOpacity="0.28" />
        </filter>
      </defs>

      {/* Perspective foreshortened tabletop ellipses */}
      <ellipse cx={cx} cy={cy - 10} rx="188" ry="118" className="wf-council-table-outer" />
      <ellipse cx={cx} cy={cy - 10} rx="122" ry="74" className="wf-council-table-inner" />

      {/* Dashed isolation walls between seats so they cannot see each other */}
      {wallAnglesDeg.map((deg) => {
        const rad = (deg * Math.PI) / 180
        const x1 = cx + Math.cos(rad) * 86
        const y1 = cy - 10 + Math.sin(rad) * 54
        const x2 = cx + Math.cos(rad) * 194
        const y2 = cy - 10 + Math.sin(rad) * 124
        return (
          <line
            key={deg}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            className="wf-council-wall"
          />
        )
      })}

      {/* One-way sightlines from Frozen Snapshot to each seat */}
      {COUNCIL_SEATS.map((seat, index) => {
        const active = index === activeIndex
        const color = familyCssVar(seat.family)
        return (
          <line
            key={`beam-${seat.id}`}
            x1={cx}
            y1={cy - 8}
            x2={seat.x}
            y2={seat.y}
            className={`wf-council-beam ${active ? 'is-active' : ''}`}
            style={active ? { stroke: color } : undefined}
          />
        )
      })}

      {/* Dashed tiebreaker line from center downward */}
      <line x1={cx} y1={cy + 30} x2={cx} y2="262" className="wf-council-tiebreak-line" />

      {/* 3D Stacked Frozen Snapshot pedestal in center */}
      <g filter={`url(#${uid}-pedestal)`}>
        {/* Sheet 3 (bottom layer) */}
        <path d={`M ${cx} ${cy - 10} L ${cx + 80} ${cy + 14} L ${cx} ${cy + 38} L ${cx - 80} ${cy + 14} Z`} className="wf-council-sheet wf-council-sheet-back" />
        {/* Sheet 2 (mid layer) */}
        <path d={`M ${cx} ${cy - 18} L ${cx + 80} ${cy + 6} L ${cx} ${cy + 30} L ${cx - 80} ${cy + 6} Z`} className="wf-council-sheet wf-council-sheet-mid" />
        {/* Sheet 1 (top layer) */}
        <path d={`M ${cx} ${cy - 26} L ${cx + 80} ${cy - 2} L ${cx} ${cy + 22} L ${cx - 80} ${cy - 2} Z`} className="wf-council-sheet wf-council-sheet-top" />
        <text x={cx} y={cy - 4} textAnchor="middle" className="wf-council-core-title">
          FROZEN SNAPSHOT
        </text>
        <text x={cx} y={cy + 9} textAnchor="middle" className="wf-council-core-sub">
          git archive · diff.patch
        </text>
      </g>

      {/* 5 Interactive Seat Nodes */}
      {COUNCIL_SEATS.map((seat, index) => {
        const active = index === activeIndex
        const color = familyCssVar(seat.family)
        return (
          <g
            key={seat.id}
            className={`wf-council-seat-node ${active ? 'is-active' : ''}`}
            onClick={() => onSelect(index)}
          >
            {active && (
              <rect
                x={seat.x - 46}
                y={seat.y - 24}
                width="92"
                height="48"
                className="wf-council-seat-halo"
                style={{ stroke: color }}
              />
            )}
            <rect
              x={seat.x - 42}
              y={seat.y - 20}
              width="84"
              height="40"
              className="wf-council-seat-card"
              style={{ stroke: active ? color : undefined }}
            />
            <rect
              x={seat.x - 42}
              y={seat.y - 20}
              width="84"
              height="3.5"
              style={{ fill: color }}
            />
            <text x={seat.x} y={seat.y - 2} textAnchor="middle" className="wf-council-seat-name">
              {seat.name}
            </text>
            <text x={seat.x} y={seat.y + 12} textAnchor="middle" className="wf-council-seat-lens">
              {seat.familyLabel}
            </text>
          </g>
        )
      })}

      {/* Off-arc Blind Tiebreaker badge */}
      <g className="wf-council-tiebreak">
        <rect x={cx - 98} y="262" width="196" height="40" className="wf-council-tiebreak-box" />
        <circle cx={cx - 82} cy="277" r="3.8" style={{ fill: 'var(--fam-anthropic)' }} />
        <text x={cx + 6} y="278" textAnchor="middle" className="wf-council-tiebreak-title">
          Blind tiebreaker · fresh Opus 5.5
        </text>
        <text x={cx} y="293" textAnchor="middle" className="wf-council-tiebreak-sub">
          rules only when a seat disputes my decline
        </text>
      </g>
    </svg>
  )
}

export function FullCouncilDiagram({ compact = false }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const orientation = useVerticalTabOrientation()
  const uid = useId().replace(/:/g, '')
  const tabRefs = useRef([])

  const selectSeat = (index, shouldFocus = false) => {
    setActiveIndex(index)
    if (shouldFocus) tabRefs.current[index]?.focus()
  }

  return (
    <figure className={`wf-visual wf-visual-elevated ${compact ? 'wf-visual-compact' : ''}`}>
      <figcaption className="wf-visual-head">
        <span className="wf-visual-kicker">full council · 5 seats, 3 families</span>
        <span className="wf-visual-hint">blind review · click a seat</span>
      </figcaption>

      <div
        className="wf-tab-row wf-tab-row-five wf-full-tabs"
        role="tablist"
        aria-label="Full council seats"
        aria-orientation={orientation}
      >
        {COUNCIL_SEATS.map((seat, index) => (
          <button
            key={seat.id}
            ref={(el) => { tabRefs.current[index] = el }}
            type="button"
            role="tab"
            id={`${uid}-seat-${seat.id}`}
            aria-selected={activeIndex === index}
            aria-controls={`${uid}-seat-panel-${seat.id}`}
            tabIndex={activeIndex === index ? 0 : -1}
            className="wf-tab-btn wf-seat-tab"
            onClick={() => selectSeat(index)}
            onKeyDown={(e) => moveTabIndex(e, index, COUNCIL_SEATS.length, orientation, (next) => selectSeat(next, true))}
          >
            <span className="wf-seat-tab-top">
              <span className={`wf-fam-dot wf-fam-${seat.family}`} aria-hidden="true" />
              <span className="wf-tab-title">{seat.name}</span>
            </span>
            <span className="wf-tab-num">{seat.familyLabel}</span>
          </button>
        ))}
      </div>

      <div className="wf-council-layout">
        <div className="wf-council-stage">
          <CouncilRoundtableSvg activeIndex={activeIndex} onSelect={(idx) => selectSeat(idx)} uid={uid} />
        </div>

        <div className="wf-council-inspector">
          <div className="wf-panel-stack wf-seat-panel-stack">
            {COUNCIL_SEATS.map((seat, index) => {
              const isActive = index === activeIndex
              return (
                <div
                  key={seat.id}
                  inert={isActive ? undefined : ''}
                  id={`${uid}-seat-panel-${seat.id}`}
                  role={isActive ? 'tabpanel' : undefined}
                  tabIndex={isActive ? 0 : undefined}
                  aria-labelledby={isActive ? `${uid}-seat-${seat.id}` : undefined}
                  aria-hidden={isActive ? undefined : 'true'}
                  data-active={isActive ? 'true' : 'false'}
                  className="wf-panel-slot wf-seat-panel"
                >
                  <div className="wf-seat-header">
                    <span className="wf-model-name-wrap">
                      <span className={`wf-fam-dot wf-fam-${seat.family}`} aria-hidden="true" />
                      <span className="wf-detail-title">{seat.model}</span>
                      <span className="wf-model-effort">{seat.effort}</span>
                    </span>
                    <span className="wf-seat-lens-pill">{seat.familyLabel}</span>
                  </div>

                  <p className="wf-detail-copy">{seat.whyIUseIt}</p>
                  <p className="wf-seat-catches">
                    <strong>Council prompt:</strong> {seat.briefPrompt}
                  </p>

                  <div className="wf-receipt-plate" role="group" aria-label={`Illustrative ${seat.name} JSON result`}>
                    <div className="wf-receipt-head">
                      <span>Illustrative round-1 JSON · {seat.name}</span>
                      <span className={`wf-verdict-pill ${seat.sample.verdict === 'APPROVE' ? 'is-approve' : ''}`}>
                        {seat.sample.score} · {seat.sample.verdict}
                      </span>
                    </div>
                    <dl className="wf-artifact-kv">
                      <div className="wf-artifact-kv-row">
                        <dt>risk</dt>
                        <dd>{seat.sample.topRisk}</dd>
                      </div>
                      <div className="wf-artifact-kv-row">
                        <dt>raise</dt>
                        <dd>{seat.sample.raise}</dd>
                      </div>
                      <div className="wf-artifact-kv-row">
                        <dt>proof</dt>
                        <dd>{seat.sample.receipt}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="wf-council-rules" aria-label="Council rules">
        {COUNCIL_RULES.map((rule) => (
          <div key={rule.num} className="wf-council-rule-card">
            <p className="wf-council-rule-head">
              <span className="wf-loop-step-num">{rule.num}</span>
              <span>{rule.title}</span>
            </p>
            <p className="wf-council-rule-body">{rule.body}</p>
          </div>
        ))}
      </div>
    </figure>
  )
}

/* ==========================================================================
 * Home Workbench: Switch cleanly between Current Model Stack and Full Council
 * ========================================================================== */

export function AgentWorkbench() {
  const [view, setView] = useState('stack')
  const uid = useId().replace(/:/g, '')
  const stackRef = useRef(null)
  const councilRef = useRef(null)

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault()
      const next = view === 'stack' ? 'council' : 'stack'
      setView(next)
      ;(next === 'stack' ? stackRef : councilRef).current?.focus()
    } else if (event.key === 'Home') {
      event.preventDefault()
      setView('stack')
      stackRef.current?.focus()
    } else if (event.key === 'End') {
      event.preventDefault()
      setView('council')
      councilRef.current?.focus()
    }
  }

  return (
    <div className="wf-workbench">
      <div className="wf-workbench-bar" role="tablist" aria-label="Agent workflow views">
        <button
          ref={stackRef}
          type="button"
          role="tab"
          id={`${uid}-tab-stack`}
          aria-selected={view === 'stack'}
          aria-controls={`${uid}-panel-stack`}
          tabIndex={view === 'stack' ? 0 : -1}
          className="wf-workbench-tab"
          onClick={() => setView('stack')}
          onKeyDown={handleKeyDown}
        >
          <span className="wf-workbench-tab-kicker">01 · models &amp; sandboxes</span>
          <span className="wf-workbench-tab-title">Current model stack</span>
        </button>
        <button
          ref={councilRef}
          type="button"
          role="tab"
          id={`${uid}-tab-council`}
          aria-selected={view === 'council'}
          aria-controls={`${uid}-panel-council`}
          tabIndex={view === 'council' ? 0 : -1}
          className="wf-workbench-tab"
          onClick={() => setView('council')}
          onKeyDown={handleKeyDown}
        >
          <span className="wf-workbench-tab-kicker">02 · adversarial review</span>
          <span className="wf-workbench-tab-title">Full council (5 seats)</span>
        </button>
      </div>

      <div className="wf-panel-stack">
        <div
          id={`${uid}-panel-stack`}
          role={view === 'stack' ? 'tabpanel' : undefined}
          aria-labelledby={view === 'stack' ? `${uid}-tab-stack` : undefined}
          aria-hidden={view === 'stack' ? undefined : 'true'}
          inert={view === 'stack' ? undefined : ''}
          data-active={view === 'stack' ? 'true' : 'false'}
          className="wf-panel-slot"
        >
          <AgentStackDiagram compact />
        </div>
        <div
          id={`${uid}-panel-council`}
          role={view === 'council' ? 'tabpanel' : undefined}
          aria-labelledby={view === 'council' ? `${uid}-tab-council` : undefined}
          aria-hidden={view === 'council' ? undefined : 'true'}
          inert={view === 'council' ? undefined : ''}
          data-active={view === 'council' ? 'true' : 'false'}
          className="wf-panel-slot"
        >
          <FullCouncilDiagram compact />
        </div>
      </div>
    </div>
  )
}

/* ==========================================================================
 * Real Checks, Worktrees, Tooling Hub, Finishing Ledger
 * ========================================================================== */

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
    <figure className="wf-visual wf-visual-elevated">
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
                          <span className="wf-proc-sub">Claude Code · Antigravity · Codex</span>
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
    <figure className="wf-visual wf-visual-elevated">
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
          aria-label={isolated ? 'Clean parallel workflow: main branches into isolated GPT-6.2 Sol and local Qwen 3.8 worktrees plus a read-only council or audit pass. Patches are applied and tested in the built app before merging back to main.' : undefined}
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
              <p className="wf-wt-box-title">
                <span className="wf-fam-dot wf-fam-openai" aria-hidden="true" /> wt/filter-helper
              </p>
              <p className="wf-wt-box-meta">GPT-6.2 Sol (high) · result.patch</p>
            </div>
            <div className="wf-wt-box wf-wt-box-branch">
              <p className="wf-wt-box-title">
                <span className="wf-fam-dot wf-fam-local" aria-hidden="true" /> wt/tab-shortcuts
              </p>
              <p className="wf-wt-box-meta">Qwen 3.8 27B (nous) · bwrap, no shell</p>
            </div>
            <div className="wf-wt-box wf-wt-box-branch">
              <p className="wf-wt-box-title">
                <span className="wf-fam-dot wf-fam-mixed" aria-hidden="true" /> frozen git archive
              </p>
              <p className="wf-wt-box-meta">Full council / Sol xhigh audit · read-only</p>
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
              <p className="wf-wt-box-title">Director review &amp; test</p>
              <p className="wf-wt-box-meta">git apply one patch at a time, run the built app</p>
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
          <strong>Directors + me:</strong> design decisions, short briefs, applying patches, live testing, and merging.
        </p>
        <p>
          <span className="wf-lane-swatch wf-lane-swatch-agent" aria-hidden="true" />
          <strong>Workers:</strong> scoped worktrees (GPT-6.2 Sol for hard jobs, local Qwen 3.8 for small edits) and blind read-only reviews.
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
    <figure className="wf-visual wf-visual-elevated">
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
          <span className="wf-hub-spine-title">Coding session (Mac + nous Linux GPU)</span>
          <span className="wf-hub-spine-meta">agent-run · receipts · full council</span>
        </div>
        <ol className="wf-hub-bus" aria-label="Loop stages served by tools">
          {TOOLING_STAGES.map((stage) => {
            const lit = activeStages?.includes(stage.id)
            return (
              <li key={stage.id} className={`wf-hub-bus-node ${lit ? 'is-lit' : ''}`}>
                <span className="wf-hub-bus-num">{stage.num}</span>
                <span>{stage.label}</span>
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
    <figure className="wf-visual wf-visual-elevated">
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
