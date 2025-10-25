import { useState } from 'react'

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

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
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log('Form submitted:', formData)
      
      setSubmitStatus('success')
      setFormData({ name: '', email: '', message: '' })
      
      setTimeout(() => setSubmitStatus(null), 5000)
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({ name: '', email: '', message: '' })
    setErrors({})
    setSubmitStatus(null)
  }

  return (
    <div className="border border-line bg-card-bg p-5 font-mono">
      <div className="mb-4">
        <div className="text-accent text-base mb-2 font-semibold">▸ send message</div>
      </div>

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
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
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
              rows={6}
              value={formData.message}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-bg border ${
                errors.message ? 'border-red-500' : 'border-line'
              } focus:border-accent focus:outline-none transition-colors resize-vertical text-fg text-base`}
              placeholder="your message here..."
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
    </div>
  )
}

export default ContactForm
