import { useState } from "react";
import { Helmet } from "react-helmet-async";
import ContactForm from "../components/ContactForm";
import CloseButton from "../components/CloseButton";

const Contact = () => {
  const [isEmailExpanded, setIsEmailExpanded] = useState(true);
  const [isLinksExpanded, setIsLinksExpanded] = useState(true);

  return (
    <>
      <Helmet>
        <title>Contact Tucker Craig - Applied AI & Systems</title>
        <meta
          name="description"
          content="Get in touch with Tucker Craig about applied AI tools, agent systems, infrastructure work, or project ideas."
        />
        <meta property="og:title" content="Contact Tucker Craig" />
        <meta
          property="og:description"
          content="Reach out about applied AI tools, agent systems, infrastructure work, or project ideas."
        />
        <meta property="og:url" content="https://btuckerc.dev/contact" />
        <link rel="canonical" href="https://btuckerc.dev/contact" />
      </Helmet>
      <div className="tui-page-shell min-h-svh pt-20 pb-28 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="tui-page-header mb-6 relative">
            <div className="absolute top-0 left-0">
              <CloseButton />
            </div>
            <div className="text-center">
              <h1 className="tui-page-title text-xl font-bold text-fg font-mono">
                <span className="text-accent">[</span> contact{" "}
                <span className="text-accent">]</span>
              </h1>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <div className="tui-panel tui-contact-panel border border-line bg-card-bg p-5 font-mono">
                <div className="space-y-4 text-base">
                  <div>
                    <button
                      type="button"
                      onClick={() => setIsEmailExpanded(!isEmailExpanded)}
                      aria-expanded={isEmailExpanded}
                      className="text-accent mb-2 font-semibold flex items-center gap-2 hover:text-fg transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                    >
                      <span>{isEmailExpanded ? "▼" : "▶"}</span>
                      <span>email</span>
                    </button>
                    {isEmailExpanded && (
                      <div className="pl-3">
                        <a
                          href="mailto:hello@btuckerc.dev"
                          className="tui-link-chip tui-contact-link"
                        >
                          hello@btuckerc.dev
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-line pt-4">
                    <button
                      type="button"
                      onClick={() => setIsLinksExpanded(!isLinksExpanded)}
                      aria-expanded={isLinksExpanded}
                      className="text-accent mb-3 font-semibold flex items-center gap-2 hover:text-fg transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                    >
                      <span>{isLinksExpanded ? "▼" : "▶"}</span>
                      <span>links</span>
                    </button>
                    {isLinksExpanded && (
                      <div className="pl-3 space-y-2">
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
                          href="https://x.com/btuckerc"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="tui-link-chip tui-link-chip-block tui-contact-link"
                        >
                          twitter →
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
