import map from '../../data/route102-map.json'
export { map }
export const encounter = (x, y) => [2, 3].includes(map.tiles[map.blocks[y * map.width + x] & 1023].behavior)
export const trainerRisk = (x, y) => map.trainers.some(t => {
  const dx = x - t.x, dy = y - t.y
  if (t.facing === 'up') return dx === 0 && dy < 0 && -dy <= t.sight
  if (t.facing === 'down') return dx === 0 && dy > 0 && dy <= t.sight
  return (dx === 0 && Math.abs(dy) <= t.sight) || (dy === 0 && Math.abs(dx) <= t.sight)
})
export const destinations = { crossing: { start: [49, 10], end: [0, 7] }, north: { start: [27, 6], end: [12, 7] } }
export function walkable(x, y) {
  if (!Number.isInteger(x) || !Number.isInteger(y) || x < 0 || y < 0 || x >= map.width || y >= map.height) return false
  const block = map.blocks[y * map.width + x], behavior = map.tiles[block & 1023].behavior
  return !(block & 3072) && (block >> 12) !== 1 && !(behavior >= 0x38 && behavior <= 0x3f) && !map.occupied.some(([ox, oy]) => ox === x && oy === y)
}
export const tasks = ['shortest', 'grass', 'trainers', 'balanced']
export function routeFor(task = 'shortest', trip = 'crossing', strict = false, allowTrainerRisk = false) {
  const { start, end } = destinations[trip], avoidTrainers = task === 'trainers' || task === 'balanced', preferGrass = task === 'grass' || task === 'balanced'
  if (!walkable(...start) || !walkable(...end)) return { path: [], grass: 0, risk: 0, battleFallback: false }
  const count = map.width * map.height, costs = new Array(count).fill(Infinity), previous = new Array(count).fill(-1), visited = new Set()
  const begin = start[1] * map.width + start[0], target = end[1] * map.width + end[0]
  costs[begin] = 0
  for (let n = 0; n < count; n++) {
    let at = -1
    for (let i = 0; i < count; i++) if (!visited.has(i) && Number.isFinite(costs[i]) && (at < 0 || costs[i] < costs[at])) at = i
    if (at < 0) break
    if (at === target) {
      const path = []
      for (let p = at; p !== -1; p = previous[p]) path.unshift([p % map.width, Math.floor(p / map.width)])
      return { path, grass: path.slice(1).filter(([x, y]) => encounter(x, y)).length, risk: path.slice(1).filter(([x, y]) => trainerRisk(x, y)).length, battleFallback: allowTrainerRisk }
    }
    visited.add(at)
    const x = at % map.width, y = Math.floor(at / map.width)
    for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
      if (nx < 0 || ny < 0 || nx >= map.width || ny >= map.height) continue
      const next = ny * map.width + nx
      // Static on-foot illustration; excludes ledges, Surf, scripts and NPC motion.
      if (!walkable(nx, ny)) continue
      if ((avoidTrainers && !allowTrainerRisk && trainerRisk(nx, ny)) || (strict && encounter(nx, ny))) continue
      // A disclosed fallback minimizes trainer-risk entries before grass/steps.
      const cost = costs[at] + 1 + (preferGrass && encounter(nx, ny) ? count : 0) + (allowTrainerRisk && trainerRisk(nx, ny) ? count * count : 0)
      if (cost < costs[next]) { costs[next] = cost; previous[next] = at }
    }
  }
  if (avoidTrainers && !allowTrainerRisk) return routeFor(task, trip, strict, true)
  return { path: [], grass: 0, risk: 0, battleFallback: false }
}
