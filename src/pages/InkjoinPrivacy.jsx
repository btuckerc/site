import Breadcrumb from '../components/Breadcrumb'
import PageMeta from '../components/PageMeta'

const linkClass =
  'text-accent underline decoration-accent/50 underline-offset-4 transition-colors hover:text-fg focus-visible:text-fg'

const policySections = [
  {
    title: 'Data collected',
    content: (
      <>
        <p>
          Inkjoin has no third-party SDKs, ads, tracking, or crash-reporting tools.
          Anonymous analytics are on by default and can be turned off anytime in Settings → &quot;Send anonymous analytics&quot;.
        </p>
        <p className="mt-4">
          The first time you solve each daily puzzle, Inkjoin sends the puzzle date, how long it took
          in whole seconds, and whether you used hints. There&apos;s no account or identifier, so none of
          it is tied to you. I only use it to tune puzzle difficulty, and it&apos;s stored in a Cloudflare D1 database.
        </p>
      </>
    ),
  },
  {
    title: 'Daily puzzles',
    content: (
      <p>
        Daily puzzles download from my server at inkjoin.btuckerc.dev, hosted on Cloudflare. Once a
        puzzle downloads, it works offline. The request sends standard HTTP info (including your IP
        address) to Cloudflare, and I don&apos;t log or store any of it.
      </p>
    ),
  },
  {
    title: 'Data stored on your device',
    content: (
      <p>
        Your progress, marks, and settings stay on your device in the app&apos;s Documents folder.
        Deleting Inkjoin wipes them. You can also reset your progress anytime in Settings.
      </p>
    ),
  },
  {
    title: 'Purchases',
    content: (
      <p>
        Inkjoin Full is bought through Apple. Apple handles the payment, and I never receive any
        payment or personal details. The app just checks with the App Store to see if the purchase
        is active on your device.
      </p>
    ),
  },
  {
    title: 'Permissions',
    content: <p>Inkjoin doesn&apos;t ask for any permissions, including photos, notifications, or location.</p>,
  },
  {
    title: 'Tracking',
    content: <p>Inkjoin does not track you and does not use Apple&apos;s App Tracking Transparency framework.</p>,
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
      title="Privacy Policy - Inkjoin"
      description="Privacy policy for Inkjoin, an iPhone logic puzzle game."
      url="https://btuckerc.dev/privacy/inkjoin"
      openGraphDescription="What Inkjoin keeps on your device and what its daily puzzles and optional anonymous analytics send."
      image="https://btuckerc.dev/og/inkjoin-privacy.jpg"
      imageAlt="Inkjoin privacy policy."
    />

    <div className="tui-page-shell min-h-svh">
      <div className="tui-rail">
        <Breadcrumb items={[{ label: 'home', to: '/' }, { label: 'inkjoin' }, { label: 'privacy' }]} />
        <article className="mx-auto max-w-4xl font-mono">

        <header className="tui-panel mb-6 p-5 sm:p-7">
          <p className="case-study-eyebrow">Inkjoin / Privacy policy</p>
          <h1 className="tui-page-title mt-3 text-2xl font-bold leading-tight text-fg sm:text-4xl">
            Your puzzles stay yours.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted sm:text-base">
            Inkjoin is an iPhone logic puzzle game. Your progress stays on your device, and the
            optional anonymous analytics just help me tune puzzle difficulty.
          </p>
          <dl className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {summaryItems.map(([term, description]) => (
              <div key={term} className="bg-bg px-4 py-3">
                <dt className="text-xs uppercase tracking-[0.08em] text-muted">{term}</dt>
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

          <section aria-labelledby="privacy-contact" className="tui-panel border-accent/40 p-5 sm:p-7">
            <h2 id="privacy-contact" className="text-sm font-semibold uppercase tracking-[0.1em] text-accent sm:text-base">
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
    </div>
  </>
)

export default InkjoinPrivacy
