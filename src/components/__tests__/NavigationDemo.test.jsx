import { describe, it, expect } from 'vitest'
import { routeFor, destinations, tasks, encounter, trainerRisk, map, walkable } from '../../utils/navigationRoute'
import story, { unfoldWords } from '../../utils/storyCopy'

describe('Route 102 illustrative routing', () => {
  it('uses walkable unoccupied endpoints and rejects the old blocked start', () => {
    expect(walkable(28, 7)).toBe(false)
    expect(walkable(-1, 7)).toBe(false)
    for (const { start, end } of Object.values(destinations)) {
      expect(walkable(...start)).toBe(true)
      expect(walkable(...end)).toBe(true)
    }
    const original = destinations.north.start
    try {
      destinations.north.start = [28, 7]
      expect(routeFor('shortest', 'north').path).toEqual([])
    } finally { destinations.north.start = original }
  })
  it('trades a longer walk for fewer grass tiles', () => {
    const direct = routeFor('shortest'), grass = routeFor('grass')
    expect(direct.path.length).toBeGreaterThan(0)
    expect(grass.grass).toBeLessThan(direct.grass)
    expect(grass.path.length).toBeGreaterThan(direct.path.length)
  })
  it('detours around the northern trainer', () => {
    const direct = routeFor('shortest', 'north'), safe = routeFor('trainers', 'north')
    expect(direct.risk).toBeGreaterThan(0)
    expect(safe.risk).toBe(0)
    expect(safe.path.length).toBeGreaterThan(direct.path.length)
  })
  it('discloses a battle fallback without silently relaxing encounter avoidance', () => {
    const fallback = routeFor('balanced')
    expect(fallback.path.length).toBeGreaterThan(0)
    expect(fallback.battleFallback).toBe(true)
    expect(fallback.risk).toBeGreaterThan(0)
    expect(routeFor('balanced', 'crossing', true).path).toEqual([])
    expect(routeFor('shortest', 'crossing', true).path).toEqual([])
  })
  it('keeps each route contiguous, on passable tiles and within policy', () => {
    for (const trip of Object.keys(destinations)) for (const task of tasks) for (const strict of [false, true]) {
      const result = routeFor(task, trip, strict)
      if (!result.path.length) continue
      expect(result.path[0]).toEqual(destinations[trip].start)
      expect(result.path.at(-1)).toEqual(destinations[trip].end)
      result.path.slice(1).forEach(([x, y], i) => {
        const [px, py] = result.path[i]
        expect(Math.abs(x - px) + Math.abs(y - py)).toBe(1)
        expect(map.blocks[y * map.width + x] & 3072).toBe(0)
        if (strict) expect(encounter(x, y)).toBe(false)
        if (['trainers', 'balanced'].includes(task) && !result.battleFallback) expect(trainerRisk(x, y)).toBe(false)
      })
    }
  })
})
describe('word-by-word editorial JSON', () => {
  it('unfolds words without changing punctuation or structural arrays', () => {
    expect(unfoldWords({ paragraphs: [['Hard', 'to', 'explain.'], ['Let’s', 'try.']] })).toEqual({ paragraphs: ['Hard to explain.', 'Let’s try.'] })
    expect(story.sections.find(s => s.id === 'navigation').title).toBe('03 / Getting there is part of the goal')
    expect(story.sections.every(s => s.paragraphs.every(p => typeof p === 'string'))).toBe(true)
  })
})
