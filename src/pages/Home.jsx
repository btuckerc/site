import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageMeta from '../components/PageMeta'
import { GameCapture } from '../components/StarterSelectionCapture'
import projectsData from '../../data/projects.json'
import '../styles/home-media.css'

const angl = projectsData.find((project) => project.id === 'angl-browser')
const winstream = projectsData.find((project) => project.id === 'winstream')
const paceBar = projectsData.find((project) => project.id === 'pace-bar')
const inkjoin = projectsData.find((project) => project.id === 'inkjoin')
const herdwick = projectsData.find((project) => project.id === 'herdwick')
const dictation = projectsData.find((project) => project.id === 'dictation')

const Home = () => {
  return (
    <>
      <PageMeta
        title="Tucker Craig - Software Engineer"
        description="Software engineer building my own tools with coding agents across Mac, Windows, iOS, and hardware: angl browser, winstream, Herdwick, Pace Bar, Dictation, Inkjoin, and omalo."
        url="https://btuckerc.dev/"
        image="https://btuckerc.dev/og/home.jpg"
        imageAlt="Tucker Craig, software engineer. Building my own tools with coding agents."
      />

      <div className="home-page tui-page-shell min-h-svh px-4 pt-16 pb-28 sm:pt-20">
        <motion.div
          initial={{ y: 6 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="mx-auto w-full max-w-5xl"
        >
          <header className="home-header home-personal-hero border border-line/70 bg-card-bg/70">
            <div className="home-personal-hero-copy">
              <h1 className="home-personal-hero-title font-mono font-bold leading-tight text-fg">TUCKER CRAIG</h1>
              <p className="home-personal-hero-role font-mono text-accent">Software Engineer</p>
              <p className="home-personal-hero-lede">
                If something I use every day bugs me, I&apos;d rather build my own. Lately that&apos;s meant a Mac browser, a Windows streaming engine, and an iPhone app for my coding agents.
              </p>
            </div>
            <div className="home-personal-hero-context">
              <p>
                I borrow a lot from Omarchy&apos;s idea that{' '}
                <a
                  href="https://wecanfixeverything.com"
                  className="text-accent underline underline-offset-4"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-describedby="new-tab-note"
                >
                  we can fix everything
                </a>
                . Coding agents make that practical if you treat them like an engineering harness and actually test what you build. Everything below is something I use myself.
              </p>
              <p className="mt-4 text-muted">
                I also sang a cappella in{' '}
                <a
                  href="https://open.spotify.com/track/5CV2w2PIbKouRr2jNKjJIR"
                  className="whitespace-nowrap text-accent underline underline-offset-4"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-describedby="new-tab-note"
                >
                  The Nuances
                </a>{' '}
                at Davidson.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link to="/workflow" className="tui-link-chip">how i build</Link>
                <Link to="/about" className="tui-link-chip">more about me</Link>
              </div>
            </div>
          </header>

          <section className="home-feature mt-6 border border-line/70 bg-card-bg/80 p-5 backdrop-blur-xl sm:p-8" aria-labelledby="workflow-title">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1 basis-80">
                <p className="home-kicker font-mono text-xs text-accent">workflow / how i build with ai</p>
                <h2 id="workflow-title" className="mt-2 font-mono text-2xl font-bold text-fg sm:text-3xl">
                  Treat coding agents like a harness, not a slot machine
                </h2>
                <p className="mt-3 text-pretty text-sm leading-6 text-muted sm:text-base sm:leading-7">
                  Generating code is the easy part now. The real work is scoping the problem, keeping clean boundaries, and verifying on the real target so you don&apos;t ship slop.
                </p>
              </div>
            </div>

            <div className="home-workflow-pillars mt-6">
              <div className="home-workflow-pillar">
                <p className="home-workflow-pillar-kicker">01 / scope</p>
                <h3>Tight briefs, isolated worktrees</h3>
                <p>Architecture, tradeoffs, and final integration stay in my hands. Scoped tasks run in isolated worktrees with explicit invariants.</p>
              </div>
              <div className="home-workflow-pillar">
                <p className="home-workflow-pillar-kicker">02 / verify</p>
                <h3>Real target, not &quot;it compiles&quot;</h3>
                <p>Inspired by engineers like @poteto: run the signed Mac app, tap through iOS, measure real RAM, or diff game state instead of guessing.</p>
              </div>
              <div className="home-workflow-pillar">
                <p className="home-workflow-pillar-kicker">03 / harness</p>
                <h3>Build around the friction</h3>
                <p>When the workflow itself has paper cuts, I build the tool: a mobile agent inbox, quota telemetry, local voice-to-text, even my own browser.</p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link to="/workflow" className="tui-action tui-home-primary inline-flex min-h-11 items-center border border-accent/70 bg-card-bg px-4 py-2 font-mono text-sm text-fg">
                <span className="tui-action-content">read how i build</span>
              </Link>
              <Link to="/projects/s3-amoled" className="tui-link-chip">omalo agent notes</Link>
            </div>
          </section>

          <section className="home-support-card mt-6 border border-line/70 bg-card-bg/75 p-5 sm:p-7" aria-labelledby="angl-title">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="home-app-heading min-w-0 flex-1 basis-72">
                <img src="/media/angl-browser/icon.png" alt="" width="128" height="128" loading="lazy" decoding="async" className="home-app-icon home-app-icon-large" />
                <div>
                  <p className="home-kicker font-mono text-xs text-accent">angl browser</p>
                  <h2 id="angl-title" className="mt-1 font-mono text-xl font-bold text-fg sm:text-2xl">The lightest macOS browser that still has features</h2>
                </div>
              </div>
              <span className="home-status font-mono text-xs text-muted"><span className="text-accent" aria-hidden="true">●</span> macOS · WebKit</span>
            </div>
            <p className="mt-3 text-pretty text-sm leading-6 text-muted sm:text-base sm:leading-7">{angl.blurb}</p>
            <figure className="mt-5">
              <div className="home-desktop-frame">
                <img
                  src="/media/angl-browser/angl.webp"
                  alt="angl browser showing Wikipedia's WebKit article with a tree of child tabs in the sidebar and no URL bar."
                  width="1600"
                  height="1012"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption className="mt-2 text-xs leading-6 text-muted sm:text-sm">
                Swift 6 and AppKit on the system WebKit, with a Rust Bitwarden bridge and 227 MB total footprint on Wikipedia (vs. Safari&apos;s 287 MB).
              </figcaption>
            </figure>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a href={angl.links.download} className="tui-action tui-home-primary inline-flex min-h-11 items-center border border-accent/70 bg-card-bg px-4 py-2 font-mono text-sm text-fg" target="_blank" rel="noopener noreferrer" aria-describedby="new-tab-note">
                <span className="tui-action-content">download for mac</span>
              </a>
              <a href={angl.links.github} className="tui-link-chip" target="_blank" rel="noopener noreferrer" aria-describedby="new-tab-note">code</a>
            </div>
          </section>

          <section className="home-support-card mt-6 border border-line/70 bg-card-bg/75 p-5 sm:p-7" aria-labelledby="winstream-title">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1 basis-72">
                <p className="home-kicker font-mono text-xs text-accent">winstream · rust · d3d11 · nvenc</p>
                <h2 id="winstream-title" className="mt-1 font-mono text-xl font-bold text-fg sm:text-2xl">
                  A lean Windows streaming studio
                </h2>
              </div>
              <span className="home-status font-mono text-xs text-muted"><span className="text-accent" aria-hidden="true">●</span> Local build</span>
            </div>
            <p className="mt-3 text-pretty text-sm leading-6 text-muted sm:text-base sm:leading-7">
              {winstream.blurb} Built directly on Windows Graphics Capture, Direct3D 11 compositing, NVENC 13.0 bindings, WASAPI per-app audio with RNNoise and -14 LUFS loudness leveling, and a std-only FLV muxer.
            </p>
            <div className="home-bench-wrap mt-5" role="region" aria-label="winstream vs OBS 32.0.2 benchmarks">
              <table className="home-bench-table">
                <thead>
                  <tr>
                    <th scope="col">Metric (1080p60 NVENC + overlays)</th>
                    <th scope="col">winstream</th>
                    <th scope="col">OBS 32.0.2</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Private RAM (active / dormant)</td>
                    <td className="home-bench-win">262 MB / 67 MB</td>
                    <td>788-931 MB</td>
                  </tr>
                  <tr>
                    <td>VRAM footprint</td>
                    <td className="home-bench-win">150 MB</td>
                    <td>233-259 MB</td>
                  </tr>
                  <tr>
                    <td>GPU-bound CPU overhead (1 core)</td>
                    <td className="home-bench-win">+13%</td>
                    <td>+37% (+25% no overlays)</td>
                  </tr>
                  <tr>
                    <td>GPU-bound 1% / 0.1% low FPS</td>
                    <td className="home-bench-win">205 / 201 fps</td>
                    <td>201 / 185 fps</td>
                  </tr>
                  <tr>
                    <td>Uncapped 1% / 0.1% low FPS</td>
                    <td className="home-bench-win">802 / 748 fps</td>
                    <td>680 / 621 fps</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs leading-6 text-muted sm:text-sm">
              Measured on Windows 11 (Ryzen 9 9950X3D, RTX 4090) at 6000 kb/s H.264 P5 HQ across 3 x 60s synthetic game runs with camera, chat overlay, and 160 kb/s AAC audio. Average FPS stays within 1% of OBS across all loads, and A/V sync measured -7.9 ms median (within one 60 fps frame, zero discontinuities). Under a 599 Hz cap, 0.1% lows still trail OBS&apos;s DirectX game-capture hook due to WGC composition overhead (465-469 fps after idle-wakeup fixes vs. OBS&apos;s 563-570 fps). Not public on GitHub yet.
            </p>
          </section>

          <section className="home-supporting home-support-media mt-6 grid grid-cols-1 gap-4 md:grid-cols-2" aria-label="AI workflow tools">
            <article className="home-support-card home-support-stack border border-line/70 bg-card-bg/70 p-5 sm:p-6">
              <div className="home-app-heading">
                <img src="/media/herdwick/icon.png" alt="" width="256" height="256" loading="lazy" decoding="async" className="home-app-icon" />
                <div>
                  <p className="home-kicker font-mono text-xs text-accent">herdwick</p>
                  <h2 className="mt-1 font-mono text-lg font-bold text-fg">Coding agents on your phone</h2>
                </div>
              </div>
              <p className="text-sm leading-6 text-muted">{herdwick.blurb}</p>
              <div className="home-app-screens" tabIndex={0} role="region" aria-label="Herdwick screenshots, scroll sideways for more">
                <img
                  src="/media/herdwick/screenshots-iphone.webp"
                  alt="Seven Herdwick iPhone screenshots: the agent inbox, answering an agent, reading what it did, reviewing diffs, what's new since last time, connecting machines over SSH or Tailscale, and the live terminal."
                  width="2400"
                  height="702"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <a href={herdwick.links['app store']} className="home-app-store-badge" target="_blank" rel="noopener noreferrer" aria-describedby="new-tab-note">
                  <img src="/media/app-store-badge.svg" alt="Download Herdwick on the App Store" width="120" height="40" />
                </a>
                <a href={herdwick.links.github} className="tui-link-chip" target="_blank" rel="noopener noreferrer" aria-describedby="new-tab-note">code</a>
              </div>
            </article>
            <article className="home-support-card home-support-stack border border-line/70 bg-card-bg/70 p-5 sm:p-6">
              <div className="home-app-heading">
                <img src="/media/dictation/icon.png" alt="" width="256" height="256" loading="lazy" decoding="async" className="home-app-icon" />
                <div>
                  <p className="home-kicker font-mono text-xs text-accent">dictation</p>
                  <h2 className="mt-1 font-mono text-lg font-bold text-fg">Local voice-to-text</h2>
                </div>
              </div>
              <p className="text-sm leading-6 text-muted">{dictation.blurb}</p>
              <GameCapture
                className="home-support-capture"
                src={dictation.media.video}
                poster={dictation.media.poster}
                downloadSrc={null}
                width={dictation.media.width}
                height={dictation.media.height}
                title="Dictation overlay"
                alt={dictation.media.alt}
                caption={dictation.media.caption}
                captureNote={null}
                showToggle={false}
              />
              <div className="flex flex-wrap items-center gap-3">
                <a href={dictation.links.download} className="tui-link-chip" target="_blank" rel="noopener noreferrer" aria-describedby="new-tab-note">download for mac</a>
                <a href={dictation.links.github} className="tui-link-chip" target="_blank" rel="noopener noreferrer" aria-describedby="new-tab-note">code</a>
              </div>
            </article>
          </section>

          <section className="home-supporting home-support-media mt-4 grid grid-cols-1 gap-4 md:grid-cols-2" aria-label="Telemetry and hardware projects">
            <article className="home-support-card home-support-stack border border-line/70 bg-card-bg/70 p-5 sm:p-6">
              <div>
                <p className="home-kicker font-mono text-xs text-accent">pace-bar</p>
                <h2 className="mt-1 font-mono text-lg font-bold text-fg">AI quotas and local inference</h2>
              </div>
              <p className="text-sm leading-6 text-muted">{paceBar.blurb}</p>
              <div className="home-portrait-frame">
                <img
                  src="/media/pace-bar/pace-bar.png"
                  alt="Pace Bar menu bar popover showing sample Codex and Claude quota rings, local llama-server token throughput and GPU usage, and OpenRouter credit balance."
                  width="780"
                  height="1118"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <a href={paceBar.links.download} className="tui-link-chip" target="_blank" rel="noopener noreferrer" aria-describedby="new-tab-note">download for mac</a>
                <a href={paceBar.links.github} className="tui-link-chip" target="_blank" rel="noopener noreferrer" aria-describedby="new-tab-note">code</a>
              </div>
            </article>
            <article className="home-support-card home-support-stack border border-line/70 bg-card-bg/70 p-5 sm:p-6">
              <div>
                <p className="home-kicker font-mono text-xs text-accent">omalo · prototype</p>
                <h2 className="mt-1 font-mono text-lg font-bold text-fg">Pokémon Emerald on Arduino</h2>
              </div>
              <p className="text-sm leading-6 text-muted">
                Firmware for a small ESP32-S3 handheld that runs Pokémon Emerald, with an AI you can hand goals off to.
              </p>
              <div className="home-portrait-frame">
                <img
                  src="/media/s3-amoled/device-in-hand-public.jpg"
                  alt="A hand holds a small rounded device running Pokémon Emerald. The screen shows a queued 'Beat the game' goal and asks the player to continue, then say go."
                  width="756"
                  height="1008"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link to="/projects/omalo" className="tui-link-chip">explore omalo</Link>
                <Link to="/projects/s3-amoled" className="tui-link-chip">technical notes</Link>
              </div>
            </article>
          </section>

          <section className="home-support-card home-app-feature mt-4 border border-line/70 bg-card-bg/75 p-5 sm:p-7" aria-labelledby="inkjoin-title">
            <div className="home-app-feature-copy">
              <div className="home-app-heading">
                <img src="/media/inkjoin/icon.png" alt="" width="256" height="256" loading="lazy" decoding="async" className="home-app-icon home-app-icon-large" />
                <div>
                  <p className="home-kicker font-mono text-xs text-accent">inkjoin</p>
                  <h2 id="inkjoin-title" className="mt-1 font-mono text-xl font-bold text-fg sm:text-2xl">Logic puzzles!</h2>
                </div>
              </div>
              <p className="text-pretty text-sm leading-6 text-muted sm:text-base sm:leading-7">{inkjoin.blurb}</p>
            </div>
            <div className="home-app-feature-media">
              <GameCapture
                className="home-support-capture home-phone-capture"
                src={inkjoin.media.video}
                poster={inkjoin.media.poster}
                downloadSrc={null}
                width={inkjoin.media.width}
                height={inkjoin.media.height}
                title="Solving a puzzle"
                alt={inkjoin.media.alt}
                caption="Solving with a hint"
                captureNote={null}
                showToggle={false}
              />
              <GameCapture
                className="home-support-capture home-phone-capture"
                src="/media/inkjoin/dark.mp4"
                poster="/media/inkjoin/dark-poster.webp"
                downloadSrc={null}
                width={540}
                height={1174}
                title="Dark mode"
                alt="Inkjoin in dark mode, from the home screen to a 6x6 puzzle. Squares are filled in to make one connected shape, then a red stamp is added."
                caption="Dark mode"
                captureNote={null}
                showToggle={false}
              />
            </div>
            <div className="home-app-screens home-app-feature-screens" tabIndex={0} role="region" aria-label="Inkjoin screenshots, scroll sideways for more">
              <img
                src="/media/inkjoin/screenshots-iphone.webp"
                alt="Seven Inkjoin iPhone screenshots: a partly filled puzzle, the home screen with today's puzzle, the chapter list, drawings from one chapter, the Drawings collection, practice difficulty levels, and a puzzle in dark mode."
                width="2369"
                height="702"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="home-app-feature-actions flex flex-wrap items-center gap-3">
              <a href={inkjoin.links['app store']} className="home-app-store-badge" target="_blank" rel="noopener noreferrer" aria-describedby="new-tab-note">
                <img src="/media/app-store-badge.svg" alt="Download Inkjoin on the App Store" width="120" height="40" />
              </a>
              <a href={inkjoin.links.github} className="tui-link-chip" target="_blank" rel="noopener noreferrer" aria-describedby="new-tab-note">code</a>
            </div>
          </section>

          <section className="home-supporting mt-4 grid grid-cols-1 gap-4 md:grid-cols-2" aria-label="Other projects">
            <article className="home-support-card border border-line/70 bg-card-bg/70 p-5 sm:p-6">
              <p className="home-kicker font-mono text-xs text-accent">center-seat</p>
              <h2 className="mt-2 font-mono text-lg font-bold text-fg">Movie-seat ranking</h2>
              <p className="mt-3 text-sm leading-6 text-muted">Small personal tool to find the best seat for a movie every time.</p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <a href="https://movies.angl.gg" className="tui-link-chip" target="_blank" rel="noopener noreferrer" aria-describedby="new-tab-note">demo</a>
                <a href="https://github.com/btuckerc/center-seat" className="tui-link-chip" target="_blank" rel="noopener noreferrer" aria-describedby="new-tab-note">code and setup</a>
              </div>
            </article>
            <article className="home-support-card border border-line/70 bg-card-bg/70 p-5 sm:p-6">
              <p className="home-kicker font-mono text-xs text-accent">boilerplate</p>
              <h2 className="mt-2 font-mono text-lg font-bold text-fg">My opinionated config setup</h2>
              <p className="mt-3 text-sm leading-6 text-muted">My macOS and Linux workspace setup, managed with chezmoi and mise.</p>
              <a href="https://github.com/btuckerc/boilerplate" className="tui-link-chip mt-5 inline-flex" target="_blank" rel="noopener noreferrer" aria-describedby="new-tab-note">browse config</a>
            </article>
          </section>

          <div className="mt-6 flex justify-center">
            <Link to="/projects" className="tui-action tui-home-primary inline-flex min-h-11 items-center border border-accent/70 bg-card-bg px-5 py-2 font-mono text-sm text-fg">
              <span className="tui-action-content">more projects</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  )
}

export default Home
