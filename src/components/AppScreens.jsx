import '../styles/app-screens.css'

const screens = [
  ['app-launcher.png', 'Launcher', 'App launcher showing chat, profile, list, and remind.'],
  ['app-grain-controls.png', 'Grain controls', 'Grain settings for bounce, surface, tilt, and calibration.'],
  ['app-list.png', 'Lists', 'A sample list item, milk, with remove and cancel controls.'],
  ['app-chat.png', 'Chat', 'A sample chat reply demonstrating text layout on the small screen.'],
]

export default function AppScreens() {
  return (
    <div className="app-screens">
      <div className="app-screens-grid">
        {screens.map(([file, title, alt]) => (
          <figure key={file}>
            <a href={`/media/s3-amoled/${file}`} target="_blank" rel="noopener noreferrer" aria-label={`Open ${title.toLowerCase()} screen at full size`}>
              <img src={`/media/s3-amoled/${file}`} alt={alt} width="368" height="448" loading="lazy" decoding="async" />
            </a>
            <figcaption>{title}</figcaption>
          </figure>
        ))}
      </div>
      <p className="app-screens-note">Firmware screens rendered on a computer, with sample content. Open a screen to see it at full size.</p>
    </div>
  )
}
