import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import AboutCard from '../components/AboutCard'
import { LABELS, bracketed, decorativeBorder } from '../constants/symbols'

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
        <title>About Tucker Craig - FinOps Engineer, Cloud Cost Optimization Expert</title>
        <meta name="description" content="Learn about Tucker Craig - Senior FinOps Engineer at Box specializing in multi-cloud cost optimization, capacity planning, and data-driven infrastructure optimization. $2.4M+ in annual savings." />
        <meta property="og:title" content="About Tucker Craig - FinOps Engineer at Box" />
        <meta property="og:description" content="Senior FinOps Engineer at Box specializing in multi-cloud cost optimization and capacity planning. Expertise in GCP, AWS, Azure, Python, and cloud infrastructure." />
        <meta property="og:url" content="https://btuckerc.dev/about" />
        <link rel="canonical" href="https://btuckerc.dev/about" />
      </Helmet>
      <div 
        className="h-screen flex items-center justify-center px-4 overflow-hidden cursor-pointer" 
        onClick={handleBackgroundClick}
      >
      <div className="w-full max-w-3xl pointer-events-none">
        {/* Main AboutCard component */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
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