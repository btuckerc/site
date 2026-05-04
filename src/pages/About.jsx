import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import AboutCard from '../components/AboutCard'

const About = () => {
  const navigate = useNavigate()

  const handleBackgroundClick = (e) => {
    // Only navigate if the click was on the background, not on the card or its children
    if (e.target === e.currentTarget) {
      navigate('/')
    }
  }

  return (
    <>
      <Helmet>
        <title>About Tucker Craig - Applied AI & Systems</title>
        <meta name="description" content="About Tucker Craig, a Senior Software Engineer at Box building applied AI tools, agent systems, forecasting workflows, and infrastructure projects." />
        <meta property="og:title" content="About Tucker Craig - Applied AI & Systems" />
        <meta property="og:description" content="Senior Software Engineer working with applied AI, agents, MCP, RAG, Python, Go, TypeScript, and multi-cloud infrastructure." />
        <meta property="og:url" content="https://btuckerc.dev/about" />
        <link rel="canonical" href="https://btuckerc.dev/about" />
      </Helmet>
      <div
        className="tui-page-shell h-svh overflow-hidden flex items-center justify-center px-4 pt-14 pb-14 cursor-pointer"
        onClick={handleBackgroundClick}
      >
      <div className="w-full max-w-3xl pointer-events-none">
        {/* Main AboutCard component */}
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
