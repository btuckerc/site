// Extract only Route 102's visual/data subset. Emits JSON to stdout for review.
// Usage: node scripts/prepare-navigation-map.js /path/to/pret/pokeemerald
import fs from 'node:fs'
import path from 'node:path'
import { inflateSync } from 'node:zlib'
const root = process.argv[2]
if (!root) throw new Error('Provide a local pokeemerald source directory')
const read = p => fs.readFileSync(path.join(root, p))
const words = p => { const b = read(p); return Array.from({ length: b.length / 2 }, (_, i) => b.readUInt16LE(i * 2)) }
const palette = p => read(p).toString().trim().split(/\r?\n/).slice(3).map(s => s.split(' ').map(Number))
function indexedPng(p) {
  const b = read(p), chunks = []
  let width, height, depth
  for (let at = 8; at < b.length;) {
    const n = b.readUInt32BE(at), type = b.toString('ascii', at + 4, at + 8), data = b.subarray(at + 8, at + 8 + n)
    if (type === 'IHDR') { width = data.readUInt32BE(0); height = data.readUInt32BE(4); depth = data[8]; if (data[9] !== 3 || data[12] !== 0 || ![4, 8].includes(depth)) throw new Error('Expected indexed PNG: ' + p) }
    if (type === 'IDAT') chunks.push(data)
    at += n + 12
  }
  const raw = inflateSync(Buffer.concat(chunks)), stride = Math.ceil(width * depth / 8), bytes = new Uint8Array(stride * height), pixels = []
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)]
    for (let x = 0; x < stride; x++) {
      const a = x ? bytes[y * stride + x - 1] : 0, c = y && x ? bytes[(y - 1) * stride + x - 1] : 0, up = y ? bytes[(y - 1) * stride + x] : 0
      const estimate = a + up - c, pa = Math.abs(estimate - a), pb = Math.abs(estimate - up), pc = Math.abs(estimate - c)
      const predictor = [0, a, up, Math.floor((a + up) / 2), pa <= pb && pa <= pc ? a : pb <= pc ? up : c][filter]
      bytes[y * stride + x] = (raw[y * (stride + 1) + x + 1] + predictor) & 255
    }
    for (let x = 0; x < width; x++) pixels.push(depth === 8 ? bytes[y * stride + x] : (bytes[y * stride + (x >> 1)] >> (x % 2 ? 0 : 4)) & 15)
  }
  return { width, height, pixels }
}
const primary = 'data/tilesets/primary/general', secondary = 'data/tilesets/secondary/petalburg'
const sheets = [indexedPng(primary + '/tiles.png'), indexedPng(secondary + '/tiles.png')]
const metas = [words(primary + '/metatiles.bin'), words(secondary + '/metatiles.bin')]
const attrs = [words(primary + '/metatile_attributes.bin'), words(secondary + '/metatile_attributes.bin')]
const palettes = Array.from({ length: 16 }, (_, i) => palette(`${i < 6 ? primary : secondary}/palettes/${String(i).padStart(2, '0')}.pal`))
const blocks = words('data/layouts/Route102/map.bin')
const hex = n => n.toString(16).padStart(2, '0')
const tiles = {}
for (const id of new Set(blocks.map(b => b & 1023))) {
  const bank = id >= 512 ? 1 : 0, local = id % 512, entries = metas[bank].slice(local * 8, local * 8 + 8), rgb = new Array(256).fill(palettes[0][0])
  for (let layer = 0; layer < 2; layer++) for (let q = 0; q < 4; q++) {
    const entry = entries[layer * 4 + q], tile = entry & 1023, sheet = sheets[tile >= 512 ? 1 : 0], tileIndex = tile % 512
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
      const sx = (tileIndex % (sheet.width / 8)) * 8 + (entry & 1024 ? 7 - x : x), sy = Math.floor(tileIndex / (sheet.width / 8)) * 8 + (entry & 2048 ? 7 - y : y), color = sheet.pixels[sy * sheet.width + sx]
      if (color || layer === 0) rgb[(Math.floor(q / 2) * 8 + y) * 16 + (q % 2) * 8 + x] = palettes[entry >> 12][color]
    }
  }
  tiles[id] = { behavior: attrs[bank][local] & 255, rgb: rgb.flat().map(hex).join('') }
}
const sprites = {}
for (const [name, file, pal] of [['player', 'brendan/walking', 'brendan'], ['youngster', 'youngster', 'npc_1'], ['bug_catcher', 'bug_catcher', 'npc_1'], ['lass', 'lass', 'npc_4']]) {
  const sheet = indexedPng(`graphics/object_events/pics/people/${file}.png`), colors = palette(`graphics/object_events/palettes/${pal}.pal`)
  sprites[name] = Array.from({ length: 3 }, (_, frame) => Array.from({ length: 512 }, (_, i) => {
    const color = sheet.pixels[Math.floor(i / 16) * sheet.width + frame * 16 + i % 16]
    return [...colors[color], color ? 255 : 0].map(hex).join('')
  }).join(''))
}
const objects = JSON.parse(read('data/maps/Route102/map.json')).object_events
const trainers = objects.filter(o => o.trainer_type === 'TRAINER_TYPE_NORMAL').map(o => ({ x: o.x, y: o.y, sight: Number(o.trainer_sight_or_berry_tree_id), facing: o.movement_type === 'MOVEMENT_TYPE_FACE_UP' ? 'up' : o.movement_type === 'MOVEMENT_TYPE_FACE_DOWN' ? 'down' : 'turning', sprite: o.graphics_id.replace('OBJ_EVENT_GFX_', '').toLowerCase() }))
process.stdout.write(JSON.stringify({ source: 'https://github.com/pret/pokeemerald', map: 'Route 102', width: 50, height: 20, blocks, tiles, trainers, occupied: objects.map(o => [o.x, o.y]), sprites }) + '\n')
