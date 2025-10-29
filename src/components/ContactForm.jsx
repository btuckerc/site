import { useState, useRef, useEffect } from 'react'
import { performSpamCheck, recordSubmission } from '../utils/spamFilter'
import { sendEmail } from '../utils/emailService'

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    website: '' // Honeypot field
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [isExpanded, setIsExpanded] = useState(true)
  const formStartTime = useRef(Date.now())
  
  // Reset form start time when form is expanded
  useEffect(() => {
    if (isExpanded) {
      formStartTime.current = Date.now()
    }
  }, [isExpanded])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'name required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'email required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'invalid email format'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'message required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'message too short (min 10 chars)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Clear previous errors
    setErrors({})
    
    // Basic validation
    if (!validateForm()) {
      return
    }

    // Perform spam check
    const spamCheck = performSpamCheck(formData, formStartTime.current)
    if (spamCheck.isSpam) {
      setErrors({ 
        general: spamCheck.errors[0] || 'spam detected'
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      // Send email via configured service
      await sendEmail({
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim()
      })
      
      // Record submission for rate limiting
      recordSubmission()
      
      setSubmitStatus('success')
      setFormData({ name: '', email: '', message: '', website: '' })
      formStartTime.current = Date.now() // Reset for next submission
      
      setTimeout(() => setSubmitStatus(null), 5000)
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
      setErrors({ 
        general: error.message || 'failed to send message. please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({ name: '', email: '', message: '', website: '' })
    setErrors({})
    setSubmitStatus(null)
    formStartTime.current = Date.now()
  }

  return (
    <div className="border border-line bg-card-bg p-5 font-mono">
      <div className="mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-accent text-base mb-2 font-semibold flex items-center gap-2 hover:text-fg transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
        >
          <span>{isExpanded ? '▼' : '▶'}</span>
          <span>send message</span>
        </button>
      </div>

      {isExpanded && (
        <>
          {submitStatus === 'success' ? (
            <div className="py-8 text-center">
              <div className="text-accent text-3xl mb-3">✓</div>
              <div className="text-fg text-base mb-2">message sent</div>
              <div className="text-muted text-sm mb-4">i'll get back to you soon</div>
              <button
                onClick={resetForm}
                className="text-base text-accent hover:text-fg transition-colors"
              >
                send another →
              </button>
            </div>
          ) : submitStatus === 'error' ? (
            <div className="py-8 text-center">
              <div className="text-red-500 text-3xl mb-3">✗</div>
              <div className="text-fg text-base mb-2">send failed</div>
              <div className="text-muted text-sm mb-4">
                {errors.general || 'please try again later'}
              </div>
              <button
                onClick={resetForm}
                className="text-base text-accent hover:text-fg transition-colors"
              >
                try again →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot field - hidden from users, bots will fill it */}
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                tabIndex="-1"
                autoComplete="off"
                style={{
                  position: 'absolute',
                  left: '-9999px',
                  width: '1px',
                  height: '1px',
                  overflow: 'hidden'
                }}
                aria-hidden="true"
              />
              
              {errors.general && (
                <div className="p-3 bg-red-500/10 border border-red-500 text-red-500 text-sm">
                  {errors.general}
                </div>
              )}
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-base text-muted mb-2">
                    name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 bg-bg border ${
                      errors.name ? 'border-red-500' : 'border-line'
                    } focus:border-accent focus:outline-none transition-colors text-fg text-base`}
                    placeholder="your name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-base text-muted mb-2">
                    email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 bg-bg border ${
                      errors.email ? 'border-red-500' : 'border-line'
                    } focus:border-accent focus:outline-none transition-colors text-fg text-base`}
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-base text-muted mb-2">
                  message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={2}
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-bg border ${
                    errors.message ? 'border-red-500' : 'border-line'
                  } focus:border-accent focus:outline-none transition-colors resize-vertical text-fg text-base`}
                  placeholder="your message here..."
                  style={{ minHeight: '5rem' }}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-accent/10 border border-accent text-accent hover:bg-accent hover:text-bg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-base font-medium"
                >
                  {isSubmitting ? 'sending...' : 'send →'}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-3 border border-line text-muted hover:text-fg hover:border-accent transition-colors text-base"
                >
                  reset
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  )
}

export default ContactForm
