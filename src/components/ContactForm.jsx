import { useEffect, useState, useRef } from 'react'
import { performSpamCheck, recordSubmission } from '../utils/spamFilter'
import { sendEmail } from '../utils/emailService'

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    website: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isInteractive, setIsInteractive] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  useEffect(() => {
    setIsInteractive(true)
  }, [])
  const [validationTick, setValidationTick] = useState(0)
  const formStartTime = useRef(Date.now())
  const nameInputRef = useRef(null)
  const emailInputRef = useRef(null)
  const messageInputRef = useRef(null)
  const pendingFocusFieldRef = useRef(null)
  const statusHeadingRef = useRef(null)
  const previousStatusRef = useRef(null)

  useEffect(() => {
    if (!validationTick || !pendingFocusFieldRef.current) return
    const field = pendingFocusFieldRef.current
    pendingFocusFieldRef.current = null
    if (field === 'name') nameInputRef.current?.focus()
    else if (field === 'email') emailInputRef.current?.focus()
    else if (field === 'message') messageInputRef.current?.focus()
  }, [validationTick])

  useEffect(() => {
    if (submitStatus === 'success' || submitStatus === 'error') {
      statusHeadingRef.current?.focus()
    } else if (previousStatusRef.current !== null && submitStatus === null) {
      nameInputRef.current?.focus()
    }
    previousStatusRef.current = submitStatus
  }, [submitStatus])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'name required'
    }

    const emailValue = formData.email.trim()
    const nativeEmailInvalid = Boolean(emailInputRef.current?.validity?.typeMismatch)
    if (!emailValue) {
      newErrors.email = 'email required'
    } else if (nativeEmailInvalid || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      newErrors.email = "that email doesn't look right"
    }

    if (!formData.message.trim()) {
      newErrors.message = 'message required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'give me at least 10 characters'
    }

    setErrors(newErrors)
    if (newErrors.name) {
      pendingFocusFieldRef.current = 'name'
      setValidationTick((n) => n + 1)
    } else if (newErrors.email) {
      pendingFocusFieldRef.current = 'email'
      setValidationTick((n) => n + 1)
    } else if (newErrors.message) {
      pendingFocusFieldRef.current = 'message'
      setValidationTick((n) => n + 1)
    }
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setErrors({})

    if (!validateForm()) {
      return
    }

    const spamCheck = performSpamCheck(formData, formStartTime.current)
    if (spamCheck.isSpam) {
      setErrors({
        general: spamCheck.errors[0] || 'spam detected'
      })
      return
    }

    setIsSubmitting(true)

    try {
      await sendEmail({
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim()
      })

      recordSubmission()

      setSubmitStatus('success')
      setFormData({ name: '', email: '', message: '', website: '' })
      formStartTime.current = Date.now()
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

  const fieldClassName = (hasError) => `tui-input w-full px-3 py-2 text-sm text-fg ${
    hasError ? 'tui-form-error-border' : ''
  }`

  return (
    <div className="tui-panel tui-contact-panel h-full p-5 sm:p-7 font-mono">
      <div className="mb-5">
        <h2 className="case-study-kicker font-semibold">send message</h2>
      </div>

      {submitStatus === 'success' ? (
        <div className="py-8 text-center" role="status">
          <div className="text-accent text-3xl mb-3" aria-hidden="true">✓</div>
          <div ref={statusHeadingRef} tabIndex={-1} className="text-fg text-base mb-2">message sent</div>
          <div className="text-muted text-sm mb-4">i&apos;ll read it and get back to you</div>
          <button
            type="button"
            onClick={resetForm}
            className="tui-link-chip"
          >
            send another
          </button>
        </div>
      ) : submitStatus === 'error' ? (
        <div className="py-8 text-center" role="alert">
          <div className="tui-form-error text-3xl mb-3" aria-hidden="true">✗</div>
          <div ref={statusHeadingRef} tabIndex={-1} className="text-fg text-base mb-2">send failed</div>
          <div className="text-muted text-sm mb-4">
            {errors.general || 'please try again later'}
          </div>
          <button
            type="button"
            onClick={() => setSubmitStatus(null)}
            className="tui-link-chip"
          >
            try again
          </button>
        </div>
      ) : (
        <form method="post" onSubmit={handleSubmit} noValidate className="space-y-4">
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
            <div role="alert" className="tui-form-error-banner p-3 border text-sm">
              {errors.general}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm text-muted mb-2">
                name *
              </label>
              <input
                ref={nameInputRef}
                type="text"
                id="name"
                name="name"
                autoComplete="name"
                required
                disabled={isSubmitting || !isInteractive}
                aria-required="true"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'contact-name-error' : undefined}
                value={formData.name}
                onChange={handleChange}
                className={fieldClassName(errors.name)}
                placeholder="your name"
              />
              {errors.name && (
                <p id="contact-name-error" className="tui-form-error text-xs mt-1.5">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm text-muted mb-2">
                email *
              </label>
              <input
                ref={emailInputRef}
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                required
                disabled={isSubmitting || !isInteractive}
                aria-required="true"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'contact-email-error' : undefined}
                value={formData.email}
                onChange={handleChange}
                className={fieldClassName(errors.email)}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p id="contact-email-error" className="tui-form-error text-xs mt-1.5">{errors.email}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm text-muted mb-2">
              message *
            </label>
            <textarea
              ref={messageInputRef}
              id="message"
              name="message"
              rows={4}
              required
              disabled={isSubmitting || !isInteractive}
              aria-required="true"
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? 'contact-message-error' : undefined}
              value={formData.message}
              onChange={handleChange}
              className={`${fieldClassName(errors.message)} resize-y`}
              placeholder="what are you working on?"
              style={{ minHeight: '6.5rem' }}
            />
            {errors.message && (
              <p id="contact-message-error" className="tui-form-error text-xs mt-1.5">{errors.message}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !isInteractive}
              className="tui-action tui-contact-submit min-h-10 min-w-[10rem] px-5 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'sending...' : 'send'}
            </button>

            <button
              type="button"
              onClick={resetForm}
              disabled={isSubmitting || !isInteractive}
              className="tui-action tui-contact-secondary min-h-10 px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              reset
            </button>
          </div>
          <noscript>
            <p className="text-xs text-muted pt-1">
              JavaScript is required to use this form. Email{' '}
              <a href="mailto:btuckerc.dev@gmail.com" className="text-accent underline underline-offset-4">
                btuckerc.dev@gmail.com
              </a>{' '}
              directly.
            </p>
          </noscript>
        </form>
      )}
    </div>
  )
}

export default ContactForm
