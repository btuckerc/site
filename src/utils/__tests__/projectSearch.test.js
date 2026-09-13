import { describe, expect, it } from 'vitest'
import projects from '../../../data/projects.json'
import {
  createProjectSearchIndex,
  getProjectSearchSuggestions,
  searchProjects,
  tokenizeSearchQuery
} from '../projectSearch'

const index = createProjectSearchIndex(projects)
const idsFor = (query) => searchProjects(index, query).map(({ project }) => project.id)

describe('project search', () => {
  it('splits natural multi-word queries and camel-case project names', () => {
    const ids = idsFor('center seat showtimes')

    expect(ids[0]).toBe('center-seat')
    expect(ids).not.toContain('spotify-dj')
  })

  it('handles typos without returning broad unrelated matches', () => {
    expect(idsFor('jeapordy')[0]).toBe('trivrdy')
    expect(idsFor('zzzzqqq')).toEqual([])
  })

  it('uses domain aliases for portfolio language', () => {
    expect(idsFor('dotfiles')[0]).toBe('boilerplate')
    expect(idsFor('movie seats')[0]).toBe('center-seat')
    expect(idsFor('audiobook')[0]).toBe('audioreader')
  })

  it('keeps short meaningful technical terms', () => {
    expect(tokenizeSearchQuery('ML trading with AI')).toEqual(['ml', 'trading', 'ai'])
  })

  it('offers query-shaped suggestions instead of unrelated popular terms', () => {
    const suggestions = getProjectSearchSuggestions(index, 'dot', 5).map(({ label }) => label)

    expect(suggestions[0]).toBe('dotfiles')
    expect(suggestions.every((label) => label.includes('dot'))).toBe(true)
  })

  it('keeps related suggestions short enough to scan', () => {
    const suggestions = getProjectSearchSuggestions(index, 'playlist', 8).map(({ label }) => label)

    expect(suggestions.length).toBeGreaterThan(0)
    expect(suggestions.every((label) => label.length <= 42 && label.split(' ').length <= 5)).toBe(true)
  })

  it('caches repeated searches and suggestions by normalized query', () => {
    expect(searchProjects(index, ' dotfiles ')).toBe(searchProjects(index, 'dotfiles'))
    expect(getProjectSearchSuggestions(index, ' agent ', 6)).toBe(getProjectSearchSuggestions(index, 'agent', 6))
  })
})
