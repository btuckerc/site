import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useRovingFocus } from '../hooks/useRovingFocus.jsx'
import AsciiButton from '../components/AsciiButton'
import { SYMBOLS, LABELS, decorativeBorder } from '../constants/symbols'

const Home = () => {
  const navigate = useNavigate()
  
  const navItems = [
    { id: 'about', label: 'ABOUT', path: '/about' },
    { id: 'projects', label: 'PROJECTS', path: '/projects' },
    { id: 'contact', label: 'CONTACT', path: '/contact' }
  ]

  const { getItemProps } = useRovingFocus('home-nav', navItems)

  const handleNavigation = (path) => {
    navigate(path)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16 pb-12">
      <div className="max-w-2xl w-full text-center" ref={(el) => el && el.focus({ preventScroll: true })}>
        {/* Hero Section */}
        <div className="mb-16">
          {/* Terminal Icon - animates in */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-24 h-24 mx-auto mb-8 border border-line bg-card-bg flex items-center justify-center"
          >
            <div className="font-mono text-2xl text-accent">
              {SYMBOLS.TERMINAL}
            </div>
          </motion.div>

          {/* ASCII line above name - animates from center */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
            className="font-mono text-accent text-center mb-6"
          >
            {SYMBOLS.HORIZONTAL_LINE}
          </motion.div>

          {/* Name - ALWAYS VISIBLE, no animation */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-fg mb-4 tracking-wider font-mono">
            TUCKER CRAIG
          </h1>

          {/* Job Title - fades in from name position */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="text-accent text-lg md:text-xl font-medium mb-2 font-mono"
          >
            FINOPS ENGINEER @ BOX
          </motion.p>

          {/* Education - fades in from name position */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="text-muted text-sm md:text-base mb-8 font-mono"
          >
            DAVIDSON COLLEGE '20
          </motion.p>

          {/* ASCII line below title - animates from center */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3, ease: "easeOut" }}
            className="font-mono text-accent text-center mb-12"
          >
            {SYMBOLS.HORIZONTAL_LINE}
          </motion.div>
        </div>

        {/* Navigation Buttons using AsciiButton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {navItems.map((item, index) => (
            <div key={item.id}>
              <AsciiButton
                size="lg"
                onClick={() => handleNavigation(item.path)}
                className="w-full font-mono text-lg"
                {...getItemProps(item, index)}
              >
                {item.label}
              </AsciiButton>
            </div>
          ))}
        </div>

        {/* Command hint */}
        <div className="text-muted text-sm font-mono mb-8">
          type <kbd className="px-2 py-1 bg-line text-accent">{SYMBOLS.COMMAND_PREFIX}</kbd> for commands
        </div>
      </div>
    </div>
  )
}

export default Home