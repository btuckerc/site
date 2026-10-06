import PageMeta from '../components/PageMeta'

const linkClass =
  'text-accent underline decoration-accent/50 underline-offset-4 transition-colors hover:text-fg focus-visible:text-fg'

const sections = [
  {
    title: 'How to play',
    content: (
      <ul className="list-disc space-y-1 pl-5">
        <li>Fill squares to make one shape, joined side to side.</li>
        <li>A number counts filled squares in the eight squares around it, split into separate groups. For example, “3 1” means a group of three and a group of one.</li>
        <li>There must not be a filled 2×2 block.</li>
        <li>The first teaching chapters introduce each rule.</li>
      </ul>
    ),
  },
  {
    title: 'Common questions',
    content: (
      <div className="space-y-4">
        <p><strong className="text-fg">A daily puzzle won’t load.</strong> It needs a connection to download once. After that, you can play it offline.</p>
        <p><strong className="text-fg">Why are daily drawings covered?</strong> Finished drawings for daily puzzles stay covered until you choose to show them.</p>
        <p><strong className="text-fg">How do I turn analytics off?</strong> In Settings, turn off “Send anonymous analytics”.</p>
        <p><strong className="text-fg">Where is my progress?</strong> Progress lives only on this iPhone.</p>
      </div>
    ),
  },
]

const InkjoinSupport = () => (
  <>
    <PageMeta
      title="Support — Inkjoin"
      description="Help for Inkjoin, a calm iPhone logic puzzle game."
      url="https://btuckerc.dev/inkjoin/support"
      openGraphDescription="How to play Inkjoin and answers to common questions."
    />

    <div className="tui-page-shell min-h-svh px-4 pb-28">
      <article className="mx-auto max-w-4xl font-mono">
        <div className="tui-page-header mb-8">
          <p className="hidden text-center text-xs uppercase tracking-[0.18em] text-muted sm:block">Inkjoin</p>
        </div>

        <header className="mb-6 border border-line bg-card-bg px-5 py-7 sm:px-8 sm:py-9">
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-accent">Support</p>
          <h1 className="tui-page-title text-2xl font-bold leading-tight text-fg sm:text-4xl">A little help with Inkjoin.</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted sm:text-base">
            Fill squares to draw one connected shape. These notes explain the rules and answer a few common questions.
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
                <span aria-hidden="true" className="mr-2 text-muted">{String(index + 1).padStart(2, '0')}</span>
                {section.title}
              </h2>
              <div className="privacy-policy-copy text-sm leading-7 text-muted sm:text-base">{section.content}</div>
            </section>
          ))}

          <section aria-labelledby="support-contact" className="border border-accent/40 bg-card-bg px-5 py-6 sm:px-7">
            <h2 id="support-contact" className="text-sm font-semibold uppercase tracking-[0.12em] text-accent sm:text-base">
              <span aria-hidden="true" className="mr-2 text-muted">03</span>
              Contact
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted sm:text-base">
              Email{' '}
              <a href="mailto:btuckerc.dev@gmail.com" className={linkClass}>btuckerc.dev@gmail.com</a>.
              {' '}Read the{' '}
              <a href="/privacy/inkjoin" className={linkClass}>privacy policy</a>.
            </p>
          </section>
        </div>
      </article>
    </div>
  </>
)

export default InkjoinSupport
