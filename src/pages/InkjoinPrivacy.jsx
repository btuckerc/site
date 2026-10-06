import PageMeta from '../components/PageMeta'

const linkClass =
  'text-accent underline decoration-accent/50 underline-offset-4 transition-colors hover:text-fg focus-visible:text-fg'

const policySections = [
  {
    title: 'Data we collect',
    content: (
      <>
        <p>
          Inkjoin does not use third-party SDKs, advertising, tracking, or crash-reporting tools.
          Anonymous analytics are on by default and can be turned off in Settings → “Send anonymous analytics”.
        </p>
        <p className="mt-4">
          The first time you solve each daily puzzle, Inkjoin sends the puzzle date, the time taken
          in whole seconds, and whether you used hints. There is no identifier or account, and this
          information is not linked to you. The developer uses it only to tune puzzle difficulty.
          It is stored in a Cloudflare D1 database.
        </p>
      </>
    ),
  },
  {
    title: 'Daily puzzles',
    content: (
      <p>
        Daily puzzles are downloaded from the developer’s server at inkjoin.btuckerc.dev, hosted
        on Cloudflare. Downloaded puzzles work offline. The download sends ordinary HTTP request
        information, including your IP address, to Cloudflare. The developer does not log or store
        that information.
      </p>
    ),
  },
  {
    title: 'Data stored on your device',
    content: (
      <p>
        Your progress, marks, and settings stay on your device in the app’s Documents. Deleting
        Inkjoin deletes them. Settings includes an option to reset your progress.
      </p>
    ),
  },
  {
    title: 'Purchases',
    content: (
      <p>
        Inkjoin Full is bought through Apple. Apple handles the payment; the developer receives
        no payment or personal details. The app checks with the App Store whether the purchase
        is active on your device.
      </p>
    ),
  },
  {
    title: 'Permissions',
    content: <p>Inkjoin requests no permissions, including photos, notifications, or location.</p>,
  },
  {
    title: 'Tracking',
    content: <p>Inkjoin does not track you and does not use App Tracking Transparency.</p>,
  },
  {
    title: "Children's privacy",
    content: <p>Inkjoin collects no personal information from children.</p>,
  },
]

const summaryItems = [
  ['data linked to you', 'none'],
  ['account', 'not required'],
  ['analytics', 'optional to send'],
  ['ads & tracking', 'none'],
]

const InkjoinPrivacy = () => (
  <>
    <PageMeta
      title="Privacy Policy — Inkjoin"
      description="Privacy policy for Inkjoin, a calm iPhone logic puzzle game."
      url="https://btuckerc.dev/privacy/inkjoin"
      openGraphDescription="What Inkjoin keeps on your device and what its daily puzzles and optional anonymous analytics send."
    />

    <div className="tui-page-shell min-h-svh px-4 pb-28">
      <article className="mx-auto max-w-4xl font-mono">
        <div className="tui-page-header mb-8">
          <p className="hidden text-center text-xs uppercase tracking-[0.18em] text-muted sm:block">
            Inkjoin
          </p>
        </div>

        <header className="mb-6 border border-line bg-card-bg px-5 py-7 sm:px-8 sm:py-9">
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-accent">Privacy policy</p>
          <h1 className="tui-page-title text-2xl font-bold leading-tight text-fg sm:text-4xl">
            Your puzzles stay yours.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted sm:text-base">
            Inkjoin is a calm iPhone logic puzzle game. Your progress stays on your device; the
            optional anonymous analytics help tune puzzle difficulty.
          </p>
          <dl className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {summaryItems.map(([term, description]) => (
              <div key={term} className="bg-bg-elev px-4 py-3">
                <dt className="text-[0.68rem] uppercase tracking-[0.12em] text-muted">{term}</dt>
                <dd className="mt-1 text-sm font-semibold text-fg">{description}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted">
            <span><span className="text-accent">developer</span> Tucker Craig</span>
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

          <section aria-labelledby="privacy-contact" className="border border-accent/40 bg-card-bg px-5 py-6 sm:px-7">
            <h2 id="privacy-contact" className="text-sm font-semibold uppercase tracking-[0.12em] text-accent sm:text-base">
              <span aria-hidden="true" className="mr-2 text-muted">{String(policySections.length + 1).padStart(2, '0')}</span>
              Contact
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted sm:text-base">
              For privacy questions, email{' '}
              <a href="mailto:btuckerc.dev@gmail.com" className={linkClass}>btuckerc.dev@gmail.com</a>.
            </p>
          </section>
        </div>
      </article>
    </div>
  </>
)

export default InkjoinPrivacy
