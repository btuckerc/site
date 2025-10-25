#!/usr/bin/env node

/**
 * Update GitHub statistics in about.json
 * Run this script periodically (e.g., weekly via cron) to update stats
 * 
 * Usage: node scripts/update-github-stats.js
 * Requires: GITHUB_TOKEN environment variable
 */

import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const GITHUB_API = 'https://api.github.com'

async function fetchRepoCount(username, token) {
  const response = await fetch(`${GITHUB_API}/users/${username}`, {
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  })
  
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.statusText}`)
  }
  
  const data = await response.json()
  return data.public_repos
}

async function fetchTotalLines(repos, token) {
  const promises = repos.map(repo =>
    fetch(`${GITHUB_API}/repos/${repo}/languages`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    }).then(res => res.ok ? res.json() : null)
  )

  const results = await Promise.all(promises)
  
  const totalBytes = results.reduce((total, languages) => {
    if (!languages) return total
    return total + Object.values(languages).reduce((sum, bytes) => sum + bytes, 0)
  }, 0)

  // Rough estimate: 1 line ≈ 50 bytes
  return Math.floor(totalBytes / 50)
}

function formatNumber(num) {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
  return num.toString()
}

async function main() {
  const token = process.env.GITHUB_TOKEN
  if (!token) {
    console.error('Error: GITHUB_TOKEN environment variable not set')
    process.exit(1)
  }

  const aboutPath = join(__dirname, '../data/about.json')
  const aboutData = JSON.parse(readFileSync(aboutPath, 'utf-8'))

  console.log('Fetching GitHub statistics...')

  try {
    // Fetch repo count
    const repoCount = await fetchRepoCount(aboutData.githubUsername, token)
    console.log(`✓ Repositories: ${repoCount}`)

    // Fetch total lines
    const totalLines = await fetchTotalLines(aboutData.githubRepos, token)
    const formattedLines = formatNumber(totalLines)
    console.log(`✓ Lines of code: ${formattedLines} (${totalLines.toLocaleString()} total)`)

    // Update about.json with cached values
    aboutData.cachedGithubStats = {
      repoCount,
      totalLines: formattedLines,
      lastUpdated: new Date().toISOString()
    }

    writeFileSync(aboutPath, JSON.stringify(aboutData, null, 2) + '\n')
    console.log(`✓ Updated ${aboutPath}`)
    console.log(`Last updated: ${aboutData.cachedGithubStats.lastUpdated}`)
  } catch (error) {
    console.error('Error fetching GitHub stats:', error.message)
    process.exit(1)
  }
}

main()
