import { motion } from 'framer-motion'
import AboutCard from '../components/AboutCard'

const About = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-lg">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-fg mb-3 font-mono">
            <span className="text-accent">[</span> about.json <span className="text-accent">]</span>
          </h1>
          <p className="text-muted text-sm font-mono">
            click card to reveal more information
          </p>
        </motion.div>

        {/* Main AboutCard component */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex justify-center"
        >
          <AboutCard />
        </motion.div>

        {/* Bottom hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-8 text-muted text-xs font-mono"
        >
          <span className="text-accent">└─</span> interactive profile card <span className="text-accent">─┘</span>
        </motion.div>
      </div>
    </div>
  )
}

export default About