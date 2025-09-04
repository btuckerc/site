import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const CloseButton = ({ className = '', variant = 'default' }) => {
  const navigate = useNavigate()

  const handleClose = () => {
    navigate('/')
  }

  return (
    <motion.button
      onClick={handleClose}
      className={`group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Close and return to home (ESC)"
      title="Close (ESC)"
    >
      {variant === 'floating' ? (
        // Floating close button for overlay-like appearance
        <div className="flex items-center justify-center w-8 h-8 bg-bg-elev/90 border border-line backdrop-blur-sm hover:bg-accent/10 transition-colors">
          <span className="font-mono text-muted group-hover:text-accent text-lg leading-none">×</span>
        </div>
      ) : (
        // Inline text-style close button
        <span className="font-mono text-muted group-hover:text-accent text-sm transition-colors">
          [×]
        </span>
      )}
    </motion.button>
  )
}

export default CloseButton