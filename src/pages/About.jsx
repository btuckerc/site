import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
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
  )
}

export default About