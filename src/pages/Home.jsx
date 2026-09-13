import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageMeta from '../components/PageMeta'
import StarterSelectionCapture from '../components/StarterSelectionCapture'
import '../styles/home-media.css'

const Home = () => {
  return (
    <>
      <PageMeta
        title="Tucker Craig — Software Engineer"
        description="Software engineer building omalo, a pocket companion running ichr, with Pokémon Emerald and an AI handoff for gameplay goals."
        url="https://btuckerc.dev/"
        image="https://btuckerc.dev/media/omalo/share.jpg"
        imageAlt="omalo, a pocket companion running ichr, with Pokémon Emerald on omalo."
      />

      <div className="home-page tui-page-shell min-h-svh px-4 pt-16 pb-28 sm:pt-20">
        <motion.div
          initial={{ y: 6 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="mx-auto w-full max-w-5xl"
        >
          <header className="home-header home-personal-hero border border-line/70 bg-card-bg/70 backdrop-blur-xl">
            <div className="home-personal-hero-copy">
              <h1 className="home-personal-hero-title font-mono font-bold leading-tight text-fg">TUCKER CRAIG</h1>
              <p className="home-personal-hero-role font-mono text-accent">Software Engineer</p>
              <p className="home-personal-hero-lede">
                I&apos;m writing the firmware for omalo, a pocket companion running ichr.
              </p>
            </div>
            <div className="home-personal-hero-context">
              <p>
                My projects include handheld games, a movie-seat finder, playlist tools, and a shared workspace setup for macOS and Linux.
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
              <div>
                <p className="home-kicker font-mono text-xs text-accent">featured product / omalo</p>
                <h2 id="featured-project-title" className="mt-2 font-mono text-2xl font-bold text-fg sm:text-3xl">Pokémon Emerald on omalo</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base sm:leading-7">
                  I&apos;m building the device firmware and the Pokémon controls, including an AI handoff for gameplay goals.
                </p>
              </div>
              <span className="home-status font-mono text-xs text-muted"><span className="text-accent" aria-hidden="true">●</span> Prototype</span>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link to="/projects/omalo" className="tui-action tui-home-primary inline-flex min-h-11 items-center border border-accent/70 bg-card-bg px-4 py-2 font-mono text-sm text-fg">
                <span className="tui-action-content">explore omalo →</span>
              </Link>
              <Link to="/projects/s3-amoled" className="tui-link-chip">technical notes</Link>
              <Link to="/projects" className="tui-link-chip">more projects</Link>
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
              <StarterSelectionCapture className="home-media-card home-media-card-game home-game-capture" />
            </div>
          </section>

          <section className="home-supporting mt-6 grid gap-4 md:grid-cols-2" aria-label="Supporting projects">
            <article className="home-support-card border border-line/70 bg-card-bg/70 p-5 sm:p-6">
              <p className="home-kicker font-mono text-xs text-accent">center-seat</p>
              <h2 className="mt-2 font-mono text-lg font-bold text-fg">Movie-seat ranking</h2>
              <p className="mt-3 text-sm leading-6 text-muted">A movie-seat ranking project that compares seats together across showtimes.</p>
              <a href="https://github.com/btuckerc/center-seat" className="tui-link-chip mt-5 inline-flex" target="_blank" rel="noopener noreferrer">code and setup ↗</a>
            </article>
            <article className="home-support-card border border-line/70 bg-card-bg/70 p-5 sm:p-6">
              <p className="home-kicker font-mono text-xs text-accent">boilerplate</p>
              <h2 className="mt-2 font-mono text-lg font-bold text-fg">A portable workspace</h2>
              <p className="mt-3 text-sm leading-6 text-muted">My macOS and Linux workspace setup, managed with chezmoi and mise.</p>
              <a href="https://github.com/btuckerc/boilerplate" className="tui-link-chip mt-5 inline-flex" target="_blank" rel="noopener noreferrer">browse the configuration ↗</a>
            </article>
          </section>
        </motion.div>
      </div>
    </>
  )
}

export default Home
