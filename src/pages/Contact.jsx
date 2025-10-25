import ContactForm from '../components/ContactForm'
import CloseButton from '../components/CloseButton'

const Contact = () => {
  return (
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
                  <div className="text-accent mb-2 font-semibold">▸ email</div>
                  <div className="pl-3">
                    <a 
                      href="mailto:hello@tuckercraig.dev" 
                      className="text-muted hover:text-accent transition-colors"
                    >
                      hello@tuckercraig.dev
                    </a>
                  </div>
                </div>
                
                <div className="border-t border-line pt-4">
                  <div className="text-accent mb-3 font-semibold">▸ links</div>
                  <div className="pl-3 space-y-2">
                    <a 
                      href="https://linkedin.com/in/tuckercraig" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block px-3 py-2 bg-accent/10 border border-accent/30 text-accent hover:bg-accent hover:text-bg transition-colors"
                    >
                      linkedin →
                    </a>
                    <a 
                      href="https://github.com/tuckercraig" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block px-3 py-2 bg-accent/10 border border-accent/30 text-accent hover:bg-accent hover:text-bg transition-colors"
                    >
                      github →
                    </a>
                    <a 
                      href="https://twitter.com/tuckercraig" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block px-3 py-2 bg-accent/10 border border-accent/30 text-accent hover:bg-accent hover:text-bg transition-colors"
                    >
                      twitter →
                    </a>
                  </div>
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
  )
}

export default Contact
