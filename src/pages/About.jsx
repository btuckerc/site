import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import AboutCard from '../components/AboutCard'

const About = () => {
  return (
    <>
      <Helmet>
        <title>About - Tucker Craig</title>
        <meta name="description" content="Senior engineer at Box. Agents on a macmini, a Waveshare on the desk, a 3D printer, a cappella at Davidson. The card flips." />
        <meta property="og:title" content="About - Tucker Craig" />
        <meta property="og:description" content="Tinkerer. Agents, hardware, a terminal since 2011. Day job at Box." />
        <meta property="og:url" content="https://btuckerc.dev/about" />
        <link rel="canonical" href="https://btuckerc.dev/about" />
      </Helmet>
      <div className="tui-page-shell h-svh overflow-hidden flex items-center justify-center px-4 pt-14 pb-14">
        <div className="w-full max-w-3xl pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.18 }}
            className="flex justify-center"
          >
            <AboutCard />
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default About
