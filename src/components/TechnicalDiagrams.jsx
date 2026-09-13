import { useId, useState } from 'react'

export function SectionVisual({ id }) {
  if (id === 'how-it-works') return <figure className="story-visual">
    <div className="story-pair"><div><h3>On the device</h3><p>Pokémon Emerald<br />Game state · local controllers</p></div><div><h3>Over Wi-Fi</h3><p>Speech transcription<br />Model requests</p></div></div>
    <p className="story-flow">Game information → agent<br />Supported actions → local controllers → game</p>
    <figcaption>Information goes out. Local controls carry out the supported actions.</figcaption>
  </figure>
  if (id === 'catch-check') return <figure className="story-visual">
    <div className="story-pair"><div><h3>Before</h3><p>Party + storage</p><p>Existing identities</p><p>Target identity: absent</p></div><div><h3>After the game settles</h3><p>Party + storage</p><p>Existing identities</p><strong className="story-new">+ Target identity: exactly once</strong></div></div>
    <figcaption>Illustrative state comparison, not a recording of a successful catch.</figcaption>
  </figure>
  if (id === 'party') return <div className="story-pair story-visual"><div><h3>“Who’s in my party?”</h3><p>Read the current game state.</p><p className="text-muted">No movement or battle commands.</p></div><div><h3>“Win this battle.”</h3><p>Use supported local controls.</p><p className="text-muted">A gameplay goal changes the game.</p></div></div>
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
    <p role="status" className="text-sm my-3">{tray && requested < 67 ? 'The collision boundary keeps the fleck inside the tray.' : hidden && screen ? 'The fleck has entered the hidden corner. Turn off the visible screen layer to find it.' : hidden ? 'The framebuffer still contains the fleck, outside the visible screen.' : 'Move the fleck farther toward the corner. Try switching the collision boundary off.'}</p>
    <figcaption>Interactive illustration. Geometry and fleck size are explanatory, not device measurements or a physics simulation.</figcaption>
  </figure>
}
