import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageMeta from '../components/PageMeta'
import StarterSelectionCapture, { GameCapture } from '../components/StarterSelectionCapture'
import projectsData from '../../data/projects.json'
import '../styles/home-media.css'

const herdwick = projectsData.find((project) => project.id === 'herdwick')
const dictation = projectsData.find((project) => project.id === 'dictation')

const Home = () => {
  return (
    <>
      <PageMeta
        title="Tucker Craig — Software Engineer"
        description="Software engineer who likes building things that make everyday life a little easier. Right now: omalo, a pocket companion with Pokémon and an AI handoff."
        url="https://btuckerc.dev/"
        image="https://btuckerc.dev/og/home.jpg"
        imageAlt="Tucker Craig, software engineer. I like building things that make everyday life a little easier."
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
                I&apos;ve been working on a little hardware project. It involves Pokémon, AI, and a device that fits in your pocket.
              </p>
            </div>
            <div className="home-personal-hero-context">
              <p>
                I like building things that make everyday life a little easier.{' '}
                <a
                  href="https://wecanfixeverything.com"
                  className="text-accent underline underline-offset-4"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  We can fix everything
                </a>
                . I&apos;ve built an app to track my AI usage, replaced expensive voice-to-text, and brought AI agents to my phone, and I&apos;m excited to share more along the way.
              </p>
              <p className="mt-4 text-muted">
                I also sang acapella in{' '}
                <a
                  href="https://open.spotify.com/track/5CV2w2PIbKouRr2jNKjJIR"
                  className="whitespace-nowrap text-accent underline underline-offset-4"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  The Nuances
                </a>{' '}
                at Davidson.
              </p>
              <Link to="/about" className="tui-link-chip mt-5 inline-flex">more about me →</Link>
            </div>
          </header>

          <section className="home-feature mt-6 border border-line/70 bg-card-bg/80 p-5 backdrop-blur-xl sm:p-8" aria-labelledby="featured-project-title">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1 basis-80">
                <p className="home-kicker font-mono text-xs text-accent">featured product / omalo</p>
                <h2 id="featured-project-title" className="mt-2 font-mono text-2xl font-bold text-fg sm:text-3xl">Pokémon Emerald on arduino</h2>
                <p className="mt-3 text-pretty text-sm leading-6 text-muted sm:text-base sm:leading-7">
                  I&apos;m building firmware for an s3 amoled device to play Pokémon, including an AI handoff for gameplay goals.
                </p>
              </div>
              <span className="home-status font-mono text-xs text-muted"><span className="text-accent" aria-hidden="true">●</span> Prototype</span>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link to="/projects/omalo" className="tui-action tui-home-primary inline-flex min-h-11 items-center border border-accent/70 bg-card-bg px-4 py-2 font-mono text-sm text-fg">
                <span className="tui-action-content">explore omalo →</span>
              </Link>
              <Link to="/projects/s3-amoled" className="tui-link-chip">technical notes</Link>
            </div>

            <div className="home-feature-media mt-6 grid gap-4 sm:grid-cols-2">
              <figure className="home-media-card home-media-card-device">
                <p className="starter-capture-label">the device</p>
                <strong className="starter-capture-title">omalo in hand</strong>
                <div className="home-media-frame home-media-frame-device">
                  <img
                    src="/media/s3-amoled/device-in-hand-public.jpg"
                    alt="A hand holds a small rounded device running Pokémon Emerald. The screen shows a queued ‘Beat the game’ goal and asks the player to continue, then say go."
                    width="756"
                    height="1008"
                    loading="eager"
                    decoding="async"
                  />
                </div>
                <figcaption>Prototype with a gameplay goal queued.</figcaption>
              </figure>
              <StarterSelectionCapture className="home-media-card home-media-card-game home-game-capture" showToggle={false} downloadSrc={null} captureNote={null} />
            </div>
          </section>

          <section className="home-supporting home-support-media mt-6 grid grid-cols-1 gap-4 md:grid-cols-2" aria-label="More projects">
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
                <a href={herdwick.links['app store']} className="home-app-store-badge" target="_blank" rel="noopener noreferrer">
                  <img src="/media/app-store-badge.svg" alt="Download Herdwick on the App Store" width="120" height="40" />
                </a>
                <a href={herdwick.links.github} className="tui-link-chip" target="_blank" rel="noopener noreferrer">code ↗</a>
              </div>
            </article>
            <article className="home-support-card home-support-stack border border-line/70 bg-card-bg/70 p-5 sm:p-6">
              <div className="home-app-heading">
                <img src="/media/dictation/icon.png" alt="" width="256" height="256" loading="lazy" decoding="async" className="home-app-icon" />
                <div>
                  <p className="home-kicker font-mono text-xs text-accent">dictation</p>
                  <h2 className="mt-1 font-mono text-lg font-bold text-fg">Local voice to text</h2>
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
                <a href={dictation.links.download} className="tui-link-chip" target="_blank" rel="noopener noreferrer">download for mac ↗</a>
                <a href={dictation.links.github} className="tui-link-chip" target="_blank" rel="noopener noreferrer">code ↗</a>
              </div>
            </article>
          </section>

          <section className="home-supporting mt-4 grid grid-cols-1 gap-4 md:grid-cols-2" aria-label="Other projects">
            <article className="home-support-card border border-line/70 bg-card-bg/70 p-5 sm:p-6">
              <p className="home-kicker font-mono text-xs text-accent">center-seat</p>
              <h2 className="mt-2 font-mono text-lg font-bold text-fg">Movie-seat ranking</h2>
              <p className="mt-3 text-sm leading-6 text-muted">Small personal tool to find the best seat for a movie every time.</p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <a href="https://movies.angl.gg" className="tui-link-chip" target="_blank" rel="noopener noreferrer">demo ↗</a>
                <a href="https://github.com/btuckerc/center-seat" className="tui-link-chip" target="_blank" rel="noopener noreferrer">code and setup ↗</a>
              </div>
            </article>
            <article className="home-support-card border border-line/70 bg-card-bg/70 p-5 sm:p-6">
              <p className="home-kicker font-mono text-xs text-accent">boilerplate</p>
              <h2 className="mt-2 font-mono text-lg font-bold text-fg">My opinionated config setup</h2>
              <p className="mt-3 text-sm leading-6 text-muted">My macOS and Linux workspace setup, managed with chezmoi and mise.</p>
              <a href="https://github.com/btuckerc/boilerplate" className="tui-link-chip mt-5 inline-flex" target="_blank" rel="noopener noreferrer">browse the configuration ↗</a>
            </article>
          </section>

          <div className="mt-6 flex justify-center">
            <Link to="/projects" className="tui-action tui-home-primary inline-flex min-h-11 items-center border border-accent/70 bg-card-bg px-5 py-2 font-mono text-sm text-fg">
              <span className="tui-action-content">more projects →</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  )
}

export default Home
