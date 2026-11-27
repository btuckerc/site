import Breadcrumb from '../components/Breadcrumb'
import AboutCard from '../components/AboutCard'
import PageMeta from '../components/PageMeta'

const About = () => {
  return (
    <>
      <PageMeta route="/about" />
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
