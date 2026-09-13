import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { map, destinations, tasks, routeFor, encounter, trainerRisk } from '../utils/navigationRoute'

function pixelCanvas(hex, width, channels) {
  const canvas = document.createElement('canvas')
  canvas.width = width; canvas.height = hex.length / 2 / channels / width
  const ctx = canvas.getContext('2d'), pixels = ctx.createImageData(canvas.width, canvas.height)
  for (let i = 0; i < pixels.data.length / 4; i++) {
    for (let c = 0; c < 3; c++) pixels.data[i * 4 + c] = parseInt(hex.slice((i * channels + c) * 2, (i * channels + c + 1) * 2), 16)
    pixels.data[i * 4 + 3] = channels === 4 ? parseInt(hex.slice((i * 4 + 3) * 2, (i * 4 + 4) * 2), 16) : 255
  }
  ctx.putImageData(pixels, 0, 0)
  return canvas
}
function RouteMap({ route, progress, overlays, copy, trip, battleFallback }) {
  const canvas = useRef(null), sprite = useRef(null), viewport = useRef(null)
  useEffect(() => {
    const ctx = canvas.current.getContext('2d')
    ctx.imageSmoothingEnabled = false
    const tiles = Object.fromEntries(Object.entries(map.tiles).map(([id, tile]) => [id, pixelCanvas(tile.rgb, 16, 3)]))
    map.blocks.forEach((block, i) => ctx.drawImage(tiles[block & 1023], (i % map.width) * 16, Math.floor(i / map.width) * 16))
    map.trainers.forEach(t => ctx.drawImage(pixelCanvas(map.sprites[t.sprite][t.facing === 'up' ? 1 : 0], 16, 4), t.x * 16, t.y * 16 - 16))
    sprite.current.getContext('2d').drawImage(pixelCanvas(map.sprites.player[2], 16, 4), 0, 0)
  }, [])
  const [x, y] = route[progress] || route[0] || destinations[trip].start
  useEffect(() => {
    const element = viewport.current
    element.scrollLeft = x / map.width * element.scrollWidth - element.clientWidth / 2
  }, [x, trip])
  return <div ref={viewport} className="route-map-scroll" tabIndex="0" role="region" aria-label={copy.mapRegion}><div className="route-map-stage">
    <canvas ref={canvas} width="800" height="320" role="img" aria-label={copy.mapAlt} />
    <svg viewBox="0 0 800 320" className="route-map-overlay" aria-hidden="true">
      {battleFallback && route.filter(([tx, ty]) => trainerRisk(tx, ty)).map(([tx, ty]) => <g key={`battle-${tx}-${ty}`}><rect x={tx * 16 - 1} y={ty * 16 - 1} width="18" height="18" rx="3" fill="#ef6e51" fillOpacity=".8" stroke="#fff0d4" strokeWidth="1.5" /><text x={tx * 16 + 8} y={ty * 16 + 4} textAnchor="middle" fill="#fff" stroke="#492011" strokeWidth=".4" fontSize="13" fontWeight="bold">!</text></g>)}
      {overlays && map.blocks.map((_, i) => { const tx = i % map.width, ty = Math.floor(i / map.width), risk = trainerRisk(tx, ty), grass = encounter(tx, ty); return (risk || grass) && <rect key={i} x={tx * 16} y={ty * 16} width="16" height="16" fill={risk ? '#ef6e51' : '#a6e866'} fillOpacity={risk ? '.5' : '.18'} stroke={risk ? '#faac8f' : 'none'} strokeWidth=".6" /> })}
      {route.length > 0 && <><polyline points={route.map(([tx, ty]) => `${tx * 16 + 8},${ty * 16 + 8}`).join(' ')} fill="none" stroke="#142131" strokeWidth="5" strokeLinejoin="round" /><polyline points={route.map(([tx, ty]) => `${tx * 16 + 8},${ty * 16 + 8}`).join(' ')} fill="none" stroke="#ffe78b" strokeWidth="2.5" strokeLinejoin="round" />{[route[0], route.at(-1)].map(([tx, ty], i) => <g key={i}><circle cx={tx * 16 + 8} cy={ty * 16 + 8} r="8" fill="#142131" /><text x={tx * 16 + 8} y={ty * 16 + 11} textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">{i ? 'B' : 'A'}</text></g>)}</>}
    </svg>
    <canvas ref={sprite} width="16" height="32" aria-hidden="true" className="route-player" style={{ left: `${x * 2}%`, top: `${(y - 1) * 5}%` }} />
  </div></div>
}
export default function NavigationDemo({ copy }) {
  const [task, setTask] = useState('shortest'), [trip, setTrip] = useState('crossing'), [overlays, setOverlays] = useState(true), [progress, setProgress] = useState(0)
  const result = useMemo(() => routeFor(task, trip), [task, trip])
  const [infoOpen, setInfoOpen] = useState(false)
  const infoId = useId(), taskControls = useRef(null)
  useEffect(() => {
    if (!infoOpen) return undefined
    const dismiss = e => { if (!taskControls.current?.contains(e.target)) setInfoOpen(false) }
    const escape = e => { if (e.key === 'Escape') { setInfoOpen(false); taskControls.current?.querySelector('button')?.focus() } }
    document.addEventListener('pointerdown', dismiss)
    document.addEventListener('keydown', escape)
    return () => { document.removeEventListener('pointerdown', dismiss); document.removeEventListener('keydown', escape) }
  }, [infoOpen])
  const reset = () => { setProgress(0); setInfoOpen(false) }
  return <figure className="story-visual navigation-demo">
    <div className="route-demo-heading"><div><p className="case-study-kicker">{copy.eyebrow}</p><h3>{copy.heading}</h3></div><span>{copy.badge}</span></div>
    <fieldset ref={taskControls} className="route-tasks"><legend>{copy.prompt}</legend>{tasks.map(id => <div key={id} className={`route-task-option ${task === id ? 'is-selected' : ''}`}><label><input type="radio" name="navigation-task" value={id} checked={task === id} onChange={() => { setTask(id); reset() }} /><span>{copy.tasks[id]}</span></label>{task === id && result.battleFallback && <button type="button" className="route-info-button" aria-label={copy.battleInfoLabel} aria-expanded={infoOpen} aria-controls={infoId} onClick={() => setInfoOpen(open => !open)}>i</button>}</div>)}
      {result.battleFallback && <div id={infoId} hidden={!infoOpen} className="route-info-popover" role="note"><strong>{copy.battleTitle}</strong><p>{copy.battleNotice}</p></div>}
    </fieldset>
    <div className="route-options"><label>{copy.tripLabel}<select value={trip} onChange={e => { setTrip(e.target.value); reset() }}>{Object.keys(destinations).map(id => <option key={id} value={id}>{copy.trips[id]}</option>)}</select></label><label><input type="checkbox" checked={overlays} onChange={e => setOverlays(e.target.checked)} />{copy.overlays}</label></div>
    <RouteMap route={result.path} progress={progress} overlays={overlays} copy={copy} trip={trip} battleFallback={result.battleFallback} />
    <div className="route-map-labels"><span>{copy.west}</span><span>{copy.east}</span></div>
    <p className="navigation-legend">{copy.legend}</p>
    <div className="route-metrics" aria-label={copy.metricsLabel}><div><strong>{result.path.length ? result.path.length - 1 : '—'}</strong><span>{copy.steps}</span></div><div><strong>{result.path.length ? result.grass : '—'}</strong><span>{copy.grass}</span></div><div><strong>{result.path.length ? result.risk : '—'}</strong><span>{copy.risk}</span></div></div>
    <p role="status" className="navigation-result">{result.path.length ? result.battleFallback ? copy.battleResult : copy.explanations[task] : copy.blocked}</p>
    {result.path.length > 0 && <label className="story-slider route-scrubber">{copy.scrub}<input type="range" min="0" max={result.path.length - 1} value={progress} onChange={e => setProgress(Number(e.target.value))} /></label>}
    <details className="story-detail"><summary>{copy.detailsTitle}</summary><p>{copy.caption}</p><p>{copy.limits}</p><a href={map.source} target="_blank" rel="noreferrer">{copy.credit}</a></details>
  </figure>
}
