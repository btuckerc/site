import { useId, useState } from 'react'

export function SectionVisual({ id }) {
  if (id === 'how-it-works') return <figure className="story-visual">
    <div className="story-pair"><div><h3>On the device</h3><p>Pokémon Emerald<br />Game state and local controllers</p></div><div><h3>Over Wi-Fi</h3><p>Speech transcription<br />Model calls</p></div></div>
    <p className="story-flow">Game state → agent<br />Supported actions → local controllers → game</p>
    <figcaption>Game state goes out over Wi-Fi. Local controllers handle the actual inputs.</figcaption>
  </figure>
  if (id === 'catch-check') return <figure className="story-visual">
    <div className="story-pair"><div><h3>Before</h3><p>Party + PC boxes</p><p>Existing Pokémon</p><p>New target: not there yet</p></div><div><h3>After the game settles</h3><p>Party + PC boxes</p><p>Existing Pokémon</p><strong className="story-new">+ New target: shows up once</strong></div></div>
    <figcaption>Example state diff, not a recording of an actual catch.</figcaption>
  </figure>
  if (id === 'party') return <div className="story-pair story-visual"><div><h3>"Who's in my party?"</h3><p>Reads the current game state.</p><p className="text-muted">No movement or battle inputs.</p></div><div><h3>"Win this battle."</h3><p>Hands off to the local controllers.</p><p className="text-muted">Actually changes the game.</p></div></div>
  return null
}

export function CornerDemo() {
  const clipId = useId().replace(/:/g, '')
  const [position, setPosition] = useState(50)
  const [screen, setScreen] = useState(true)
  const [tray, setTray] = useState(true)
  const [frame, setFrame] = useState(true)
  // A diagonal path intersects the inset rounded tray at approximately (67, 67).
  const requested = 150 - position * 1.4
  const actual = tray ? Math.max(67, requested) : requested
  const hidden = !tray && requested < 38
  return <figure className="story-visual">
    <fieldset className="story-toggles"><legend>Explore the layers</legend>
      <label><input type="checkbox" checked={frame} onChange={e => setFrame(e.target.checked)} /> Framebuffer</label>
      <label><input type="checkbox" checked={screen} onChange={e => setScreen(e.target.checked)} /> Visible screen</label>
      <label><input type="checkbox" checked={tray} onChange={e => setTray(e.target.checked)} /> Collision boundary</label>
    </fieldset>
    <svg className="story-corner" viewBox="0 0 300 300" role="img" aria-label="Illustrative rounded screen. Move the fleck toward its upper left corner with the slider.">
      <defs><clipPath id={clipId}><rect x="20" y="20" width="260" height="260" rx="60" /></clipPath></defs>
      {frame && <rect x="5" y="5" width="290" height="290" fill="none" stroke="var(--muted)" strokeDasharray="5 5" />}
      {screen && <rect x="20" y="20" width="260" height="260" rx="60" fill="var(--bg)" stroke="var(--accent)" />}
      {tray && <rect x="50" y="50" width="200" height="200" rx="35" fill="none" stroke="var(--accent)" strokeDasharray="3 4" />}
      <path d="M150 150 L10 10" stroke="var(--muted)" strokeDasharray="2 6" />
      <g clipPath={screen ? `url(#${clipId})` : undefined}><circle cx={actual} cy={actual} r="6" fill="var(--accent)" /></g>
    </svg>
    <label className="story-slider">Move toward the corner<input type="range" min="0" max="100" value={position} onChange={e => setPosition(Number(e.target.value))} /></label>
    <p role="status" className="text-sm my-3">{tray && requested < 67 ? 'The collision boundary keeps the fleck inside the visible tray.' : hidden && screen ? 'The fleck slipped into the hidden corner. Uncheck Visible screen to see where it went.' : hidden ? 'The framebuffer still holds the fleck, just outside the visible glass.' : 'Slide the fleck farther toward the corner, then try turning off the collision boundary.'}</p>
    <figcaption>Interactive diagram to show the idea, not exact hardware measurements or physics.</figcaption>
  </figure>
}
