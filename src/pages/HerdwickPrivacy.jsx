import PageMeta from '../components/PageMeta'

const linkClass =
  'text-accent underline decoration-accent/50 underline-offset-4 transition-colors hover:text-fg focus-visible:text-fg'

const policySections = [
  {
    title: 'Data we collect',
    content: (
      <p>
        <strong className="text-fg">None.</strong> Herdwick has no analytics, advertising,
        or crash-reporting SDKs. The developer stores nothing about you. The only
        developer-run service is the optional push relay described below, which forwards
        alerts without storing or logging them.
      </p>
    ),
  },
  {
    title: 'Your machines and connections',
    content: (
      <>
        <p>
          Herdwick connects over SSH to computers you add. The conversations, terminal output,
          messages, and attachments you see and send travel directly between your device and
          that computer, encrypted by SSH. They are not copied anywhere else.
        </p>
        <ul className="mt-3 space-y-2" role="list">
          <li>
            Host names, addresses, and usernames are stored on your device.
          </li>
          <li>
            The device&apos;s SSH key is generated on the device, and its private key never leaves
            it. The key, any saved passwords, and trusted host keys are kept in the iOS Keychain
            for this device only, and are not included in backups.
          </li>
          <li>
            Removing a host in Herdwick deletes its saved password and host key.
          </li>
          <li>
            Images you attach are uploaded only to your computer&apos;s temporary folder. Herdwick
            deletes them after the period you choose in Settings.
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
          If you choose to sign in to Tailscale, Herdwick runs Tailscale&apos;s client inside the
          app so it can reach your machines on your tailnet. Sign-in happens on Tailscale&apos;s
          web page in a Safari view; Herdwick cannot see your credentials.
        </p>
        <p className="mt-4">
          While Tailscale is in use, Tailscale Inc. receives the information its client needs to
          connect this device to your tailnet and to diagnose it:
        </p>
        <ul className="mt-3 space-y-2" role="list">
          <li>Device identity keys and a device name (herdwick-&lt;random&gt;)</li>
          <li>Operating system version, device model, and network addresses</li>
          <li>Diagnostic logs from the Tailscale client</li>
        </ul>
        <p className="mt-4">
          This is linked to your Tailscale account and governed by{' '}
          <a href="https://tailscale.com/privacy-policy" className={linkClass}>
            Tailscale&apos;s privacy policy
          </a>
          . It is not used for tracking or advertising, and the developer does not receive it.
          Signing out in Settings removes this device&apos;s tailnet identity from the app. If you
          never sign in, none of this happens.
        </p>
      </>
    ),
  },
  {
    title: 'Alerts while away (optional)',
    content: (
      <>
        <p>
          If you turn on Alerts While Away, Herdwick starts a small watcher on each connected
          computer over SSH when you leave the app. It stops when you come back, exits on its
          own after a day, and installs nothing that lasts.
        </p>
        <p className="mt-4">
          When an agent needs you or finishes, your computer sends Herdwick&apos;s push relay:
        </p>
        <ul className="mt-3 space-y-2" role="list">
          <li>This device&apos;s Apple push notification token</li>
          <li>
            Identifiers for the computer (a random ID Herdwick created), the herdr session,
            and the pane
          </li>
          <li>The agent&apos;s new state and a change number</li>
        </ul>
        <p className="mt-4">
          It never sends names, paths, or anything an agent wrote. The relay, run by the
          developer on Cloudflare Workers, passes this to Apple&apos;s push notification service
          and keeps nothing: no storage and no request logs. The alert text is generic; your
          device fills in names it already knows. Turn the option off in Settings at any time.
          The relay&apos;s{' '}
          <a href="https://github.com/btuckerc/herdwick/blob/main/relay/src/index.js" className={linkClass}>
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
        <p>Herdwick stores the following on your device to work:</p>
        <ul className="mt-3 space-y-2" role="list">
          <li>Your host list and connection settings</li>
          <li>Preferences such as appearance, terminal theme, font, and notification choices</li>
          <li>Which agents you have read, so the inbox can show what is new</li>
        </ul>
        <p className="mt-4">
          Deleting the app removes this data, subject to any device backup you control.
        </p>
      </>
    ),
  },
  {
    title: 'Permissions',
    content: (
      <ul className="space-y-2" role="list">
        <li>
          <strong className="text-fg">Notifications</strong>: off until you turn them on. Alerts
          are created on your device while Herdwick is open or refreshing in the background, or
          arrive through Apple&apos;s push service if you turn on Alerts While Away.
        </li>
        <li>
          <strong className="text-fg">Photos</strong>: Herdwick uses the system photo picker and
          only receives the images you select.
        </li>
        <li>
          <strong className="text-fg">Network</strong>: used only to reach the machines you add
          and, if you use them, Tailscale and Apple&apos;s push service.
        </li>
      </ul>
    ),
  },
  {
    title: 'Tracking',
    content: (
      <p>
        Herdwick does not track you across apps or websites and does not use the App Tracking
        Transparency framework.
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
        If this policy changes, the effective date above will be updated and the revised policy
        will be published at this same location.
      </p>
    ),
  },
]

const summaryItems = [
  ['data collected by us', 'none'],
  ['accounts', 'not required'],
  ['analytics & ads', 'none'],
  ['connections', 'direct over SSH'],
]

const HerdwickPrivacy = () => (
  <>
    <PageMeta
      title="Privacy Policy — Herdwick"
      description="Privacy policy for Herdwick, an iOS client that connects over SSH to your own machines. The developer collects no data."
      url="https://btuckerc.dev/privacy/herdwick"
      openGraphDescription="Herdwick connects directly to your own machines over SSH. The developer collects no data."
    />

    <div className="tui-page-shell min-h-svh px-4 pb-28">
      <article className="mx-auto max-w-4xl font-mono">
        <div className="tui-page-header mb-8">
          <p className="hidden text-center text-xs uppercase tracking-[0.18em] text-muted sm:block">
            Herdwick
          </p>
        </div>

        <header className="mb-6 border border-line bg-card-bg px-5 py-7 sm:px-8 sm:py-9">
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-accent">
            Privacy policy
          </p>
          <h1 className="tui-page-title text-2xl font-bold leading-tight text-fg sm:text-4xl">
            Your agents stay on your machines.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted sm:text-base">
            Herdwick is an iPhone and iPad client for coding agents running on your own computers.
            It connects to them directly over SSH. The developer collects and stores no data.
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
  </>
)

export default HerdwickPrivacy
