/**
 * Spam protection utilities for contact form
 */

// Common spam keywords/phrases
const SPAM_KEYWORDS = [
  'viagra', 'cialis', 'casino', 'poker', 'lottery', 'winner', 'congratulations',
  'click here', 'buy now', 'limited time', 'act now', 'urgent', 'immediate',
  'make money', 'work from home', 'get rich', 'free money', 'no investment',
  'weight loss', 'lose weight', 'diet pills', 'miracle', 'guaranteed',
  'credit card', 'loan', 'debt', 'consolidation', 'refinance',
  'enlarge', 'penis', 'sex', 'porn', 'adult', 'dating',
  'nigerian prince', 'inheritance', 'lottery win', 'prize',
  'pharmacy', 'prescription', 'medication', 'drugs',
  'seo service', 'backlink', 'rank higher', 'google ranking',
  'crypto', 'bitcoin', 'investment opportunity', 'trading',
  'click this link', 'visit our website', 'special offer'
]

// Suspicious email patterns
const SUSPICIOUS_EMAIL_PATTERNS = [
  /\d{10,}@/, // Too many numbers
  /[a-z]{1,2}\d{6,}@/, // Short letters + many numbers
  /temp|test|fake|spam/i // Suspicious words
]

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  maxSubmissions: 3, // Max submissions per time window
  timeWindow: 60 * 60 * 1000, // 1 hour in milliseconds
  storageKey: 'contact_form_submissions'
}

/**
 * Check if text contains spam keywords
 */
export const containsSpamKeywords = (text) => {
  if (!text) return false
  
  const lowerText = text.toLowerCase()
  return SPAM_KEYWORDS.some(keyword => lowerText.includes(keyword.toLowerCase()))
}

/**
 * Check if email looks suspicious
 */
export const isSuspiciousEmail = (email) => {
  if (!email) return false
  
  const lowerEmail = email.toLowerCase()
  
  // Check for suspicious patterns
  for (const pattern of SUSPICIOUS_EMAIL_PATTERNS) {
    if (pattern.test(lowerEmail)) {
      return true
    }
  }
  
  // Check for spam keywords in email
  if (containsSpamKeywords(lowerEmail)) {
    return true
  }
  
  return false
}

/**
 * Check rate limiting (client-side using localStorage)
 */
export const checkRateLimit = () => {
  try {
    const stored = localStorage.getItem(RATE_LIMIT_CONFIG.storageKey)
    if (!stored) {
      return { allowed: true, remaining: RATE_LIMIT_CONFIG.maxSubmissions }
    }
    
    const submissions = JSON.parse(stored)
    const now = Date.now()
    
    // Filter out old submissions outside the time window
    const recentSubmissions = submissions.filter(
      timestamp => now - timestamp < RATE_LIMIT_CONFIG.timeWindow
    )
    
    if (recentSubmissions.length >= RATE_LIMIT_CONFIG.maxSubmissions) {
      const oldestSubmission = Math.min(...recentSubmissions)
      const timeUntilReset = RATE_LIMIT_CONFIG.timeWindow - (now - oldestSubmission)
      const minutesUntilReset = Math.ceil(timeUntilReset / (60 * 1000))
      
      return {
        allowed: false,
        remaining: 0,
        minutesUntilReset
      }
    }
    
    // Save filtered submissions back
    localStorage.setItem(RATE_LIMIT_CONFIG.storageKey, JSON.stringify(recentSubmissions))
    
    return {
      allowed: true,
      remaining: RATE_LIMIT_CONFIG.maxSubmissions - recentSubmissions.length
    }
  } catch (error) {
    // If localStorage fails, allow submission (fail open)
    console.warn('Rate limit check failed:', error)
    return { allowed: true, remaining: RATE_LIMIT_CONFIG.maxSubmissions }
  }
}

/**
 * Record a submission for rate limiting
 */
export const recordSubmission = () => {
  try {
    const stored = localStorage.getItem(RATE_LIMIT_CONFIG.storageKey)
    const submissions = stored ? JSON.parse(stored) : []
    submissions.push(Date.now())
    
    // Keep only recent submissions
    const now = Date.now()
    const recentSubmissions = submissions.filter(
      timestamp => now - timestamp < RATE_LIMIT_CONFIG.timeWindow
    )
    
    localStorage.setItem(RATE_LIMIT_CONFIG.storageKey, JSON.stringify(recentSubmissions))
  } catch (error) {
    console.warn('Failed to record submission:', error)
  }
}

/**
 * Check if form was filled too quickly (less than minimum time)
 */
export const checkFillTime = (startTime, minSeconds = 3) => {
  const fillTime = (Date.now() - startTime) / 1000
  return fillTime >= minSeconds
}

/**
 * Comprehensive spam check
 */
export const performSpamCheck = (formData, formStartTime) => {
  const errors = []
  
  // Check honeypot field (should be empty)
  if (formData.website && formData.website.trim() !== '') {
    errors.push('Spam detected: honeypot field filled')
    return { isSpam: true, errors }
  }
  
  // Check rate limiting
  const rateLimit = checkRateLimit()
  if (!rateLimit.allowed) {
    errors.push(`Rate limit exceeded. Please try again in ${rateLimit.minutesUntilReset} minute(s).`)
    return { isSpam: true, errors }
  }
  
  // Check fill time (minimum 3 seconds)
  if (!checkFillTime(formStartTime, 3)) {
    errors.push('Form filled too quickly. Please take your time.')
    return { isSpam: true, errors }
  }
  
  // Check email
  if (isSuspiciousEmail(formData.email)) {
    errors.push('Invalid email address')
    return { isSpam: true, errors }
  }
  
  // Check message for spam keywords
  if (containsSpamKeywords(formData.message)) {
    errors.push('Message contains inappropriate content')
    return { isSpam: true, errors }
  }
  
  // Check name for spam keywords
  if (containsSpamKeywords(formData.name)) {
    errors.push('Invalid name')
    return { isSpam: true, errors }
  }
  
  return { isSpam: false, errors: [] }
}

