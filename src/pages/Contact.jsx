import Breadcrumb from '../components/Breadcrumb'
import ContactForm from '../components/ContactForm'
import PageMeta from '../components/PageMeta'

const Contact = () => {
  return (
    <>
      <PageMeta route="/contact" />
      <div className="tui-page-shell min-h-svh">
        <div className="tui-rail tui-enter">
          <Breadcrumb items={[{ label: 'home', to: '/' }, { label: 'contact' }]} />

          <header className="mb-6">
            <h1 className="tui-page-title text-3xl font-bold leading-tight text-fg sm:text-4xl">
              Contact
            </h1>
          </header>

          <div className="grid lg:grid-cols-3 gap-6 items-stretch">
            <div className="lg:col-span-1">
              <div className="tui-panel tui-contact-panel h-full p-5 sm:p-7 font-mono">
                <div className="space-y-6">
                  <div>
                    <h2 className="case-study-kicker font-semibold mb-3">email</h2>
                    <a
                      href="mailto:btuckerc.dev@gmail.com"
                      className="tui-link-chip tui-link-chip-block"
                    >
                      btuckerc.dev@gmail.com
                    </a>
                  </div>

                  <div className="border-t border-line pt-5">
                    <h2 className="case-study-kicker font-semibold mb-3">links</h2>
                    <div className="space-y-2.5">
                      <a
                        href="https://tuckercraig.com/"
                        target="_blank"
                        rel="me noopener noreferrer"
                        aria-describedby="new-tab-note"
                        className="tui-link-chip tui-link-chip-block"
                      >
                        tuckercraig.com
                      </a>
                      <a
                        href="https://www.linkedin.com/in/tucker-craig/"
                        target="_blank"
                        rel="me noopener noreferrer"
                        aria-describedby="new-tab-note"
                        className="tui-link-chip tui-link-chip-block"
                      >
                        linkedin
                      </a>
                      <a
                        href="https://github.com/btuckerc"
                        target="_blank"
                        rel="me noopener noreferrer"
                        aria-describedby="new-tab-note"
                        className="tui-link-chip tui-link-chip-block"
                      >
                        github
                      </a>
                      <a
                        href="https://x.com/btuckercdev"
                        target="_blank"
                        rel="me noopener noreferrer"
                        aria-describedby="new-tab-note"
                        className="tui-link-chip tui-link-chip-block"
                      >
                        x
                      </a>
                      <a
                        href="https://www.instagram.com/btuckerc.dev/"
                        target="_blank"
                        rel="me noopener noreferrer"
                        aria-describedby="new-tab-note"
                        className="tui-link-chip tui-link-chip-block"
                      >
                        instagram
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Contact
