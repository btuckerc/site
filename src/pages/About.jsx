import Breadcrumb from '../components/Breadcrumb'
import AboutCard from '../components/AboutCard'
import PageMeta from '../components/PageMeta'

const About = () => {
  return (
    <>
      <PageMeta
        title="About - Tucker Craig"
        description="Hello, world! I'm Tucker. I build my own macOS browser, an iOS app for coding agents, local voice-to-text, quota tools, and firmware for omalo."
        url="https://btuckerc.dev/about"
        image="https://btuckerc.dev/og/about.jpg"
        imageAlt="Tucker Craig, about. Hello, world! I'm Tucker."
      />
      <div className="about-page tui-page-shell min-h-svh">
        <div className="tui-rail tui-enter">
          <Breadcrumb items={[{ label: 'home', to: '/' }, { label: 'about' }]} />
          <div className="mx-auto w-full max-w-2xl">
            <AboutCard />
          </div>
        </div>
      </div>
    </>
  )
}

export default About
