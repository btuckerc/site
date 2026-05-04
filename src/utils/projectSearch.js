import Fuse from 'fuse.js'

const SHORT_SEARCH_TERMS = new Set(['ai', 'ml', 'ui', 'ux'])
const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'app',
  'for',
  'in',
  'of',
  'on',
  'or',
  'the',
  'to',
  'with'
])

const SEARCH_FIELDS = [
  { key: 'title', label: 'title', weight: 0.32 },
  { key: 'aliases', label: 'aliases', weight: 0.24 },
  { key: 'tags', label: 'tags', weight: 0.18 },
  { key: 'stack', label: 'stack', weight: 0.14 },
  { key: 'blurb', label: 'summary', weight: 0.1 },
  { key: 'source', label: 'source', weight: 0.08 },
  { key: 'overview', label: 'overview', weight: 0.05 },
  { key: 'features', label: 'features', weight: 0.04 },
  { key: 'verified', label: 'verification', weight: 0.03 }
]

const FUZZY_SEARCH_KEYS = new Set(['title', 'aliases', 'tags', 'stack', 'blurb'])

const SYNONYM_GROUPS = [
  ['ai', 'agent', 'agentic', 'llm', 'model', 'assistant'],
  ['automation', 'cron', 'workflow', 'schedule', 'launchagent'],
  ['dotfiles', 'chezmoi', 'mise', 'bootstrap', 'dev environment'],
  ['finance', 'finops', 'trading', 'ledger'],
  ['forecast', 'forecasting', 'weather', 'prediction'],
  ['ios', 'iphone', 'swift', 'mobile'],
  ['vision', 'computer vision', 'image', 'scanner', 'cover lookup'],
  ['music', 'spotify', 'playlist', 'audio'],
  ['github', 'public', 'repo', 'repository'],
  ['local', 'macmini', 'homelab'],
  ['job', 'career', 'application', 'hiring'],
  ['rss', 'feed', 'news', 'summarizer'],
  ['terminal', 'cli', 'shell', 'console']
]

const PROJECT_ALIAS_RULES = [
  {
    pattern: /open\s*claw|openclaw/,
    aliases: [
      'open claw',
      'personal assistant',
      'assistant runtime',
      'agent runtime',
      'memory indexing',
      'remote messaging'
    ]
  },
  {
    pattern: /hermes/,
    aliases: [
      'nous research',
      'agent deployment',
      'openclaw migration',
      'messaging gateway',
      'openrouter profiles'
    ]
  },
  {
    pattern: /webyl|comic scanner|comic cover/,
    aliases: [
      'comic scanner',
      'comic cover lookup',
      'offline image search',
      'iphone scanner',
      'mobile clip'
    ]
  },
  {
    pattern: /trivrdy|jeopardy|trivia/,
    aliases: ['trivia', 'quiz', 'jeopardy practice', 'study platform', 'answer validation']
  },
  {
    pattern: /boilerplate|ai ide|dotfiles|chezmoi/,
    aliases: ['dotfiles', 'ai ide setup', 'ai ide baseline', 'machine bootstrap', 'dev environment']
  },
  {
    pattern: /trading|xgboost|backtesting/,
    aliases: ['ml trading', 'machine learning trading', 'paper trading', 'risk controls', 'backtest']
  },
  {
    pattern: /nimbus|forecast/,
    aliases: ['weather agent', 'forecasting agent', 'daily forecast', 'weather automation']
  },
  {
    pattern: /n8n|multi agent/,
    aliases: ['n8n', 'multi agent', 'workflow automation', 'orchestration']
  },
  {
    pattern: /audio|audiobook/,
    aliases: ['audiobook', 'local audio server', 'media server', 'audio reader']
  },
  {
    pattern: /spotify|playlist|music/,
    aliases: ['spotify', 'playlist ordering', 'music analysis', 'listening preferences']
  },
  {
    pattern: /job|career|hunt/,
    aliases: ['job hunt', 'career tracking', 'application portal', 'resume workflow']
  }
]

