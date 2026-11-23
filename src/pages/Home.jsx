import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta'
import AnglShowcase from '../components/AnglShowcase'
import { GameCapture } from '../components/StarterSelectionCapture'
import { AgentWorkbench } from '../components/WorkflowVisuals'
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

      <div className="home-page tui-page-shell min-h-svh">
        <div className="tui-rail tui-enter">
          <header className="home-masthead">
            <p className="home-masthead-role">Software Engineer</p>

            <h1 className="home-masthead-title font-mono font-bold text-fg">
              <span className="home-masthead-word">TUCKER</span>{' '}
              <span className="home-masthead-word">CRAIG</span>
            </h1>

            <p className="home-masthead-lede">
              <span className="home-masthead-line">If something I use every day bugs me,</span>{' '}
              <span className="home-masthead-line">I&apos;ve started putting my free time into fixing it.</span>
            </p>

            <p className="home-masthead-note">
              Lately that&apos;s meant a Mac browser, a Windows streaming app, and an iPhone app for my coding agents. I like Omarchy&apos;s idea that{' '}
              <a
                href="https://wecanfixeverything.com"
                className="text-accent underline underline-offset-4"
                target="_blank"
                rel="noopener noreferrer"
                aria-describedby="new-tab-note"
              >
                we can fix everything
              </a>
              . Everything is solvable. All it takes right now is someone pointing their tokens in the right place. The tools below are all things I use myself.
            </p>

            <div className="home-masthead-foot">
              <p className="home-masthead-aside">
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
              <Link to="/about" className="tui-link-chip">more about me</Link>
            </div>
          </header>

          <section className="home-feature mt-7 p-5 sm:p-7" aria-labelledby="workflow-title">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1 basis-80">
                <p className="home-kicker">how i build</p>
                <h2 id="workflow-title" className="mt-2 font-mono text-2xl font-bold text-fg sm:text-3xl leading-tight">
                  How I use coding agents
                </h2>
                <p className="mt-2.5 max-w-3xl text-pretty text-sm leading-6 text-muted sm:text-base sm:leading-7">
                  Instead of asking one chat window to do everything, I split the work across models. Gemini 4 Neon or Claude Opus 5.5 directs, GPT-6.2 Sol and a local Qwen 3.8 GPU worker write patches in isolated copies of the repo, and on big changes five models from three families review the same frozen snapshot blind before I run the built app myself.
                </p>
              </div>
            </div>

            <AgentWorkbench />

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link to="/workflow" className="tui-action tui-home-primary inline-flex items-center px-4 py-2 font-mono text-sm">
                read the full workflow
              </Link>
              <Link to="/projects/s3-amoled" className="tui-link-chip">omalo agent notes</Link>
            </div>
          </section>

          <section className="home-support-card mt-6 p-5 sm:p-7" aria-labelledby="angl-title">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="home-app-heading min-w-0 flex-1 basis-72">
                <img src="/media/angl-browser/icon.png" alt="" width="128" height="128" loading="lazy" decoding="async" className="home-app-icon home-app-icon-large" />
                <div>
                  <p className="home-kicker">angl browser</p>
                  <h2 id="angl-title" className="mt-1 font-mono text-xl font-bold text-fg sm:text-2xl leading-tight">The lightest macOS browser that still has features</h2>
                </div>
              </div>
              <span className="home-status font-mono text-xs text-muted"><span className="text-accent" aria-hidden="true">●</span> macOS · WebKit</span>
            </div>
            <p className="mt-3 text-pretty text-sm leading-6 text-muted sm:text-base sm:leading-7">{angl.blurb}</p>
            <AnglShowcase />
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a href={angl.links.download} className="tui-action tui-home-primary inline-flex items-center px-4 py-2 font-mono text-sm" target="_blank" rel="noopener noreferrer" aria-describedby="new-tab-note">
                download for mac
              </a>
              <a href={angl.links.github} className="tui-link-chip" target="_blank" rel="noopener noreferrer" aria-describedby="new-tab-note">code</a>
            </div>
          </section>

          <section className="home-support-card mt-6 p-5 sm:p-7" aria-labelledby="winstream-title">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1 basis-72">
                <p className="home-kicker">winstream · rust · windows</p>
                <h2 id="winstream-title" className="mt-1 font-mono text-xl font-bold text-fg sm:text-2xl leading-tight">
                  A lighter Windows streaming app
                </h2>
              </div>
              <span className="home-status font-mono text-xs text-muted"><span className="text-accent" aria-hidden="true">●</span> Local build</span>
            </div>
            <p className="mt-3 text-pretty text-sm leading-6 text-muted sm:text-base sm:leading-7">
              {winstream.blurb} Built directly on Windows Graphics Capture, Direct3D 11, and NVIDIA NVENC, with per-app audio, noise suppression, auto-leveling, and its own FLV muxer.
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
                    <td>Private RAM (active / idle)</td>
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
            <p className="mt-3 text-sm leading-6 text-muted">
              Tested on Windows 11 (Ryzen 9 9950X3D, RTX 4090) at 6000 kb/s H.264 across three 60-second synthetic game runs with camera, chat overlay, and audio. Average FPS stays within 1% of OBS across every load, and A/V sync measured -7.9 ms median (within one 60 fps frame, zero discontinuities). Under a 599 Hz cap, 0.1% lows still trail OBS&apos;s DirectX game-capture hook because of Windows capture overhead (465-469 fps after idle-wakeup fixes vs. OBS&apos;s 563-570 fps). Not on GitHub yet.
            </p>
          </section>

          <section className="home-supporting home-support-media mt-6 grid grid-cols-1 gap-6 md:grid-cols-2" aria-label="AI workflow tools">
            <article className="home-support-card home-support-stack p-5 sm:p-7">
              <div className="home-app-heading">
                <img src="/media/herdwick/icon.png" alt="" width="256" height="256" loading="lazy" decoding="async" className="home-app-icon" />
                <div>
                  <p className="home-kicker">herdwick</p>
                  <h2 id="herdwick-title" className="mt-1 font-mono text-lg font-bold text-fg leading-snug">Coding agents on your phone</h2>
                </div>
              </div>
              <p className="text-sm leading-6 text-muted">{herdwick.blurb}</p>
              <div className="home-app-screens home-screens-matched" tabIndex={0} role="region" aria-label="Herdwick screenshots, scroll sideways for more">
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
            <article className="home-support-card home-support-stack p-5 sm:p-7">
              <div className="home-app-heading">
                <img src="/media/dictation/icon.png" alt="" width="256" height="256" loading="lazy" decoding="async" className="home-app-icon" />
                <div>
                  <p className="home-kicker">dictation</p>
                  <h2 className="mt-1 font-mono text-lg font-bold text-fg leading-snug">Local voice-to-text</h2>
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

          <section className="home-supporting home-support-media mt-6 grid grid-cols-1 gap-6 md:grid-cols-2" aria-label="Telemetry and hardware projects">
            <article className="home-support-card home-support-stack p-5 sm:p-7">
              <div>
                <p className="home-kicker">pace-bar</p>
                <h2 className="mt-1 font-mono text-lg font-bold text-fg leading-snug">AI quotas and local inference</h2>
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
            <article className="home-support-card home-support-stack p-5 sm:p-7">
              <div>
                <p className="home-kicker">omalo · prototype</p>
                <h2 className="mt-1 font-mono text-lg font-bold text-fg leading-snug">Pokémon Emerald on Arduino</h2>
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

          <section className="home-support-card home-app-feature mt-6 p-5 sm:p-7" aria-labelledby="inkjoin-title">
            <div className="home-app-feature-copy">
              <div className="home-app-heading">
                <img src="/media/inkjoin/icon.png" alt="" width="256" height="256" loading="lazy" decoding="async" className="home-app-icon home-app-icon-large" />
                <div>
                  <p className="home-kicker">inkjoin</p>
                  <h2 id="inkjoin-title" className="mt-1 font-mono text-xl font-bold text-fg sm:text-2xl leading-tight">Logic puzzles!</h2>
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

          <section className="home-supporting home-support-text mt-6 grid grid-cols-1 gap-6 md:grid-cols-2" aria-label="Other projects">
            <article className="home-support-card home-support-stack p-5 sm:p-7">
              <div>
                <p className="home-kicker">center-seat</p>
                <h2 className="mt-1 font-mono text-lg font-bold text-fg leading-snug">Movie-seat ranking</h2>
              </div>
              <p className="text-sm leading-6 text-muted">Small personal tool to find the best seat for a movie every time.</p>
              <div className="flex flex-wrap items-center gap-3">
                <a href="https://movies.angl.gg" className="tui-link-chip" target="_blank" rel="noopener noreferrer" aria-describedby="new-tab-note">demo</a>
                <a href="https://github.com/btuckerc/center-seat" className="tui-link-chip" target="_blank" rel="noopener noreferrer" aria-describedby="new-tab-note">code and setup</a>
              </div>
            </article>
            <article className="home-support-card home-support-stack p-5 sm:p-7">
              <div>
                <p className="home-kicker">boilerplate</p>
                <h2 className="mt-1 font-mono text-lg font-bold text-fg leading-snug">My opinionated config setup</h2>
              </div>
              <p className="text-sm leading-6 text-muted">My macOS and Linux workspace setup, managed with chezmoi and mise.</p>
              <div className="flex flex-wrap items-center gap-3">
                <a href="https://github.com/btuckerc/boilerplate" className="tui-link-chip" target="_blank" rel="noopener noreferrer" aria-describedby="new-tab-note">browse config</a>
              </div>
            </article>
          </section>

          <div className="mt-8 flex justify-center">
            <Link to="/projects" className="tui-action tui-home-primary inline-flex items-center px-5 py-2 font-mono text-sm">
              more projects
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
