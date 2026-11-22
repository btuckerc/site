import Breadcrumb from '../components/Breadcrumb'
import PageMeta from '../components/PageMeta'

const policySections = [
  {
    title: 'Data collected',
    content: (
      <p>
        <strong className="text-fg">None.</strong> Flipping Seven Calculator does not
        collect data about you and does not send anything to a server.
      </p>
    ),
  },
  {
    title: 'Data stored on your device',
    content: (
      <>
        <p>
          The app saves a small amount of data locally on your device using Apple&apos;s
          standard storage so your games and settings stick around:
        </p>
        <ul className="mt-3 space-y-2" role="list">
          <li>Player names and roster</li>
          <li>Current game state and round history</li>
          <li>Deck and score-profile settings</li>
          <li>Preferences like theme, haptics, and display options</li>
        </ul>
        <p className="mt-4">
          This stays on your device unless you include it in an Apple-managed backup like
          iCloud Backup. Deleting the app removes its local data, aside from any device
          backup you manage yourself.
        </p>
      </>
    ),
  },
  {
    title: 'Tracking',
    content: (
      <p>
        Flipping Seven Calculator does not track you across apps or websites and does
        not use Apple&apos;s App Tracking Transparency framework.
      </p>
    ),
  },
  {
    title: 'Third-party services',
    content: (
      <p>
        Flipping Seven Calculator does not include any third-party analytics, ads, or
        crash-reporting SDKs.
      </p>
    ),
  },
  {
    title: 'Permissions',
    content: (
      <p>
        Flipping Seven Calculator does not ask for location, contacts, photos,
        camera, microphone, Bluetooth, or similar device permissions.
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
        If this policy changes, I&apos;ll update the effective date above and post the
        new version right here.
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
    <PageMeta
      title="Privacy Policy - Flipping Seven Calculator"
      description="Privacy policy for Flipping Seven Calculator, an offline scorekeeper that collects no personal data."
      url="https://btuckerc.dev/privacy/flipping-seven-calculator"
      openGraphDescription="Flipping Seven Calculator does not collect, transmit, sell, or share personal data."
      image="https://btuckerc.dev/og/flipping-seven-privacy.jpg"
      imageAlt="Flipping Seven privacy: simple app, simple privacy."
    />

    <div className="tui-page-shell min-h-svh">
      <div className="tui-rail">
        <Breadcrumb items={[{ label: 'home', to: '/' }, { label: 'flipping seven' }, { label: 'privacy' }]} />
        <article className="mx-auto max-w-4xl font-mono">

        <header className="tui-panel mb-6 p-5 sm:p-7">
          <p className="case-study-eyebrow">Flipping Seven Calculator / Privacy policy</p>
          <h1 className="tui-page-title mt-3 text-2xl font-bold leading-tight text-fg sm:text-4xl">
            Simple app. Simple privacy.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted sm:text-base">
            Flipping Seven Calculator is an offline scorekeeper. We do not
            collect, transmit, sell, or share personal data.
          </p>
          <dl className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {summaryItems.map(([term, description]) => (
              <div key={term} className="bg-bg px-4 py-3">
                <dt className="text-xs uppercase tracking-[0.08em] text-muted">
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
              className="tui-panel p-5 sm:p-7"
            >
              <h2
                id={`privacy-section-${index}`}
                className="mb-3 text-sm font-semibold uppercase tracking-[0.1em] text-accent sm:text-base"
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
            className="tui-panel border-accent/40 p-5 sm:p-7"
          >
            <h2
              id="privacy-contact"
              className="text-sm font-semibold uppercase tracking-[0.1em] text-accent sm:text-base"
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
          Independent scorekeeper. Not affiliated with or endorsed by any game
          publisher.
        </p>
        </article>
      </div>
    </div>
  </>
)

export default FlippingSevenPrivacy
