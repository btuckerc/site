import ContactForm from "../components/ContactForm";
import PageMeta from "../components/PageMeta";

const Contact = () => {
  return (
    <>
      <PageMeta
        title="Contact — Tucker Craig"
        description="Get in touch with Tucker Craig via email, GitHub, LinkedIn, or the contact form."
        url="https://btuckerc.dev/contact"
      />
      <div className="tui-page-shell min-h-svh pb-28 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="tui-page-header mb-6">
            <div className="text-center">
              <h1 className="tui-page-title text-xl font-bold text-fg font-mono">
                <span className="text-accent">[</span> contact{" "}
                <span className="text-accent">]</span>
              </h1>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 lg:order-2">
              <ContactForm />
            </div>

            <div className="lg:col-span-1 lg:order-1">
              <div className="tui-panel tui-contact-panel border border-line bg-card-bg p-5 font-mono">
                <div className="space-y-4 text-base">
                  <div>
                    <div className="text-accent mb-2 font-semibold">email</div>
                    <a
                      href="mailto:btuckerc.dev@gmail.com"
                      className="tui-link-chip tui-contact-link"
                    >
                      btuckerc.dev@gmail.com
                    </a>
                  </div>

                  <div className="border-t border-line pt-4">
                    <div className="text-accent mb-3 font-semibold">links</div>
                    <div className="space-y-2">
                      <a
                        href="https://www.linkedin.com/in/tucker-craig/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tui-link-chip tui-link-chip-block tui-contact-link"
                      >
                        linkedin →
                      </a>
                      <a
                        href="https://github.com/btuckerc"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tui-link-chip tui-link-chip-block tui-contact-link"
                      >
                        github →
                      </a>
                      <a
                        href="https://x.com/btuckercdev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tui-link-chip tui-link-chip-block tui-contact-link"
                      >
                        x →
                      </a>
                      <a
                        href="https://www.instagram.com/btuckerc.dev/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tui-link-chip tui-link-chip-block tui-contact-link"
                      >
                        instagram →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
