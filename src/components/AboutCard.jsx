import { useState } from 'react'
import { motion } from 'framer-motion'
import aboutData from '../../data/about.json'
import { SYMBOLS, LABELS, bracketed, treeItem } from '../constants/symbols'

const AboutCard = ({ onFlip }) => {
  const [isFlipped, setIsFlipped] = useState(false)
  
  // Calculate years of experience
  const calculateYears = () => {
    if (!aboutData.startDate) return '6.5'
    const start = new Date(aboutData.startDate)
    const now = new Date()
    const years = (now - start) / (1000 * 60 * 60 * 24 * 365.25)
    return years.toFixed(1)
  }
  
  // Calculate terminal hours (2hrs/day, 5 days/week since terminalStartDate)
  const calculateTerminalHours = () => {
    if (!aboutData.terminalStartDate) return '14k'
    const start = new Date(aboutData.terminalStartDate)
    const now = new Date()
    const days = Math.floor((now - start) / (1000 * 60 * 60 * 24))
    const weeks = Math.floor(days / 7)
    const hours = weeks * 5 * 2 // 5 days per week, 2 hours per day
    return hours >= 1000 ? `${(hours / 1000).toFixed(1)}k` : hours.toString()
  }
  
  const getStatValue = (stat) => {
    if (stat.value === 'auto-years') return calculateYears()
    if (stat.value === 'auto-terminal') return calculateTerminalHours()
    if (stat.value === 'auto-github') {
      return aboutData.cachedGithubStats?.totalLines || '~50k'
    }
    if (stat.value === 'auto-repos') {
      return aboutData.cachedGithubStats?.repoCount?.toString() || '15+'
    }
    return stat.value
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
    onFlip?.(isFlipped)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleFlip()
    }
  }

  return (
    <div className="flex justify-center w-full">
      <motion.div 
        className="relative w-full max-w-2xl h-[42rem] sm:h-[48rem] perspective-1000 cursor-pointer focus-visible pointer-events-auto"
        onClick={handleFlip}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`Flip card to see ${isFlipped ? 'front' : 'back'}`}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <motion.div
          className="relative w-full h-full preserve-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Front of card */}
          <motion.div 
            className="absolute inset-0 w-full h-full backface-hidden bg-card-bg border border-line p-6 sm:p-8 flex flex-col"
            style={{ transform: 'rotateY(0deg)' }}
          >
            {/* Close button */}
            <div className="absolute top-4 right-4 z-10 pointer-events-auto">
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  window.location.href = '/'
                }}
                className="font-mono text-muted hover:text-accent text-sm transition-colors"
                aria-label="Close and return home"
              >
                [×]
              </button>
            </div>
            
            {/* Centered content container */}
            <div className="flex-1 flex flex-col items-center justify-center">
              {/* Avatar */}
              <div className="mb-6 sm:mb-7">
                <div className="w-40 h-40 sm:w-44 sm:h-44 mx-auto border border-accent bg-bg-elev overflow-hidden">
                  <img 
                    src="/avatar-336.png"
                    srcSet="/avatar-336.png 1x, /avatar-672.png 2x"
                    alt="Tucker Craig" 
                    className="w-full h-full object-cover tui-dither"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Name and Role */}
              <h2 className="text-2xl sm:text-3xl font-bold text-fg mb-2 font-mono">{aboutData.name}</h2>
              <p className="text-accent font-medium mb-2 font-mono text-center text-base sm:text-lg">{aboutData.role}</p>
              <p className="text-muted text-sm sm:text-base mb-8 sm:mb-10 text-center font-mono">{aboutData.education}</p>

            {/* Stats - TUI list style */}
            <div className="w-full border border-line bg-bg-elev p-4 sm:p-5">
              <div className="space-y-2 text-sm sm:text-base font-mono">
                {aboutData.front.stats.map((stat, index) => (
                  <div key={index} className="flex items-baseline justify-between">
                    <span className="text-muted">
                      <span className="text-accent">▸</span> {stat.label}
                    </span>
                    <span className="text-fg font-medium">
                      {getStatValue(stat)}
                      {stat.suffix && <span className="text-muted text-xs ml-1">{stat.suffix}</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            </div>

            {/* Flip hint at bottom - matches back card position */}
            <p className="text-muted text-xs sm:text-sm text-center font-mono mt-4 pt-3 border-t border-line opacity-70">
              click to flip
            </p>
          </motion.div>

          {/* Back of card */}
          <motion.div 
            className="absolute inset-0 w-full h-full backface-hidden bg-card-bg border border-line p-6 sm:p-8"
            style={{ transform: 'rotateY(180deg)' }}
          >
            {/* Close button */}
            <div className="absolute top-4 right-4 z-10 pointer-events-auto">
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  window.location.href = '/'
                }}
                className="font-mono text-muted hover:text-accent text-sm transition-colors"
                aria-label="Close and return home"
              >
                [×]
              </button>
            </div>
            
            <div className="h-full flex flex-col">
              <h3 className="text-base sm:text-lg font-bold text-accent mb-4 sm:mb-5 font-mono border-b border-line pb-2">
                {bracketed('about')}
              </h3>
              
              <div className="flex-1 space-y-5 sm:space-y-6 overflow-y-auto ascii-scrollbar pr-2">
                {/* Bio */}
                <div className="text-muted text-base sm:text-lg leading-relaxed font-mono">
                  {aboutData.back.bio}
                </div>

                {/* Skills by category */}
                <div>
                  <h4 className="text-fg font-semibold mb-3 text-base sm:text-lg font-mono">
                    {treeItem('Skills')}
                  </h4>
                  <div className="space-y-3 sm:space-y-4 text-base sm:text-lg">
                    {aboutData.back.skills.map((category, index) => (
                      <div key={index} className="border-l-2 border-line pl-3">
                        <div className="text-accent font-mono font-medium mb-1">
                          {category.category}
                        </div>
                        <div className="text-muted font-mono">
                          {category.items.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Badges */}
                <div>
                  <h4 className="text-fg font-semibold mb-3 text-base sm:text-lg font-mono">
                    {treeItem('Credentials')}
                  </h4>
                  <div className="space-y-2 text-base sm:text-lg border-l-2 border-line pl-3">
                    {aboutData.back.badges.map((badge, index) => (
                      <div key={index} className="flex justify-between items-center font-mono">
                        <span className="text-muted">{badge.name}</span>
                        <span className="text-accent">{badge.year}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <h4 className="text-fg font-semibold mb-3 text-base sm:text-lg font-mono">
                    {treeItem('Interests')}
                  </h4>
                  <div className="space-y-1 text-base sm:text-lg text-muted font-mono border-l-2 border-line pl-3">
                    {aboutData.back.interests.map((interest, index) => (
                      <div key={index}>{interest}</div>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-muted text-xs sm:text-sm text-center font-mono mt-4 pt-3 border-t border-line opacity-70">
                click to flip back
              </p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  )
}

export default AboutCard
