import words from '../../data/s3-story.json'

// Editorial strings are arrays of individual space-delimited words. Structural
// arrays (sections and paragraphs) stay arrays; only word arrays become text.
export function unfoldWords(value) {
  if (Array.isArray(value)) return value.every(word => typeof word === 'string') ? value.join(' ') : value.map(unfoldWords)
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, unfoldWords(child)]))
  return value
}
export default unfoldWords(words)
