// Strict RFC 9110 Accept header negotiation for text/markdown.
// Returns true ONLY when text/markdown is explicitly requested with a valid
// RFC 9110 q-value > 0 and its quality is >= text/html's effective quality
// (taking text/html > text/* > */* specificity into account).
const QVALUE_RE = /^(?:0(?:\.\d{0,3})?|1(?:\.0{0,3})?)$/

function splitHeaderList(header, delimiter) {
  const parts = []
  let current = ''
  let inQuotes = false
  let escaped = false

  for (let i = 0; i < header.length; i += 1) {
    const ch = header[i]
    if (escaped) {
      current += ch
      escaped = false
      continue
    }
    if (ch === '\\' && inQuotes) {
      current += ch
      escaped = true
      continue
    }
    if (ch === '"') {
      inQuotes = !inQuotes
      current += ch
      continue
    }
    if (ch === delimiter && !inQuotes) {
      parts.push(current)
      current = ''
      continue
    }
    current += ch
  }
  parts.push(current)
  return parts
}

function unquoteParamValue(raw) {
  if (raw.length >= 2 && raw.startsWith('"') && raw.endsWith('"')) {
    return raw.slice(1, -1).replace(/\\(.)/g, '$1')
  }
  return raw
}

export function wantsMarkdown(acceptHeader) {
  if (!acceptHeader || typeof acceptHeader !== 'string') return false

  let bestMdSpec = -1
  let bestMdQ = -1
  let bestHtmlSpec = -1
  let bestHtmlQ = -1

  for (const rawRange of splitHeaderList(acceptHeader, ',')) {
    const parts = splitHeaderList(rawRange.trim(), ';').map((part) => part.trim())
    if (!parts[0]) continue

    const mediaType = parts[0].toLowerCase()
    if (
      mediaType !== 'text/markdown' &&
      mediaType !== 'text/html' &&
      mediaType !== 'text/*' &&
      mediaType !== '*/*'
    ) {
      continue
    }

    let q = 1
    let validQ = true
    let compatible = true
    let matchedParams = 0

    for (let i = 1; i < parts.length; i += 1) {
      const eqIndex = parts[i].indexOf('=')
      if (eqIndex === -1) continue
      const key = parts[i].slice(0, eqIndex).trim().toLowerCase()
      const rawValue = parts[i].slice(eqIndex + 1).trim()
      if (key === 'q') {
        if (!QVALUE_RE.test(rawValue)) {
          validQ = false
        } else {
          q = Number(rawValue)
        }
        break
      }
      if (key === 'charset') {
        const charset = unquoteParamValue(rawValue).trim().toLowerCase()
        if (charset === 'utf-8' || charset === 'utf8') {
          matchedParams += 1
        } else {
          compatible = false
          break
        }
      } else {
        // Offered representations have no media-type parameters other than charset=utf-8.
        compatible = false
        break
      }
    }
    if (!validQ || !compatible) continue

    if (mediaType === 'text/markdown') {
      const spec = 300 + matchedParams
      if (spec > bestMdSpec || (spec === bestMdSpec && q > bestMdQ)) {
        bestMdSpec = spec
        bestMdQ = q
      }
    } else {
      const baseSpec = mediaType === 'text/html' ? 300 : mediaType === 'text/*' ? 200 : 100
      const spec = baseSpec + matchedParams
      if (spec > bestHtmlSpec || (spec === bestHtmlSpec && q > bestHtmlQ)) {
        bestHtmlSpec = spec
        bestHtmlQ = q
      }
    }
  }

  if (bestMdQ <= 0) return false
  if (bestHtmlSpec < 0) return true
  return bestMdQ >= bestHtmlQ
}
