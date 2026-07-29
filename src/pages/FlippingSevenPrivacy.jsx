import { Helmet } from 'react-helmet-async'
import CloseButton from '../components/CloseButton'

const policySections = [
  {
    title: 'Data we collect',
    content: (
      <>
        <p>
          <strong className="text-fg">None.</strong> Flipping Seven Calculator does not
          collect data about you and does not send information to any server.
        </p>
      </>
    ),
  },
  {
    title: 'Data stored on your device',
    content: (
      <>
        <p>
          The app stores limited information locally on your device using Apple&apos;s
          standard on-device storage to support core functionality, including:
        </p>
        <ul className="mt-3 space-y-2" role="list">
          <li>Player names and roster</li>
          <li>Current game state and round history</li>
          <li>Deck and score-profile settings</li>
          <li>Preferences such as theme, haptics, and display options</li>
        </ul>
        <p className="mt-4">
          This information stays on your device unless you choose to include it in an
          Apple-managed device backup such as iCloud Backup. Removing the app also
          removes its locally stored app data, subject to any device backup you control.
        </p>
      </>
    ),
  },
  {
    title: 'Tracking',
    content: (
      <p>
        Flipping Seven Calculator does not track you across apps or websites and does
        not use the App Tracking Transparency framework.
      </p>
    ),
  },
  {
    title: 'Third-party services',
    content: (
      <p>
        Flipping Seven Calculator does not use third-party analytics, advertising, or
        crash-reporting SDKs.
      </p>
    ),
  },
  {
    title: 'Permissions',
    content: (
      <p>
        Flipping Seven Calculator does not require access to location, contacts, photos,
        camera, microphone, Bluetooth, or similar sensitive device features.
      </p>
    ),
  },
  {
    title: "Children's privacy",
    content: (
      <p>
        Because Flipping Seven Calculator does not collect personal information, there
        is no user data to sell, profile, or share for children or adults.
      </p>
    ),
  },
  {
    title: 'Changes to this policy',
    content: (
      <p>
        If this policy changes, the effective date above will be updated and the revised
        policy will be published at this same location.
      </p>
    ),
  },
]

const summaryItems = [
  ['data collected', 'none'],
  ['accounts', 'not required'],
  ['analytics & ads', 'none'],
  ['app data', 'stored on device'],
]

const FlippingSevenPrivacy = () => (
  <>
    <Helmet>
      <title>Privacy Policy — Flipping Seven Calculator</title>
      <meta
        name="description"
        content="Privacy policy for Flipping Seven Calculator, an offline scorekeeping utility that does not collect personal data."
      />
      <meta name="robots" content="index, follow" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Privacy Policy — Flipping Seven Calculator" />
      <meta
        property="og:description"
        content="Flipping Seven Calculator does not collect, transmit, sell, or share personal data."
      />
      <meta
        property="og:url"
        content="https://btuckerc.dev/privacy/flipping-seven-calculator"
      />
      <link
        rel="canonical"
        href="https://btuckerc.dev/privacy/flipping-seven-calculator"
      />
    </Helmet>

    <div className="tui-page-shell min-h-svh px-4 pb-28 pt-20">
      <article className="mx-auto max-w-4xl font-mono">
        <div className="tui-page-header relative mb-8 flex min-h-12 items-center justify-center">
          <div className="absolute left-0 top-0">
            <CloseButton />
          </div>
          <p className="hidden text-xs uppercase tracking-[0.18em] text-muted sm:block">
            Flipping Seven Calculator
          </p>
        </div>

        <header className="mb-6 border border-line bg-card-bg px-5 py-7 sm:px-8 sm:py-9">
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-accent">
            Privacy policy
          </p>
          <h1 className="tui-page-title text-2xl font-bold leading-tight text-fg sm:text-4xl">
            Simple app. Simple privacy.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted sm:text-base">
            Flipping Seven Calculator is an offline scorekeeping utility. We do not
            collect, transmit, sell, or share personal data.
          </p>
          <dl className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {summaryItems.map(([term, description]) => (
              <div key={term} className="bg-bg-elev px-4 py-3">
                <dt className="text-[0.68rem] uppercase tracking-[0.12em] text-muted">
                  {term}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-fg">{description}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted">
            <span>
              <span className="text-accent">effective</span> July 28, 2026
            </span>
            <span>
              <span className="text-accent">developer</span> Tucker Craig
            </span>
          </div>
        </header>

        <div className="grid gap-4">
          {policySections.map((section, index) => (
            <section
              key={section.title}
              aria-labelledby={`privacy-section-${index}`}
              className="tui-panel border border-line bg-card-bg px-5 py-5 sm:px-7 sm:py-6"
            >
              <h2
                id={`privacy-section-${index}`}
                className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-accent sm:text-base"
              >
                <span aria-hidden="true" className="mr-2 text-muted">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {section.title}
              </h2>
              <div className="privacy-policy-copy text-sm leading-7 text-muted sm:text-base">
                {section.content}
              </div>
            </section>
          ))}

          <section
            aria-labelledby="privacy-contact"
            className="border border-accent/40 bg-card-bg px-5 py-6 sm:px-7"
          >
            <h2
              id="privacy-contact"
              className="text-sm font-semibold uppercase tracking-[0.12em] text-accent sm:text-base"
            >
              <span aria-hidden="true" className="mr-2 text-muted">
                08
              </span>
              Contact
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted sm:text-base">
              For privacy questions, email{' '}
              <a
                href="mailto:btuckerc.dev@gmail.com"
                className="text-accent underline decoration-accent/50 underline-offset-4 transition-colors hover:text-fg focus-visible:text-fg"
              >
                btuckerc.dev@gmail.com
              </a>
              .
            </p>
          </section>
        </div>

        <p className="mt-6 text-center text-xs leading-6 text-muted">
          Independent scorekeeping utility. Not affiliated with or endorsed by any game
          publisher.
        </p>
      </article>
    </div>
  </>
)

export default FlippingSevenPrivacy
