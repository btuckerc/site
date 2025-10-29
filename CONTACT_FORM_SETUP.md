# Contact Form Spam Protection Setup

This guide will help you enable the contact form with comprehensive spam protection.

## Spam Protection Features

The contact form now includes multiple layers of spam protection:

1. **Honeypot Field** - Hidden field that bots fill out (humans don't see it)
2. **Rate Limiting** - Limits submissions to 3 per hour per browser
3. **Content Filtering** - Checks for spam keywords in name, email, and message
4. **Time Validation** - Requires minimum 3 seconds to fill the form
5. **Email Pattern Detection** - Flags suspicious email addresses

## Email Service Setup

Choose one of the following email services:

### Option 1: EmailJS (Recommended - Easy Setup)

1. **Create an EmailJS account** at https://www.emailjs.com/
2. **Set up a service** (Gmail, Outlook, etc.)
3. **Create an email template** with these variables:
   - `{{from_name}}` - Sender's name
   - `{{from_email}}` - Sender's email
   - `{{message}}` - Message content
   - `{{to_email}}` - Recipient email (your email)
4. **Get your credentials**:
   - Service ID
   - Template ID
   - Public Key (API Key)
5. **Add to `.env.local`**:
   ```env
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   VITE_EMAILJS_ENABLED=true
   ```

### Option 2: Formspree (Alternative)

1. **Create a Formspree account** at https://formspree.io/
2. **Create a new form** and get the endpoint URL
3. **Add to `.env.local`**:
   ```env
   VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/your_form_id
   ```

## Installation

1. Install the EmailJS package:
   ```bash
   npm install
   ```

2. Create `.env.local` file in the root directory with your email service configuration

3. The form will automatically use the configured service

## Testing

1. Test the form with valid data - it should send successfully
2. Test spam detection:
   - Try submitting immediately (should fail - too fast)
   - Try submitting multiple times quickly (should fail - rate limit)
   - Try submitting with spam keywords (should fail)
   - Try filling the honeypot field (should fail)

## Customization

### Adjusting Rate Limits

Edit `src/utils/spamFilter.js`:
```javascript
const RATE_LIMIT_CONFIG = {
  maxSubmissions: 3, // Change this number
  timeWindow: 60 * 60 * 1000, // Change time window (milliseconds)
}
```

### Adding Spam Keywords

Edit `src/utils/spamFilter.js` and add keywords to the `SPAM_KEYWORDS` array.

### Changing Minimum Fill Time

Edit `src/components/ContactForm.jsx`:
```javascript
const spamCheck = performSpamCheck(formData, formStartTime.current)
// Change the second parameter in performSpamCheck (default is 3 seconds)
```

## Monitoring

The form will log errors to the browser console. In production, you may want to:
- Set up error tracking (e.g., Sentry)
- Monitor email service logs
- Check spam filter effectiveness

## Security Notes

- Rate limiting is client-side only (can be bypassed by clearing localStorage)
- For production, consider adding server-side validation
- EmailJS and Formspree both have built-in spam filtering
- Consider adding reCAPTCHA for additional protection if needed

## Troubleshooting

**Form not sending emails:**
- Check that environment variables are set correctly
- Check browser console for errors
- Verify email service credentials

**Too many false positives:**
- Adjust spam keyword list
- Increase minimum fill time
- Adjust rate limit settings

**Form not detecting spam:**
- Check browser console for errors
- Verify spam filter is being called
- Consider adding more spam keywords

