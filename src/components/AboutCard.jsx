import { Link } from 'react-router-dom'
import aboutData from '../../data/about.json'

const AboutCard = () => (
  <article className="tui-about-card pointer-events-auto w-full max-w-2xl border border-line bg-card-bg p-6 sm:p-8 font-mono">
    <div className="flex items-start justify-between gap-4">
      <img
        src="/avatar-courtyard.jpg"
        alt="Tucker Craig"
        width="112"
        height="112"
        className="tui-avatar-frame w-24 h-24 sm:w-28 sm:h-28 object-cover"
      />
    </div>
    <h1 className="text-2xl sm:text-3xl font-bold text-fg mt-5">{aboutData.name}</h1>
    <p className="text-accent mt-2">{aboutData.role}</p>
    <p className="text-muted leading-relaxed mt-5">{aboutData.intro}</p>
    <p className="text-fg leading-relaxed mt-4">
      {aboutData.currentWork.split('omalo')[0]}
      <Link to="/projects/omalo" className="text-accent underline underline-offset-4">omalo</Link>
      {aboutData.currentWork.split('omalo').slice(1).join('omalo')}
    </p>
    <p className="text-muted leading-relaxed mt-4">
      I also sang acapella in{' '}
      <a
        href="https://open.spotify.com/track/5CV2w2PIbKouRr2jNKjJIR"
        className="whitespace-nowrap text-accent underline underline-offset-4"
        target="_blank"
        rel="noopener noreferrer"
      >
        The Nuances
      </a>{' '}
      at Davidson.
    </p>
    <nav aria-label="Explore Tucker's work" className="flex flex-wrap gap-4 mt-6 text-sm">
      <Link className="text-accent underline underline-offset-4 min-h-11 inline-flex items-center" to="/projects/omalo">What I'm working on</Link>
      <Link className="text-accent underline underline-offset-4 min-h-11 inline-flex items-center" to="/projects">More projects</Link>
      <Link className="text-accent underline underline-offset-4 min-h-11 inline-flex items-center" to="/contact">Say hello</Link>
    </nav>
  </article>
)

export default AboutCard
