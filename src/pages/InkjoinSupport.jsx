import Breadcrumb from '../components/Breadcrumb'
import PageMeta from '../components/PageMeta'

const linkClass =
  'text-accent underline decoration-accent/50 underline-offset-4 transition-colors hover:text-fg focus-visible:text-fg'

const sections = [
  {
    title: 'How to play',
    content: (
      <ul className="space-y-2" role="list">
        <li>Fill squares to make one connected shape, joined side to side.</li>
        <li>A number counts filled squares in the eight squares around it, split into separate groups. For example, &quot;3 1&quot; means a group of three and a group of one.</li>
        <li>You can&apos;t have a solid 2x2 block of filled squares.</li>
        <li>The early chapters walk through each rule one at a time.</li>
      </ul>
    ),
  },
  {
    title: 'Common questions',
    content: (
      <div className="space-y-4">
        <p><strong className="text-fg">A daily puzzle won&apos;t load.</strong> It needs an internet connection the first time to download. After that, you can play it offline.</p>
        <p><strong className="text-fg">Why are daily drawings covered?</strong> Finished drawings for daily puzzles stay hidden until you tap to reveal them.</p>
        <p><strong className="text-fg">What does Inkjoin Full unlock?</strong> One purchase unlocks all 1,600 practice puzzles and every past daily. Today&apos;s daily, every chapter, unlimited hints, and 10 practice puzzles per level are free.</p>
        <p><strong className="text-fg">I bought Inkjoin Full on another device.</strong> Open Settings and tap Restore Purchases. Family Sharing works too.</p>
        <p><strong className="text-fg">How do I turn analytics off?</strong> Open Settings and turn off &quot;Send anonymous analytics&quot;.</p>
        <p><strong className="text-fg">Where is my progress?</strong> Progress is saved only on this iPhone.</p>
      </div>
    ),
  },
]

const InkjoinSupport = () => (
  <>
    <PageMeta
      title="Support - Inkjoin"
      description="Help for Inkjoin, an iPhone logic puzzle game."
      url="https://btuckerc.dev/inkjoin/support"
      openGraphDescription="How to play Inkjoin and answers to common questions."
      image="https://btuckerc.dev/og/inkjoin-support.jpg"
      imageAlt="Inkjoin support."
    />

    <div className="tui-page-shell min-h-svh">
      <div className="tui-rail">
        <Breadcrumb items={[{ label: 'home', to: '/' }, { label: 'inkjoin' }, { label: 'support' }]} />
        <article className="mx-auto max-w-4xl font-mono">

        <header className="tui-panel mb-6 p-5 sm:p-7">
          <p className="case-study-eyebrow">Inkjoin / Support</p>
          <h1 className="tui-page-title mt-3 text-2xl font-bold leading-tight text-fg sm:text-4xl">A little help with Inkjoin.</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted sm:text-base">
            Fill squares to draw one connected shape. These notes explain the rules and answer a few common questions.
          </p>
        </header>

        <div className="grid gap-4">
          {sections.map((section, index) => (
            <section
              key={section.title}
              aria-labelledby={`support-section-${index}`}
              className="tui-panel p-5 sm:p-7"
            >
              <h2
                id={`support-section-${index}`}
                className="mb-3 text-sm font-semibold uppercase tracking-[0.1em] text-accent sm:text-base"
              >
                <span aria-hidden="true" className="mr-2 text-muted">{String(index + 1).padStart(2, '0')}</span>
                {section.title}
              </h2>
              <div className="privacy-policy-copy text-sm leading-7 text-muted sm:text-base">{section.content}</div>
            </section>
          ))}

          <section aria-labelledby="support-contact" className="tui-panel border-accent/40 p-5 sm:p-7">
            <h2 id="support-contact" className="text-sm font-semibold uppercase tracking-[0.1em] text-accent sm:text-base">
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
    </div>
  </>
)

export default InkjoinSupport
