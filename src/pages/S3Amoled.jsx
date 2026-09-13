import GrainCapture from '../components/GrainCapture'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageMeta from '../components/PageMeta'
import StarterSelectionCapture from '../components/StarterSelectionCapture'
import '../styles/technical-readability.css'

const shareImage = 'https://btuckerc.dev/media/s3-amoled/share.jpg'
const pageUrl = 'https://btuckerc.dev/projects/s3-amoled'

const S3Amoled = () => {
  return (
    <>
      <PageMeta
        title="s3-amoled — Pokémon, an AI handoff, and Grain"
        description="Technical notes for omalo, a pocket companion running ichr, with Pokémon gameplay, an AI handoff, and Grain."
        url={pageUrl}
        type="article"
        image={shareImage}
      />

      <div className="case-study-page technical-readability-page tui-page-shell min-h-svh px-4 pb-28">
        <div className="mx-auto max-w-5xl">
          <div className="case-study-header mb-8">
            <div className="min-w-0 md:text-center">
              <p className="case-study-eyebrow">technical notes / s3-amoled</p>
              <h1 className="tui-page-title mt-2 max-w-3xl text-2xl font-bold leading-tight text-fg font-mono md:mx-auto md:text-4xl">
                Pokémon, an AI handoff, and Grain
              </h1>
              <p className="case-study-deck mx-0 mt-4 max-w-3xl text-sm leading-7 text-muted md:mx-auto md:text-base">
                Custom firmware for omalo, a pocket companion running ichr. Pokémon Emerald runs on the device with an AI handoff for gameplay goals; Grain is a tiny game you play by moving it.
              </p>
              <p className="case-study-status mt-4 font-mono text-xs text-muted">
                <span className="text-accent" aria-hidden="true">●</span>{' '}
                Prototype
              </p>
            </div>
          </div>

          <nav className="case-study-nav mb-10 flex flex-wrap gap-2 font-mono text-xs" aria-label="Case study sections">
            <Link to="/projects/omalo" className="tui-link-chip">product overview</Link>
            <a href="#handoff" className="tui-link-chip">how the handoff works</a>
            <a href="#grain" className="tui-link-chip">explore Grain</a>
            <a href="#how-it-works" className="tui-link-chip">how it works</a>
          </nav>

          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="case-study-feature mb-12"
            aria-labelledby="case-study-evidence-title"
          >
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
              <h2 id="case-study-evidence-title" className="case-study-section-title">Current evidence</h2>
              <span className="case-study-kicker">capture status</span>
            </div>
            <div className="case-study-evidence-grid">
              <StarterSelectionCapture className="case-study-evidence-card" />
              <GrainCapture className="case-study-evidence-card" />
            </div>
          </motion.section>

          <div className="case-study-body technical-readability-panel grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div className="space-y-12">
              <section id="handoff" className="case-study-section scroll-mt-24" aria-labelledby="handoff-title">
                <p className="case-study-kicker">01 / Pokémon</p>
                <h2 id="handoff-title" className="case-study-section-title mt-2">Play, then hand it a goal</h2>
                <p className="case-study-copy mt-4">
                  The handoff starts with Pokémon Emerald on the companion. Give the AI a gameplay goal such as choosing a starter, then take control back with the device controls. The agent receives structured game information and can carry out supported movement and battle actions through local controls.
                </p>
                <p className="case-study-copy mt-4">
                  Speech transcription and model requests use network services over Wi-Fi. The game and local controls run on the device; the model is not presented as offline or as a guarantee that a goal will finish.
                </p>
              </section>

              <section id="grain" className="case-study-section scroll-mt-24" aria-labelledby="grain-title">
                <p className="case-study-kicker">02 / Grain</p>
                <h2 id="grain-title" className="case-study-section-title mt-2">The whole companion is the controller</h2>
                <p className="case-study-copy mt-4">
                  Grain is a separate game on the same device: a tiny game you play by moving it. Move the pocket companion to steer a fleck seven pixels across around a rounded play area.
                </p>
                <p className="case-study-copy mt-4">
                  Its motion model combines movement and gravity, and the simulation steps at 240 Hz. That is an internal stepping rate, not a claim about display frame rate or physical calibration.
                </p>
                <div className="case-study-grain-scale mt-5" role="img" aria-label="Source-derived scale note: the Grain fleck is seven pixels across.">
                  <span className="case-study-grain-scale-dot" aria-hidden="true" />
                  <span><strong>7 px</strong> fleck diameter · source-derived scale note</span>
                </div>
              </section>

              <section id="how-it-works" className="case-study-section scroll-mt-24" aria-labelledby="how-title">
                <p className="case-study-kicker">03 / boundary</p>
                <h2 id="how-title" className="case-study-section-title mt-2">How it works</h2>
                <p className="case-study-copy mt-4">
                  The device uses a Waveshare ESP32-S3 touch AMOLED board. The game and local controls run on the device; speech transcription and model requests use network services over Wi-Fi. The agent receives structured game information, and local controllers carry out supported movement and battle actions.
                </p>
              </section>

              <section id="corners" className="case-study-section scroll-mt-24" aria-labelledby="corners-title">
                <p className="case-study-kicker">04 / rendering</p>
                <h2 id="corners-title" className="case-study-section-title mt-2">A rounded screen still has a rectangle underneath</h2>
                <p className="case-study-copy mt-4">
                  Grain&apos;s screen has rounded corners. Its framebuffer is a rectangle. The game uses a rounded tray to keep the fleck out of hidden corner pixels, so the drawing and collision boundary need to agree.
                </p>
                <div className="case-study-diagram mt-6" role="img" aria-label="Source-derived diagram showing a rectangular framebuffer, a rounded visible area, and an inset Grain tray.">
                  <div className="case-study-diagram-frame">
                    <div className="case-study-diagram-visible">
                      <div className="case-study-diagram-tray">
                        <span className="case-study-diagram-dot" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                  <div className="case-study-diagram-labels">
                    <span>framebuffer rectangle</span>
                    <span>visible rounded area</span>
                    <span>inset tray</span>
                  </div>
                </div>
                <p className="case-study-source-label mt-3">Source-derived diagram · dimensions are illustrative.</p>
              </section>

              <section id="catch-check" className="case-study-section scroll-mt-24" aria-labelledby="catch-title">
                <p className="case-study-kicker">05 / verification</p>
                <h2 id="catch-title" className="case-study-section-title mt-2">How does the agent know a Pokémon catch counted?</h2>
                <p className="case-study-copy mt-4">
                  A catch is checked after the game settles. The controller records that the Pokémon identity was absent before the action and appears exactly once afterward across the party and box, then treats that state change as the result to report.
                </p>
                <div className="case-study-check-grid mt-6" aria-label="Source-derived catch verification states">
                  <div className="case-study-check-card"><span>before</span><strong>identity absent</strong></div>
                  <div className="case-study-check-card"><span>after settle</span><strong>identity appears once</strong></div>
                  <div className="case-study-check-card"><span>report</span><strong>result can be checked</strong></div>
                </div>
                <p className="case-study-source-label mt-3">Source-logic explanation · this is not a recording of a successful catch.</p>
              </section>

              <section id="party" className="case-study-section scroll-mt-24" aria-labelledby="party-title">
                <p className="case-study-kicker">06 / read-only question</p>
                <h2 id="party-title" className="case-study-section-title mt-2">Ask about the party</h2>
                <p className="case-study-copy mt-4">
                  A read-only question can return the current party without issuing movement or battle commands.
                </p>
              </section>
            </div>

            <aside className="case-study-aside space-y-6" aria-label="Case study notes">
              <div className="case-study-aside-card">
                <p className="case-study-kicker">current limits</p>
                <p className="mt-3 text-sm leading-6 text-muted">
                  A gameplay goal is a request, not a guaranteed result. Full autonomous completion of Pokémon Emerald has not been established.
                </p>
              </div>
              <div className="case-study-aside-card">
                <p className="case-study-kicker">source status</p>
                <p className="mt-3 text-sm leading-6 text-muted">
                  The technical page records the current firmware boundary. Any source release will be added when it is ready.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to="/projects/omalo" className="tui-link-chip inline-flex">product overview</Link>
                <Link to="/projects" className="tui-link-chip inline-flex">browse more projects</Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}

export default S3Amoled
