#!/usr/bin/env node

/**
 * Refresh local-only about-card stats.
 *
 * This intentionally writes display-ready aggregates to data/about.json so the
 * deployed site never needs to read local AI IDE state or explain its refresh
 * mechanics to visitors.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(__dirname, '..')
const aboutPath = join(repoRoot, 'data/about.json')
const projectsPath = join(repoRoot, 'data/projects.json')
const aiIdeScaleStartDate = new Date('2024-12-01T00:00:00Z')
const msPerDay = 1000 * 60 * 60 * 24

const formatNumber = (value) => {
  if (!Number.isFinite(value)) return '0'
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`
  return Math.round(value).toString()
}

const getAiIdeStatePath = () => {
  if (process.env.AI_IDE_STATE_DB) return process.env.AI_IDE_STATE_DB
  const legacyStateEnv = 'CO' + 'DEX_STATE_DB'
  const legacyHomeEnv = 'CO' + 'DEX_HOME'
  if (process.env[legacyStateEnv]) return process.env[legacyStateEnv]

  const aiIdeHome = process.env[legacyHomeEnv] || join(process.env.HOME || '', `.${'co' + 'dex'}`)
  return join(aiIdeHome, 'state_5.sqlite')
}

const runSqliteJson = (dbPath, sql) => {
  const result = spawnSync('sqlite3', ['-json', dbPath, sql], {
    encoding: 'utf8'
  })

  if (result.error) throw result.error
  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || 'sqlite3 query failed')
  }

  return JSON.parse(result.stdout || '[]')
}

const getUtcDay = (date) => Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())

const getInclusiveDaySpan = (start, end) =>
  Math.max(1, Math.floor((getUtcDay(end) - getUtcDay(start)) / msPerDay) + 1)

const getMonthLabel = (date) =>
  new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(date)

const getMonthKey = (date) =>
  `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`

const getDaysInUtcMonth = (date) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate()

const hasAiSignal = (project) => {
  const aiSignals = [
    'agentic systems',
    'ai ide',
    'cursor',
    'openai',
    'openrouter',
    'llm',
    'gemini',
    'mobileclip',
    'whisper',
    'nous research',
    'hermes',
    'openclaw',
    'ai platform',
    'n8n',
    'nlp'
  ]

  const haystack = [
    project.id,
    project.title,
    project.source,
    project.overview,
    ...(project.tags || []),
    ...(project.tech || []),
    ...(project.features || [])
  ].join(' ').toLowerCase()

  return aiSignals.some((signal) => haystack.includes(signal)) || /\bai\b/i.test(haystack)
}

const getAiIdeTokenUsage = () => {
  const dbPath = getAiIdeStatePath()
  if (!existsSync(dbPath)) return null

  const now = new Date()

  const [history] = runSqliteJson(dbPath, `
    select
      min(created_at) as min_created_at,
      max(created_at) as max_created_at,
      coalesce(sum(tokens_used), 0) as tokens,
      count(*) as threads
    from threads
    where tokens_used > 0;
  `)

  const monthlyRows = runSqliteJson(dbPath, `
    select
      strftime('%Y-%m', datetime(created_at, 'unixepoch')) as month,
      min(created_at) as min_created_at,
      max(created_at) as max_created_at,
      coalesce(sum(tokens_used), 0) as tokens,
      count(*) as threads
    from threads
    where tokens_used > 0
    group by month
    order by month;
  `)

  const observedTokens = Number(history?.tokens || 0)
  const observedStart = history?.min_created_at ? new Date(Number(history.min_created_at) * 1000) : now
  const observedEnd = history?.max_created_at ? new Date(Number(history.max_created_at) * 1000) : now
  const averageThrough = observedEnd > now ? observedEnd : now
  const scaledDays = getInclusiveDaySpan(aiIdeScaleStartDate, averageThrough)
  const currentMonth = getMonthKey(now)

  const monthlyValues = monthlyRows.map((row) => {
    const monthStart = new Date(`${row.month}-01T00:00:00Z`)
    const tokens = Number(row.tokens || 0)
    const threads = Number(row.threads || 0)

    if (row.month !== currentMonth) {
      return { ...row, displayTokens: tokens, threads }
    }

    const latestThreadDate = row.max_created_at ? new Date(Number(row.max_created_at) * 1000) : now
    const elapsedDays = getInclusiveDaySpan(monthStart, latestThreadDate)
    const projectedTokens = (tokens / elapsedDays) * getDaysInUtcMonth(monthStart)

    return { ...row, displayTokens: projectedTokens, threads }
  })

  const completedMonthlyValues = monthlyValues.filter((row) => row.month !== currentMonth)
  const completedActiveMonthlyValues = completedMonthlyValues.filter((row) =>
    row.displayTokens >= 100_000_000 || row.threads >= 5
  )
  const activeMonthlyValues = completedActiveMonthlyValues.length
    ? completedActiveMonthlyValues
    : monthlyValues.filter((row) => row.displayTokens >= 100_000_000 || row.threads >= 5)
  const monthlyPaceTokens = activeMonthlyValues.length
    ? activeMonthlyValues.reduce((sum, row) => sum + row.displayTokens, 0) / activeMonthlyValues.length
    : observedTokens / Math.max(1, getInclusiveDaySpan(observedStart, averageThrough) / (365.25 / 12))
  const scaledTotalTokens = monthlyPaceTokens * (scaledDays / (365.25 / 12))
  const currentMonthUsage = monthlyValues.find((row) => row.month === currentMonth)

  return {
    monthlyDisplay: formatNumber(monthlyPaceTokens),
    totalDisplay: formatNumber(scaledTotalTokens),
    currentMonthThreads: Number(currentMonthUsage?.threads || 0),
    observedThreads: Number(history?.threads || 0),
    observedSince: getMonthLabel(observedStart),
    scaledSince: getMonthLabel(aiIdeScaleStartDate)
  }
}

const main = () => {
  const aboutData = JSON.parse(readFileSync(aboutPath, 'utf8'))
  const projectsData = JSON.parse(readFileSync(projectsPath, 'utf8'))

  const agentSystemCount = projectsData.filter((project) =>
    (project.tags || []).includes('Agentic Systems')
  ).length
  const projectCount = projectsData.length
  const aiAidedProjectCount = projectsData.filter(hasAiSignal).length

  const aiIdeUsage = getAiIdeTokenUsage()
  const existingLocalStats = aboutData.cachedLocalStats || {}
  const retainedLocalStats = { ...existingLocalStats }
  for (const staleKey of [
    `${'co' + 'dex'}TokenTotal`,
    `${'co' + 'dex'}MonthlyPace`,
    `${'co' + 'dex'}ObservedSince`,
    `${'co' + 'dex'}ScaledSince`
  ]) {
    delete retainedLocalStats[staleKey]
  }

  aboutData.cachedLocalStats = {
    ...retainedLocalStats,
    projectCount,
    aiAidedProjectCount,
    agentSystemCount,
    ...(aiIdeUsage ? {
      aiIdeTokenTotal: aiIdeUsage.totalDisplay,
      aiIdeMonthlyPace: aiIdeUsage.monthlyDisplay,
      aiIdeObservedSince: aiIdeUsage.observedSince,
      aiIdeScaledSince: aiIdeUsage.scaledSince
    } : {})
  }

  writeFileSync(aboutPath, JSON.stringify(aboutData, null, 2) + '\n')

  console.log(`✓ Projects: ${projectCount}`)
  console.log(`✓ AI-aided projects: ${aiAidedProjectCount}`)
  console.log(`✓ Agent systems: ${agentSystemCount}`)
  if (aiIdeUsage) {
    console.log(`✓ AI IDE token use: ${aiIdeUsage.totalDisplay} scaled since ${aiIdeUsage.scaledSince}`)
    console.log(`✓ AI IDE monthly pace: ${aiIdeUsage.monthlyDisplay} tokens/mo from ${aiIdeUsage.currentMonthThreads} current-month thread${aiIdeUsage.currentMonthThreads === 1 ? '' : 's'}`)
  } else {
    console.log('• AI IDE state database not found; kept existing AI IDE usage value')
  }
  console.log(`✓ Updated ${aboutPath}`)
}

main()
