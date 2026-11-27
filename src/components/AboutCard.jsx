import { Link } from 'react-router-dom'
import aboutData from '../../data/about.json'

const AboutCard = () => (
  <article className="tui-about-card w-full p-5 sm:p-7 font-mono">
    <div className="flex items-start justify-between gap-4">
      <img
        src="/avatar-courtyard.jpg"
        alt="Tucker Craig"
        width="112"
        height="112"
        className="tui-avatar-frame w-24 h-24 sm:w-28 sm:h-28 object-cover"
      />
    </div>
    <h1 className="text-2xl sm:text-3xl font-bold text-fg mt-5 leading-tight">{aboutData.name}</h1>
    <p className="home-kicker mt-2">{aboutData.role}</p>
    <p className="text-muted leading-7 mt-5">
      {aboutData.intro.split('projects page')[0]}
      <Link to="/projects" className="text-accent underline underline-offset-4">projects page</Link>
      {aboutData.intro.split('projects page').slice(1).join('projects page')}
    </p>
    <p className="text-fg leading-7 mt-4">
      {aboutData.currentWork.split('omalo')[0]}
      <Link to="/projects/omalo" className="text-accent underline underline-offset-4">omalo</Link>
      {aboutData.currentWork.split('omalo').slice(1).join('omalo')}
    </p>
    <p className="text-muted leading-7 mt-4">
      I stream builds on{' '}
      <a
        href="https://www.twitch.tv/tuxmakes"
        className="text-accent underline underline-offset-4"
        target="_blank"
        rel="me noopener noreferrer"
        aria-describedby="new-tab-note"
      >
        Twitch
      </a>{' '}
      and share demos at{' '}
      <a
        href="https://tuxmakes.dev/"
        className="whitespace-nowrap text-accent underline underline-offset-4"
        target="_blank"
        rel="me noopener noreferrer"
        aria-describedby="new-tab-note"
      >
        tuxmakes.dev
      </a>
      .
    </p>
    <p className="text-muted leading-7 mt-4">
      I also sang a cappella in{' '}
      <a
        href="https://open.spotify.com/track/5CV2w2PIbKouRr2jNKjJIR"
        className="whitespace-nowrap text-accent underline underline-offset-4"
        target="_blank"
        rel="noopener noreferrer"
        aria-describedby="new-tab-note"
      >
        The Nuances
      </a>{' '}
      at Davidson.
    </p>
    <p className="text-muted leading-7 mt-4">
      My main site and older web archives live at{' '}
      <a
        href="https://tuckercraig.com/"
        className="whitespace-nowrap text-accent underline underline-offset-4"
        target="_blank"
        rel="me noopener noreferrer"
        aria-describedby="new-tab-note"
      >
        tuckercraig.com
      </a>
      .
    </p>
    <nav aria-label="Explore Tucker's work" className="flex flex-wrap gap-3 mt-6">
      <Link className="tui-link-chip" to="/workflow">How I build</Link>
      <Link className="tui-link-chip" to="/projects">Projects</Link>
      <Link className="tui-link-chip" to="/contact">Say hello</Link>
    </nav>
  </article>
)

export default AboutCard
