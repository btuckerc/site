/**
 * Email service integration
 * Supports EmailJS (default) and can be extended for other services
 */

// EmailJS configuration
// Set these in your environment variables or config file
const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
  enabled: import.meta.env.VITE_EMAILJS_ENABLED === 'true'
}

/**
 * Send email using EmailJS
 */
export const sendEmailViaEmailJS = async (formData) => {
  // Only load EmailJS if it's enabled
  if (!EMAILJS_CONFIG.enabled) {
    throw new Error('EmailJS is not enabled. Please configure environment variables.')
  }

  if (!EMAILJS_CONFIG.serviceId || !EMAILJS_CONFIG.templateId || !EMAILJS_CONFIG.publicKey) {
    throw new Error('EmailJS configuration is incomplete. Please check your environment variables.')
  }

  // Dynamically import EmailJS
  const emailjs = await import('@emailjs/browser')
  
  const templateParams = {
    from_name: formData.name,
    from_email: formData.email,
    message: formData.message,
    to_email: 'hello@tuckercraig.dev', // Your email
  }

  try {
    await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      templateParams,
      EMAILJS_CONFIG.publicKey
    )
    return { success: true }
  } catch (error) {
    console.error('EmailJS error:', error)
    throw new Error('Failed to send email. Please try again later.')
  }
}

/**
 * Send email via Formspree (alternative service)
 */
export const sendEmailViaFormspree = async (formData) => {
  const formspreeEndpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT || ''
  
  if (!formspreeEndpoint) {
    throw new Error('Formspree endpoint not configured')
  }

  try {
    const response = await fetch(formspreeEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        message: formData.message,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to send email')
    }

    return { success: true }
  } catch (error) {
    console.error('Formspree error:', error)
    throw new Error('Failed to send email. Please try again later.')
  }
}

/**
 * Main email sending function
 * Tries EmailJS first, falls back to Formspree if configured
 */
export const sendEmail = async (formData) => {
  // Try EmailJS first
  if (EMAILJS_CONFIG.enabled) {
    try {
      return await sendEmailViaEmailJS(formData)
    } catch (error) {
      console.warn('EmailJS failed, trying Formspree:', error)
      // Fall through to try Formspree
    }
  }

  // Try Formspree as fallback
  const formspreeEndpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT
  if (formspreeEndpoint) {
    return await sendEmailViaFormspree(formData)
  }

  // If neither is configured, throw error
  throw new Error('No email service configured. Please set up EmailJS or Formspree.')
}

