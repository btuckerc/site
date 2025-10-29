import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import ContactForm from '../components/ContactForm'
import CloseButton from '../components/CloseButton'

const Contact = () => {
  const [isEmailExpanded, setIsEmailExpanded] = useState(true)
  const [isLinksExpanded, setIsLinksExpanded] = useState(true)

  return (
    <>
      <Helmet>
        <title>Contact Tucker Craig - FinOps Engineer & Full-Stack Developer</title>
        <meta name="description" content="Get in touch with Tucker Craig - FinOps Engineer at Box. Reach out via email or connect on LinkedIn, GitHub, Twitter, Spotify, and SoundCloud." />
        <meta property="og:title" content="Contact Tucker Craig" />
        <meta property="og:description" content="Connect with Tucker Craig - FinOps Engineer at Box. Email, LinkedIn, GitHub, and social media links available." />
        <meta property="og:url" content="https://btuckerc.dev/contact" />
        <link rel="canonical" href="https://btuckerc.dev/contact" />
      </Helmet>
      <div className="min-h-screen pt-20 pb-24 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 relative">
          <div className="absolute top-0 left-0">
            <CloseButton />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-fg font-mono">
              <span className="text-accent">[</span> contact <span className="text-accent">]</span>
            </h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Contact Info */}
          <div className="lg:col-span-1">
            <div className="border border-line bg-card-bg p-5 font-mono">
              <div className="space-y-4 text-base">
                <div>
                  <button
                    onClick={() => setIsEmailExpanded(!isEmailExpanded)}
                    className="text-accent mb-2 font-semibold flex items-center gap-2 hover:text-fg transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                  >
                    <span>{isEmailExpanded ? '▼' : '▶'}</span>
                    <span>email</span>
                  </button>
                  {isEmailExpanded && (
                    <div className="pl-3">
                      <a 
                        href="mailto:hello@tuckercraig.dev" 
                        className="text-muted hover:text-accent transition-colors"
                      >
                        hello@tuckercraig.dev
                      </a>
                    </div>
                  )}
                </div>
                
                <div className="border-t border-line pt-4">
                  <button
                    onClick={() => setIsLinksExpanded(!isLinksExpanded)}
                    className="text-accent mb-3 font-semibold flex items-center gap-2 hover:text-fg transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                  >
                    <span>{isLinksExpanded ? '▼' : '▶'}</span>
                    <span>links</span>
                  </button>
                  {isLinksExpanded && (
                    <div className="pl-3 space-y-2">
                      <a 
                        href="https://www.linkedin.com/in/tucker-craig/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block px-3 py-2 bg-accent/10 border border-accent/30 text-accent hover:bg-accent hover:text-bg transition-colors"
                      >
                        linkedin →
                      </a>
                      <a 
                        href="https://github.com/btuckerc" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block px-3 py-2 bg-accent/10 border border-accent/30 text-accent hover:bg-accent hover:text-bg transition-colors"
                      >
                        github →
                      </a>
                      <a 
                        href="http://x.com/btuckerc" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block px-3 py-2 bg-accent/10 border border-accent/30 text-accent hover:bg-accent hover:text-bg transition-colors"
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
  )
}

export default Contact