const DEFAULT_SUGGESTIONS = [
  'agent runtime',
  'swift ios',
  'ai ide dotfiles',
  'ml trading',
  'computer vision',
  'launchagent',
  'github public',
  'macmini local'
]

const MAX_SUGGESTION_CHARS = 42
const MAX_SUGGESTION_WORDS = 5
const SEARCH_CACHE_LIMIT = 64
const MAX_FUZZY_RESULTS = 24

export const normalizeSearchText = (value = '') => {
  const text = Array.isArray(value) ? value.join(' ') : String(value ?? '')

  return text
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/['’]/g, '')
    .replace(/[^a-zA-Z0-9#+.]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

export const compactSearchText = (value = '') => normalizeSearchText(value).replace(/[^a-z0-9]+/g, '')

const fuseOptions = {
  includeScore: true,
  includeMatches: false,
  shouldSort: true,
  threshold: 0.36,
  ignoreLocation: true,
  findAllMatches: false,
  minMatchCharLength: 2,
  keys: SEARCH_FIELDS
    .filter((field) => FUZZY_SEARCH_KEYS.has(field.key))
    .map((field) => ({
      name: `search.${field.key}`,
      weight: field.weight
    }))
}

const synonymMap = SYNONYM_GROUPS.reduce((map, group) => {
  group.forEach((term) => {
    const normalizedTerm = normalizeSearchText(term)
    map.set(
      normalizedTerm,
      group
        .map(normalizeSearchText)
        .filter((alias) => alias && alias !== normalizedTerm)
    )
  })
  return map
}, new Map())

const unique = (values) => Array.from(new Set(values.filter(Boolean)))

export const tokenizeSearchQuery = (query = '') =>
  unique(
    normalizeSearchText(query)
      .split(' ')
      .map((term) => term.trim())
      .filter((term) => term && (term.length > 1 || SHORT_SEARCH_TERMS.has(term)))
      .filter((term) => !STOP_WORDS.has(term))
  )

export const expandQueryTerms = (terms) =>
  unique(
    terms.flatMap((term) => [
      term,
      ...(synonymMap.get(term) || [])
    ])
  )

const containsBoundedTerm = (value, term) => {
  if (!value || !term) return false
  return value.includes(` ${term} `)
}

const rememberCachedValue = (cache, key, value) => {
  cache.set(key, value)

  if (cache.size > SEARCH_CACHE_LIMIT) {
    cache.delete(cache.keys().next().value)
  }

  return value
}

const getProjectDateValue = (project) => {
  const fallbackDate = project.year ? `${project.year}-01-01` : '1970-01-01'
  const timestamp = new Date(project.date || project.dateModified || fallbackDate).getTime()
  return Number.isFinite(timestamp) ? timestamp : 0
}

const addAlias = (aliases, value) => {
  const normalized = normalizeSearchText(value)
  if (!normalized) return

  aliases.add(normalized)

  const compact = compactSearchText(normalized)
  if (compact && compact !== normalized) aliases.add(compact)
}

const buildAliases = (project) => {
  const aliases = new Set()
  const baseValues = [
    project.id,
    project.title,
    project.source,
    project.activity,
    project.visibility,
    project.blurb,
    ...(project.tags || []),
    ...(project.stack || [])
  ]
  const haystack = normalizeSearchText(baseValues.join(' '))

  addAlias(aliases, project.id?.replace(/[-_]/g, ' '))
  addAlias(aliases, project.title)

  baseValues.forEach((value) => addAlias(aliases, value))

  SYNONYM_GROUPS.forEach((group) => {
    if (group.some((term) => haystack.includes(normalizeSearchText(term)))) {
      group.forEach((term) => addAlias(aliases, term))
    }
  })

  PROJECT_ALIAS_RULES.forEach((rule) => {
    if (rule.pattern.test(haystack)) {
      rule.aliases.forEach((alias) => addAlias(aliases, alias))
    }
  })

  return Array.from(aliases)
}

const buildSearchRecord = (project) => {
  const aliases = buildAliases(project)
  const search = {
    title: normalizeSearchText(project.title),
    aliases: aliases.join(' '),
    tags: normalizeSearchText(project.tags || []),
    stack: normalizeSearchText(project.stack || []),
    blurb: normalizeSearchText(project.blurb),
    source: normalizeSearchText([project.source, project.activity, project.visibility]),
    overview: normalizeSearchText(project.overview),
    features: normalizeSearchText(project.features || []),
    verified: normalizeSearchText(project.verified)
  }
  const searchCompact = SEARCH_FIELDS.reduce((values, field) => {
    values[field.key] = compactSearchText(search[field.key] || '')
    return values
  }, {})
  const searchBounded = SEARCH_FIELDS.reduce((values, field) => {
    values[field.key] = ` ${search[field.key] || ''} `
    return values
  }, {})

  return {
    project,
    aliases,
    search,
    searchCompact,
    searchBounded,
    dateValue: getProjectDateValue(project)
  }
}

export const createProjectSearchIndex = (projects) => {
  const records = projects.map(buildSearchRecord)

  return {
    records,
    fuse: new Fuse(records, fuseOptions),
    searchCache: new Map(),
    suggestionCache: new Map(),
    suggestionPhrases: buildSuggestionPhrases(records)
  }
}

const createCandidate = (record) => ({
  project: record.project,
  dateValue: record.dateValue,
  score: 0,
  fuzzyScore: 0,
  exactScore: 0,
  matchedFields: new Set(),
  matchedOriginalTerms: new Set(),
  matchedExpandedTerms: new Set()
})

const addCandidateScore = (candidates, record, score, fields = [], terms = [], originalTerms = []) => {
  if (score <= 0) return

  const id = record.project.id
  const candidate = candidates.get(id) || createCandidate(record)
  candidate.score += score
  fields.forEach((field) => candidate.matchedFields.add(field))
  terms.forEach((term) => candidate.matchedExpandedTerms.add(term))
  originalTerms.forEach((term) => candidate.matchedOriginalTerms.add(term))
  candidates.set(id, candidate)
}

const fieldLabelForFuseMatch = (key = '') => {
  const keyName = key.replace(/^search\./, '')
  return SEARCH_FIELDS.find((field) => field.key === keyName)?.label || keyName
}

const scoreExactRecord = (record, queryContext) => {
  const {
    normalizedQuery,
    compactQuery,
    originalTerms,
    expandedTermMeta
  } = queryContext
  const result = createCandidate(record)

  SEARCH_FIELDS.forEach((field) => {
    const value = record.search[field.key] || ''
    const compactValue = record.searchCompact[field.key] || ''
    const boundedValue = record.searchBounded[field.key] || ''
    let fieldScore = 0

    if (normalizedQuery.length >= 2 && value.includes(normalizedQuery)) {
      fieldScore += field.weight * 28
      result.matchedFields.add(field.label)
      originalTerms.forEach((term) => {
        if (value.includes(term)) result.matchedOriginalTerms.add(term)
      })
    }

    if (compactQuery.length >= 3 && compactValue.includes(compactQuery)) {
      fieldScore += field.weight * 20
      result.matchedFields.add(field.label)
      originalTerms.forEach((term) => {
        if (compactValue.includes(compactSearchText(term))) result.matchedOriginalTerms.add(term)
      })
    }

    expandedTermMeta.forEach(({ term, compactTerm, isOriginalTerm }) => {
      const termWeight = isOriginalTerm ? 1 : 0.42

      if (containsBoundedTerm(boundedValue, term)) {
        fieldScore += field.weight * 10 * termWeight
        result.matchedFields.add(field.label)
        result.matchedExpandedTerms.add(term)
        if (isOriginalTerm) result.matchedOriginalTerms.add(term)
      } else if (term.length >= 3 && value.includes(term)) {
        fieldScore += field.weight * 5.5 * termWeight
        result.matchedFields.add(field.label)
        result.matchedExpandedTerms.add(term)
        if (isOriginalTerm) result.matchedOriginalTerms.add(term)
      } else if (compactTerm.length >= 4 && compactValue.includes(compactTerm)) {
        fieldScore += field.weight * 4.5 * termWeight
        result.matchedFields.add(field.label)
        result.matchedExpandedTerms.add(term)
        if (isOriginalTerm) result.matchedOriginalTerms.add(term)
      }
    })

    result.score += fieldScore
    result.exactScore += fieldScore
  })

  return result
}

export const searchProjects = (index, query) => {
  const normalizedQuery = normalizeSearchText(query)
  const cachedResults = index.searchCache.get(normalizedQuery)
  if (cachedResults) return cachedResults

  const originalTerms = tokenizeSearchQuery(normalizedQuery)

  if (!normalizedQuery || originalTerms.length === 0) {
    return rememberCachedValue(index.searchCache, normalizedQuery, index.records.map((record) => ({
      project: record.project,
      score: 0,
      searchMeta: null
    })))
  }

  const expandedTerms = expandQueryTerms(originalTerms)
  const originalTermSet = new Set(originalTerms)
  const compactQuery = compactSearchText(normalizedQuery)
  const expandedTermMeta = expandedTerms.map((term) => ({
    term,
    compactTerm: compactSearchText(term),
    isOriginalTerm: originalTermSet.has(term)
  }))
  const fuzzyQueries = unique([normalizedQuery, ...originalTerms]).filter(
    (term) => term.length > 1 || SHORT_SEARCH_TERMS.has(term)
  )
  const candidates = new Map()

  fuzzyQueries.forEach((fuzzyQuery) => {
    const queryIsFullPhrase = fuzzyQuery === normalizedQuery
    const queryIsOriginal = originalTerms.includes(fuzzyQuery)
    const weight = queryIsFullPhrase ? 9 : queryIsOriginal ? 5 : 2.1

    index.fuse.search(fuzzyQuery, { limit: MAX_FUZZY_RESULTS }).forEach((hit) => {
      const quality = Math.max(0, 1 - (hit.score ?? 1))
      const fields = (hit.matches || []).map((match) => fieldLabelForFuseMatch(match.key))
      const score = quality * weight
      const originalMatches = queryIsOriginal ? [fuzzyQuery] : []

      addCandidateScore(candidates, hit.item, score, fields, [fuzzyQuery], originalMatches)

      const candidate = candidates.get(hit.item.project.id)
      if (candidate) candidate.fuzzyScore += score
    })
  })

  index.records.forEach((record) => {
    const exactCandidate = scoreExactRecord(record, {
      normalizedQuery,
      compactQuery,
      originalTerms,
      expandedTermMeta
    })
    addCandidateScore(
      candidates,
      record,
      exactCandidate.score,
      Array.from(exactCandidate.matchedFields),
      Array.from(exactCandidate.matchedExpandedTerms),
      Array.from(exactCandidate.matchedOriginalTerms)
    )

    const candidate = candidates.get(record.project.id)
    if (candidate) candidate.exactScore += exactCandidate.exactScore
  })

  const minimumOriginalMatches =
    originalTerms.length <= 2 ? originalTerms.length : Math.ceil(originalTerms.length * 0.75)

  const results = Array.from(candidates.values())
    .map((candidate) => {
      const matchedOriginalCount = candidate.matchedOriginalTerms.size
      const coverage = matchedOriginalCount / originalTerms.length
      const featuredBoost = (candidate.project.featured || 0) * 0.06
      const dateBoost = candidate.dateValue / 100000000000000
      const score = candidate.score + coverage * 10 + featuredBoost + dateBoost

      return {
        project: candidate.project,
        dateValue: candidate.dateValue,
        score,
        searchMeta: {
          matchedFields: Array.from(candidate.matchedFields).slice(0, 4),
          matchedTerms: Array.from(candidate.matchedOriginalTerms),
          expandedTerms: Array.from(candidate.matchedExpandedTerms),
          coverage,
          exactScore: candidate.exactScore,
          fuzzyScore: candidate.fuzzyScore
        }
      }
    })
    .filter((result) => {
      const matchedOriginalCount = result.searchMeta.matchedTerms.length
      const exactScore = result.searchMeta.exactScore
      const fuzzyScore = result.searchMeta.fuzzyScore

      if (originalTerms.length === 1) {
        return exactScore > 0 || fuzzyScore >= 2.2
      }

      return (
        (matchedOriginalCount >= minimumOriginalMatches && exactScore >= 2) ||
        (matchedOriginalCount >= minimumOriginalMatches && fuzzyScore >= 5 && result.score >= 14)
      )
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      const featuredDelta = (b.project.featured || 0) - (a.project.featured || 0)
      if (featuredDelta !== 0) return featuredDelta
      return b.dateValue - a.dateValue
    })

  return rememberCachedValue(index.searchCache, normalizedQuery, results)
}

const collectSuggestionPhrase = (phrases, label, sourceWeight = 1) => {
  const normalized = normalizeSearchText(label)
  if (!normalized || STOP_WORDS.has(normalized)) return
  if (normalized.length < 3 && !SHORT_SEARCH_TERMS.has(normalized)) return
  if (!normalized.includes(' ') && normalized.length > 22) return
  if (normalized.length > MAX_SUGGESTION_CHARS) return
  if (normalized.split(' ').length > MAX_SUGGESTION_WORDS) return

  const existing = phrases.get(normalized)
  phrases.set(normalized, {
    label: normalized,
    score: (existing?.score || 0) + sourceWeight
  })
}

function buildSuggestionPhrases(records) {
  const phrases = new Map()

  DEFAULT_SUGGESTIONS.forEach((suggestion) => {
    collectSuggestionPhrase(phrases, suggestion, 8)
  })

  records.forEach((record) => {
    collectSuggestionPhrase(phrases, record.project.title, (record.project.featured || 0) / 2)
    ;(record.project.tags || []).forEach((tag) => collectSuggestionPhrase(phrases, tag, 3))
    ;(record.project.stack || []).forEach((tech) => collectSuggestionPhrase(phrases, tech, 2))
    record.aliases.forEach((alias) => collectSuggestionPhrase(phrases, alias, 1.4))
  })

  return Array.from(phrases.values()).map((suggestion) => ({
    ...suggestion,
    normalizedLabel: suggestion.label,
    compactLabel: compactSearchText(suggestion.label),
    boundedLabel: ` ${suggestion.label} `
  }))
}

export const getProjectSearchSuggestions = (index, query = '', limit = 8) => {
  const normalizedQuery = normalizeSearchText(query)
  const queryTerms = tokenizeSearchQuery(normalizedQuery)
  const compactQuery = compactSearchText(normalizedQuery)
  const cacheKey = `${normalizedQuery || '__default__'}:${limit}`

  if (index.suggestionCache?.has(cacheKey)) {
    return index.suggestionCache.get(cacheKey)
  }

  const suggestions = (index.suggestionPhrases || buildSuggestionPhrases(index.records))
    .map((suggestion) => {
      const normalizedLabel = suggestion.normalizedLabel
      const compactLabel = suggestion.compactLabel
      let score = suggestion.score
      let matchesQuery = false

      if (!normalizedQuery) return { ...suggestion, score }

      if (normalizedLabel.startsWith(normalizedQuery)) {
        score += 18
        matchesQuery = true
      }
      if (normalizedLabel.includes(normalizedQuery)) {
        score += 10
        matchesQuery = true
      }
      if (compactQuery && compactLabel.includes(compactQuery)) {
        score += 8
        matchesQuery = true
      }

      queryTerms.forEach((term) => {
        if (containsBoundedTerm(suggestion.boundedLabel, term)) {
          score += 7
          matchesQuery = true
        } else if (normalizedLabel.includes(term)) {
          score += 4
          matchesQuery = true
        }
      })

      return {
        ...suggestion,
        matchesQuery,
        score
      }
    })
    .filter((suggestion) => {
      if (!normalizedQuery) return DEFAULT_SUGGESTIONS.includes(suggestion.label)
      return suggestion.matchesQuery && suggestion.score > 4
    })
    .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label))
    .slice(0, limit)

  return rememberCachedValue(index.suggestionCache, cacheKey, suggestions)
}

export const getSearchHighlightTerms = (query = '') =>
  tokenizeSearchQuery(query).filter((term) => term.length >= 3)
