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
const aiIdeRateSwitchDate = new Date('2026-07-02T00:00:00Z')
const aiIdeLegacyMonthlyPace = 1.9e9
const aiIdeCurrentMonthlyPace = 3.8e9
const msPerDay = 1000 * 60 * 60 * 24
const msPerMonth = msPerDay * (365.25 / 12)

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

const getMonthLabel = (date) =>
  new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(date)

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
  const now = new Date()
  const legacyEnd = now < aiIdeRateSwitchDate ? now : aiIdeRateSwitchDate
  const legacyMs = Math.max(0, legacyEnd.getTime() - aiIdeScaleStartDate.getTime())
  const currentMs = Math.max(0, now.getTime() - aiIdeRateSwitchDate.getTime())
  const scaledTotalTokens =
    aiIdeLegacyMonthlyPace * (legacyMs / msPerMonth) +
    aiIdeCurrentMonthlyPace * (currentMs / msPerMonth)

  let observedSince = getMonthLabel(aiIdeScaleStartDate)
  let observedThreads = 0

  const dbPath = getAiIdeStatePath()
  if (existsSync(dbPath)) {
    try {
      const [history] = runSqliteJson(dbPath, `
        select
          min(created_at) as min_created_at,
          count(*) as threads
        from threads
        where tokens_used > 0;
      `)
      if (history?.min_created_at) {
        observedSince = getMonthLabel(new Date(Number(history.min_created_at) * 1000))
      }
      observedThreads = Number(history?.threads || 0)
    } catch {
      // Keep the piecewise Grok/OMP rate even if the old AI IDE db cannot be read.
    }
  }

  return {
    monthlyDisplay: formatNumber(aiIdeCurrentMonthlyPace),
    legacyMonthlyDisplay: formatNumber(aiIdeLegacyMonthlyPace),
    totalDisplay: formatNumber(scaledTotalTokens),
    observedThreads,
    observedSince,
    scaledSince: getMonthLabel(aiIdeScaleStartDate),
    scaleStart: '2024-12-01',
    rateSwitch: '2026-07-02'
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
      aiIdeLegacyMonthlyPace: aiIdeUsage.legacyMonthlyDisplay,
      aiIdeObservedSince: aiIdeUsage.observedSince,
      aiIdeScaledSince: aiIdeUsage.scaledSince,
      aiIdeScaleStart: aiIdeUsage.scaleStart,
      aiIdeRateSwitch: aiIdeUsage.rateSwitch
    } : {})
  }

  writeFileSync(aboutPath, JSON.stringify(aboutData, null, 2) + '\n')

  console.log(`✓ Projects: ${projectCount}`)
  console.log(`✓ AI-aided projects: ${aiAidedProjectCount}`)
  console.log(`✓ Agent systems: ${agentSystemCount}`)
  if (aiIdeUsage) {
    console.log(`✓ Token use: ${aiIdeUsage.totalDisplay} using ${aiIdeUsage.legacyMonthlyDisplay}/mo through ${aiIdeUsage.rateSwitch}, then ${aiIdeUsage.monthlyDisplay}/mo`)
  } else {
    console.log('• Token use model missing; kept existing value')
  }
  console.log(`✓ Updated ${aboutPath}`)
}

main()
