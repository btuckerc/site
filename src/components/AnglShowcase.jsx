import '../styles/angl-showcase.css'

const FOOTPRINT_ROWS = [
  { name: 'angl browser', mb: 227, note: '−21% vs Safari', win: true },
  { name: 'Safari', mb: 287, note: null, win: false },
  { name: 'Search.app', mb: 427, note: null, win: false },
]

const MAX_MB = 427

const ARCH_STATS = [
  { value: '0', label: 'bundled engines' },
  { value: '120 Hz', label: 'ProMotion on AC' },
  { value: 'macOS 15+', label: 'signed & notarized' },
]

const CONFIG_FILES = ['theme.json', 'settings.json', 'keys.json', '<host>.css']

const BUILT_IN_ROWS = [
  { label: 'Passwords', detail: 'Bitwarden Rust SDK + Touch ID passkeys & Apple Passwords' },
  { label: 'Blocker', detail: 'AdGuard WebKit content rules + scriptlets' },
  { label: 'Per-site', detail: 'JS, dark mode, volume, noJIT & Lockdown (⇧⌘I)' },
  { label: 'Media', detail: 'Night audio compressor, instant fullscreen & YouTube stills' },
]

function pct(value, max) {
  return Math.max(8, Math.min(100, Math.round((value / max) * 100)))
}

export default function AnglShowcase() {
  return (
    <figure className="angl-showcase">
      <figcaption className="sr-only">
        angl browser memory footprint (227 MB vs Safari 287 MB and Search.app 427 MB on Wikipedia), shared WebKit and ephemeral filter-compiler architecture, no-URL-bar tree-tab window layout, and built-in zero-extension capabilities.
      </figcaption>

      <div className="angl-grid">
        {/* 1. Measured memory graph + evergreen lightweight facts */}
        <div className="angl-panel">
          <div className="angl-panel-head">
            <span className="angl-kicker">memory on wikipedia</span>
            <span className="angl-meta">app + WebKit processes</span>
          </div>

          <div className="angl-bars" role="group" aria-label="Memory footprint on en.wikipedia.org/wiki/WebKit">
            {FOOTPRINT_ROWS.map((row) => (
              <div key={row.name} className="angl-bar-row">
                <div className="angl-bar-label-line">
                  <span className={row.win ? 'angl-bar-name angl-bar-name-win' : 'angl-bar-name'}>
                    {row.name}
                  </span>
                  <span className={row.win ? 'angl-bar-val angl-bar-val-win' : 'angl-bar-val'}>
                    {row.mb} MB
                    {row.note && <span className="angl-bar-delta"> ({row.note})</span>}
                  </span>
                </div>
                <div className="angl-bar-track" aria-hidden="true">
                  <div
                    className={row.win ? 'angl-bar-fill angl-bar-fill-win' : 'angl-bar-fill'}
                    style={{ width: `${pct(row.mb, MAX_MB)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <dl className="angl-stats">
            {ARCH_STATS.map((stat) => (
              <div key={stat.label} className="angl-stat">
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* 2. Why RAM stays low: shared OS WebKit + ephemeral angl --lists helper */}
        <div className="angl-panel">
          <div className="angl-panel-head">
            <span className="angl-kicker">why it stays light</span>
            <span className="angl-meta">no Electron · no bundled engine</span>
          </div>

          <div className="angl-arch" role="group" aria-label="angl browser process architecture">
            <div className="angl-arch-box angl-arch-main">
              <div className="angl-arch-box-top">
                <span className="angl-arch-tag">persistent browser</span>
                <span className="angl-arch-size">few MB shell</span>
              </div>
              <p className="angl-arch-title">Swift 6 / AppKit shell</p>
              <div className="angl-arch-parts">
                <span>System WKWebView (shared w/ macOS)</span>
                <span>In-process Rust Bitwarden SDK</span>
              </div>
            </div>

            <div className="angl-arch-stem" aria-hidden="true">
              <span className="angl-arch-arrow" />
              <span className="angl-arch-stem-label">spawns angl --lists on list updates</span>
            </div>

            <div className="angl-arch-box angl-arch-helper">
              <div className="angl-arch-box-top">
                <span className="angl-arch-tag">short-lived child process</span>
                <span className="angl-arch-size">exits &amp; frees RAM</span>
              </div>
              <p className="angl-arch-title">AdGuard rule compiler</p>
              <p className="angl-arch-desc">
                Compiles filter lists into WebKit content rules out of process so compile spikes never stay in browser memory.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Distinctive UI wireframe: no URL bar, Spaces + tree tabs, floating palette */}
        <div className="angl-panel">
          <div className="angl-panel-head">
            <span className="angl-kicker">distinct layout</span>
            <span className="angl-meta">no URL bar by default</span>
          </div>

          <div className="angl-wireframe" role="group" aria-label="Schematic of angl window: sidebar with Spaces and tree tabs, borderless viewport with floating command palette">
            <div className="angl-wf-sidebar">
              <div className="angl-wf-spaces">
                <span className="angl-wf-space angl-wf-space-active">1</span>
                <span className="angl-wf-space">2</span>
                <span className="angl-wf-space-note">isolated cookies &amp; proxy</span>
              </div>
              <ul className="angl-wf-tree">
                <li className="angl-wf-tab angl-wf-tab-active">WebKit</li>
                <li className="angl-wf-tab angl-wf-tab-child">Content Rules</li>
                <li className="angl-wf-tab angl-wf-tab-child">WKWebView</li>
                <li className="angl-wf-tab">Release notes</li>
              </ul>
            </div>

            <div className="angl-wf-viewport">
              <span className="angl-wf-nourl">full-height page · no URL bar</span>
              <div className="angl-wf-palette">
                <div className="angl-wf-palette-input">
                  <span className="angl-wf-prompt" aria-hidden="true">&gt;</span>
                  <span>⌘K palette / ⌘T tabs</span>
                </div>
                <ul className="angl-wf-cmds">
                  <li><span>&gt; dark force</span><span>site</span></li>
                  <li><span>&gt; js off</span><span>site</span></li>
                  <li><span>&gt; container work</span><span>space</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Zero extensions + plain-file live-reloaded config */}
        <div className="angl-panel">
          <div className="angl-panel-head">
            <span className="angl-kicker">built in · zero extensions</span>
            <span className="angl-meta">live-reloaded config</span>
          </div>

          <div className="angl-config-strip">
            <span className="angl-config-path">~/.config/angl/</span>
            <div className="angl-config-files">
              {CONFIG_FILES.map((file) => (
                <span key={file} className="angl-config-chip">{file}</span>
              ))}
            </div>
          </div>

          <dl className="angl-builtins">
            {BUILT_IN_ROWS.map((row) => (
              <div key={row.label} className="angl-builtin-row">
                <dt>{row.label}</dt>
                <dd>{row.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </figure>
  )
}
