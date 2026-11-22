import Breadcrumb from '../components/Breadcrumb'
import PageMeta from '../components/PageMeta'

const linkClass =
  'text-accent underline decoration-accent/50 underline-offset-4 transition-colors hover:text-fg focus-visible:text-fg'

const policySections = [
  {
    title: 'Data collected',
    content: (
      <p>
        <strong className="text-fg">None.</strong> Herdwick has no analytics, ads, or
        crash-reporting SDKs. I don&apos;t store anything about you. The only service I run
        is the optional push relay described below, which forwards alerts without storing
        or logging them.
      </p>
    ),
  },
  {
    title: 'Your machines and connections',
    content: (
      <>
        <p>
          Herdwick connects over SSH to the computers you add. The conversations, terminal
          output, messages, and attachments you view and send travel straight between your
          device and that computer, encrypted by SSH. Nothing is copied anywhere else.
        </p>
        <ul className="mt-3 space-y-2" role="list">
          <li>Host names, addresses, and usernames stay on your device.</li>
          <li>
            Your device generates its own SSH key, and the private key never leaves it. The
            key, any saved passwords, and trusted host keys live in the iOS Keychain for
            this device only and aren&apos;t included in backups.
          </li>
          <li>Removing a host in Herdwick deletes its saved password and host key.</li>
          <li>
            Images you attach upload only to your computer&apos;s temporary folder. Herdwick
            cleans them up after the window you pick in Settings.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: 'Tailscale (optional)',
    content: (
      <>
        <p>
          If you sign in to Tailscale, Herdwick runs Tailscale&apos;s client inside the app
          so it can reach your machines on your tailnet. Sign-in happens on Tailscale&apos;s
          web page in a Safari view, so Herdwick never sees your credentials.
        </p>
        <p className="mt-4">
          While Tailscale is on, Tailscale Inc. receives what its client needs to connect
          and troubleshoot this device:
        </p>
        <ul className="mt-3 space-y-2" role="list">
          <li>Device identity keys and a device name (herdwick-&lt;random&gt;)</li>
          <li>Operating system version, device model, and network addresses</li>
          <li>Diagnostic logs from the Tailscale client</li>
        </ul>
        <p className="mt-4">
          That data is tied to your Tailscale account and covered by{' '}
          <a href="https://tailscale.com/privacy-policy" className={linkClass} target="_blank" rel="noopener noreferrer" aria-describedby="new-tab-note">
            Tailscale&apos;s privacy policy
          </a>
          . It isn&apos;t used for tracking or ads, and I never receive it. Signing out in
          Settings wipes this device&apos;s tailnet identity from the app. If you never sign
          in, none of this runs.
        </p>
      </>
    ),
  },
  {
    title: 'Alerts while away (optional)',
    content: (
      <>
        <p>
          If you turn on Alerts While Away, Herdwick starts a tiny watcher over SSH on each
          connected computer when you leave the app. It stops when you come back, exits on
          its own after a day, and doesn&apos;t install anything permanent.
        </p>
        <p className="mt-4">
          When an agent needs you or finishes, your computer sends Herdwick&apos;s push relay:
        </p>
        <ul className="mt-3 space-y-2" role="list">
          <li>This device&apos;s Apple push notification token</li>
          <li>
            Identifiers for the computer (a random ID Herdwick made), the herdr session,
            and the pane
          </li>
          <li>The agent&apos;s new state and a change number</li>
        </ul>
        <p className="mt-4">
          It never sends names, paths, or anything an agent wrote. The relay (which I run on
          Cloudflare Workers) passes that along to Apple&apos;s push service and keeps
          nothing: no storage and no request logs. The alert text is generic, and your
          device fills in the names it already knows. You can turn this off in Settings
          anytime, and the relay&apos;s{' '}
          <a href="https://github.com/btuckerc/herdwick/blob/main/relay/src/index.js" className={linkClass} target="_blank" rel="noopener noreferrer" aria-describedby="new-tab-note">
            source code
          </a>{' '}
          is public.
        </p>
      </>
    ),
  },
  {
    title: 'Data stored on your device',
    content: (
      <>
        <p>Herdwick keeps a few things locally on your device so it works:</p>
        <ul className="mt-3 space-y-2" role="list">
          <li>Your host list and connection settings</li>
          <li>Preferences like appearance, terminal theme, font, and notification choices</li>
          <li>Which agents you&apos;ve read, so the inbox knows what&apos;s new</li>
        </ul>
        <p className="mt-4">
          Deleting the app removes this data, aside from any device backup you manage yourself.
        </p>
      </>
    ),
  },
  {
    title: 'Permissions',
    content: (
      <ul className="space-y-2" role="list">
        <li>
          <strong className="text-fg">Notifications</strong>: off until you turn them on.
          Alerts happen on your device while Herdwick is open or refreshing in the
          background, or come through Apple&apos;s push service if you enable Alerts While
          Away.
        </li>
        <li>
          <strong className="text-fg">Photos</strong>: Herdwick uses the system photo picker
          and only sees the images you pick.
        </li>
        <li>
          <strong className="text-fg">Network</strong>: used only to reach the machines you
          add, plus Tailscale and Apple&apos;s push service if you turn those on.
        </li>
      </ul>
    ),
  },
  {
    title: 'Tracking',
    content: (
      <p>
        Herdwick does not track you across apps or websites and does not use Apple&apos;s
        App Tracking Transparency framework.
      </p>
    ),
  },
  {
    title: "Children's privacy",
    content: (
      <p>
        Herdwick does not collect personal information, so there is no user data to sell,
        profile, or share for children or adults.
      </p>
    ),
  },
  {
    title: 'Changes to this policy',
    content: (
      <p>
        If this policy changes, I&apos;ll update the effective date above and post the new
        version right here.
      </p>
    ),
  },
]

const summaryItems = [
  ['data collected', 'none'],
  ['accounts', 'not required'],
  ['analytics & ads', 'none'],
  ['connections', 'direct over SSH'],
]

const HerdwickPrivacy = () => (
  <>
    <PageMeta
      title="Privacy Policy - Herdwick"
      description="Privacy policy for Herdwick, an iOS client that connects over SSH to your own machines. I collect no data."
      url="https://btuckerc.dev/privacy/herdwick"
      openGraphDescription="Herdwick connects directly to your own machines over SSH. No data is collected or stored."
      image="https://btuckerc.dev/og/herdwick-privacy.jpg"
      imageAlt="Herdwick privacy: your agents stay on your machines."
    />

    <div className="tui-page-shell min-h-svh">
      <div className="tui-rail">
        <Breadcrumb items={[{ label: 'home', to: '/' }, { label: 'herdwick' }, { label: 'privacy' }]} />
        <article className="mx-auto max-w-4xl font-mono">

        <header className="tui-panel mb-6 p-5 sm:p-7">
          <p className="case-study-eyebrow">Herdwick / Privacy policy</p>
          <h1 className="tui-page-title mt-3 text-2xl font-bold leading-tight text-fg sm:text-4xl">
            Your agents stay on your machines.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted sm:text-base">
            Herdwick is an iPhone and iPad app for coding agents running on your own
            computers. It connects straight to them over SSH, and I don&apos;t collect or
            store any of your data.
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
              <span className="text-accent">effective</span> September 26, 2026
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
                {String(policySections.length + 1).padStart(2, '0')}
              </span>
              Contact
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted sm:text-base">
              For privacy questions, email{' '}
              <a href="mailto:btuckerc.dev@gmail.com" className={linkClass}>
                btuckerc.dev@gmail.com
              </a>
              .
            </p>
          </section>
        </div>

        <p className="mt-6 text-center text-xs leading-6 text-muted">
          Independent project. Not affiliated with or endorsed by the herdr project or Tailscale
          Inc.
        </p>
        </article>
      </div>
    </div>
  </>
)

export default HerdwickPrivacy
