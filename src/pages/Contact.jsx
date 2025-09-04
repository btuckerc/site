import { motion } from 'framer-motion'
import ContactForm from '../components/ContactForm'
import CloseButton from '../components/CloseButton'

const Contact = () => {
  const contactMethods = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Email',
      subtitle: 'hello@tuckercraig.dev',
      description: 'Drop me a line anytime'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      title: 'LinkedIn',
      subtitle: 'Connect with me',
      description: 'Professional networking'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      ),
      title: 'GitHub',
      subtitle: 'View my code',
      description: 'Open source contributions'
    }
  ]

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 relative"
        >
          <div className="absolute top-0 right-4">
            <CloseButton />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-fg mb-4">
            <span className="text-accent font-mono">[</span> Contact <span className="text-accent font-mono">]</span>
          </h1>
          <p className="text-muted max-w-2xl mx-auto">
            Ready to start a conversation? Whether you have a project in mind, want to collaborate, 
            or just want to say hello, I'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Methods */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
            className="space-y-6"
            aria-labelledby="contact-methods-heading"
          >
            <h2 
              id="contact-methods-heading"
              className="text-xl font-bold text-fg mb-6"
            >
              <span className="text-accent">▸</span> Get In Touch
            </h2>
            
            <nav aria-label="Contact methods">
              <ul className="space-y-4">
                {contactMethods.map((method, index) => (
                  <motion.li
                    key={method.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.05, duration: 0.3, ease: "easeOut" }}
                  >
                    <div className="card p-4 hover:bg-accent/5 transition-colors">
                      <div className="flex items-start gap-4">
                        <div 
                          className="p-2 bg-accent/10 border border-accent/20 text-accent flex-shrink-0"
                          aria-hidden="true"
                        >
                          {method.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-fg">{method.title}</h3>
                          <p className="text-accent text-sm font-medium">{method.subtitle}</p>
                          <p className="text-muted text-xs mt-1">{method.description}</p>
                        </div>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <motion.aside
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3, ease: "easeOut" }}
              className="card p-6"
              aria-labelledby="response-time-heading"
            >
              <h3 
                id="response-time-heading"
                className="font-semibold text-fg mb-3"
              >
                <span className="text-accent">▸</span> Response Time
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                I typically respond to messages within 24-48 hours. For urgent matters, 
                feel free to reach out on LinkedIn for a quicker response.
              </p>
            </motion.aside>
          </motion.section>

          {/* Contact Form */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
            className="lg:col-span-2"
            aria-labelledby="contact-form-heading"
          >
            <h2 
              id="contact-form-heading" 
              className="sr-only"
            >
              Contact Form
            </h2>
            <ContactForm />
          </motion.section>
        </div>

        {/* Additional CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4, ease: "easeOut" }}
          className="text-center mt-16"
        >
          <div className="card p-8">
            <h3 className="text-xl font-bold text-fg mb-4">
              <span className="text-accent">▸</span> Let's Build Something Great Together
            </h3>
            <p className="text-muted max-w-2xl mx-auto">
              Whether it's a new project, collaboration opportunity, or just a chat about technology, 
              I'm always excited to connect with fellow creators and innovators.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Contact