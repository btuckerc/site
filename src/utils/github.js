// GitHub API utilities for fetching repository statistics

const GITHUB_API = 'https://api.github.com'

/**
 * Get headers for GitHub API requests
 */
function getHeaders() {
  const token = import.meta.env.VITE_GITHUB_TOKEN
  
  if (!token) {
    console.warn('GitHub token not found. Set VITE_GITHUB_TOKEN in .env.local')
    return null
  }

  return {
    'Authorization': `token ${token}`,
    'Accept': 'application/vnd.github.v3+json'
  }
}

/**
 * Fetches total number of public repositories for a user
 */
export async function fetchRepoCount(username) {
  const headers = getHeaders()
  if (!headers) return null

  try {
    const response = await fetch(`${GITHUB_API}/users/${username}`, { headers })
    if (!response.ok) return null
    
    const data = await response.json()
    return data.public_repos
  } catch (error) {
    console.error('Error fetching repo count:', error)
    return null
  }
}

/**
 * Fetches total lines of code across specified repositories
 * Uses GitHub's language stats endpoint and sums all languages
 */
export async function fetchTotalLines(repos) {
  const headers = getHeaders()
  if (!headers) return null

  try {
    // Fetch language stats for each repo
    const promises = repos.map(repo =>
      fetch(`${GITHUB_API}/repos/${repo}/languages`, { headers })
        .then(res => res.ok ? res.json() : null)
    )

    const results = await Promise.all(promises)
    
    // Sum up all bytes across all languages in all repos
    const totalBytes = results.reduce((total, languages) => {
      if (!languages) return total
      return total + Object.values(languages).reduce((sum, bytes) => sum + bytes, 0)
    }, 0)

    // Rough estimate: 1 line ≈ 50 bytes (average)
    const estimatedLines = Math.floor(totalBytes / 50)
    
    return estimatedLines
  } catch (error) {
    console.error('Error fetching GitHub stats:', error)
    return null
  }
}

/**
 * Formats large numbers with k/M suffix
 */
export function formatNumber(num) {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`
  }
  return num.toString()
}
