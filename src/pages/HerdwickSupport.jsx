import PageMeta from '../components/PageMeta'

const linkClass =
  'text-accent underline decoration-accent/50 underline-offset-4 transition-colors hover:text-fg focus-visible:text-fg'

const sections = [
  {
    title: 'What you need',
    content: (
      <ul className="list-disc space-y-1 pl-5">
        <li>An iPhone or iPad on iOS 26 or later.</li>
        <li>
          A Mac or Linux machine running{' '}
          <a href="https://herdr.dev" className={linkClass}>
            herdr
          </a>
          , with your coding agents (omp, Claude Code, Codex) in its panes.
        </li>
        <li>SSH access to that machine, directly or through Tailscale.</li>
      </ul>
    ),
  },
  {
    title: 'Connect a machine',
    content: (
      <ul className="list-disc space-y-1 pl-5">
        <li>Open Herdwick and add a host by its address, or sign in to Tailscale and pick a machine.</li>
        <li>
          Sign in with a password, or with the key Herdwick makes on your device: copy it from
          Settings into <code>~/.ssh/authorized_keys</code> on the machine.
        </li>
        <li>Your agents appear in the inbox. Nothing is installed on the machine.</li>
      </ul>
    ),
  },
  {
    title: "If it won't connect",
    content: (
      <ul className="list-disc space-y-1 pl-5">
        <li>Check that you can SSH to the machine from another device with the same user.</li>
        <li>Check that herdr is running on it. Herdwick shows only agents herdr tracks.</li>
        <li>For key sign-in, check that the whole key line is in <code>authorized_keys</code>.</li>
      </ul>
    ),
  },
  {
    title: 'Try it without a machine',
    content: (
      <p>On the first screen, tap &ldquo;Explore a demo host&rdquo;. Leave Demo from Hosts.</p>
    ),
  },
]

const HerdwickSupport = () => (
  <>
    <PageMeta
      title="Support — Herdwick"
      description="Help for Herdwick, the iPhone and iPad app for reading and answering coding agents on your own machines."
      url="https://btuckerc.dev/herdwick/support"
      openGraphDescription="Help for Herdwick: setup, connecting a machine and contact."
    />

    <div className="tui-page-shell min-h-svh px-4 pb-28">
      <article className="mx-auto max-w-4xl font-mono">
        <div className="tui-page-header mb-8">
          <p className="hidden text-center text-xs uppercase tracking-[0.18em] text-muted sm:block">
            Herdwick
          </p>
        </div>

        <header className="mb-6 border border-line bg-card-bg px-5 py-7 sm:px-8 sm:py-9">
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-accent">Support</p>
          <h1 className="tui-page-title text-2xl font-bold leading-tight text-fg sm:text-4xl">
            Coding agents on your phone.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted sm:text-base">
            Herdwick shows the coding agents on your own machines as conversations. Read what
            they did and answer them from your iPhone or iPad.
          </p>
        </header>

        <div className="grid gap-4">
          {sections.map((section, index) => (
            <section
              key={section.title}
              aria-labelledby={`support-section-${index}`}
              className="tui-panel border border-line bg-card-bg px-5 py-5 sm:px-7 sm:py-6"
            >
              <h2
                id={`support-section-${index}`}
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
            aria-labelledby="support-contact"
            className="border border-accent/40 bg-card-bg px-5 py-6 sm:px-7"
          >
            <h2
              id="support-contact"
              className="text-sm font-semibold uppercase tracking-[0.12em] text-accent sm:text-base"
            >
              <span aria-hidden="true" className="mr-2 text-muted">
                {String(sections.length + 1).padStart(2, '0')}
              </span>
              Contact
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted sm:text-base">
              Email{' '}
              <a href="mailto:btuckerc.dev@gmail.com" className={linkClass}>
                btuckerc.dev@gmail.com
              </a>
              . Read the{' '}
              <a href="/privacy/herdwick" className={linkClass}>
                privacy policy
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

export default HerdwickSupport
