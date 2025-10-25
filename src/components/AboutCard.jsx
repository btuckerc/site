import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import aboutData from '../../data/about.json'
import { SYMBOLS, LABELS, bracketed, treeItem } from '../constants/symbols'

const AboutCard = ({ onFlip }) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const [showFrontTopShadow, setShowFrontTopShadow] = useState(false)
  const [showFrontBottomShadow, setShowFrontBottomShadow] = useState(false)
  const [showBackTopShadow, setShowBackTopShadow] = useState(false)
  const [showBackBottomShadow, setShowBackBottomShadow] = useState(false)
  const frontScrollRef = useRef(null)
  const backScrollRef = useRef(null)
  
  // Calculate years of experience
  // Detect scrollable content - optimized for instant response
  useEffect(() => {
    const checkScroll = (ref, setTopShadow, setBottomShadow, isAvatar = false) => {
      if (!ref.current) return
      const { scrollTop, scrollHeight, clientHeight } = ref.current
      const isScrollable = scrollHeight > clientHeight
      
      if (isAvatar) {
        // For avatar: show shadow immediately when any scroll happens, hide when past avatar
        const avatarHeight = 200 // approximate avatar + margins
        const isAvatarBeingCutOff = scrollTop > 0 && scrollTop < avatarHeight
        setTopShadow(isScrollable && isAvatarBeingCutOff)
      } else {
        const isAtTop = scrollTop < 1
        setTopShadow(isScrollable && !isAtTop)
      }
      
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 1
      setBottomShadow(isScrollable && !isAtBottom)
    }

    const handleFrontScroll = () => checkScroll(frontScrollRef, setShowFrontTopShadow, setShowFrontBottomShadow, true)
    const handleBackScroll = () => checkScroll(backScrollRef, setShowBackTopShadow, setShowBackBottomShadow, false)

    const frontEl = frontScrollRef.current
    const backEl = backScrollRef.current

    if (frontEl) {
      handleFrontScroll()
      frontEl.addEventListener('scroll', handleFrontScroll, { passive: true })
    }
    if (backEl) {
      handleBackScroll()
      backEl.addEventListener('scroll', handleBackScroll, { passive: true })
    }

    const handleResize = () => {
      handleFrontScroll()
      handleBackScroll()
    }
    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      if (frontEl) frontEl.removeEventListener('scroll', handleFrontScroll)
      if (backEl) backEl.removeEventListener('scroll', handleBackScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const calculateYears = () => {
    if (!aboutData.startDate) return '6+'
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
    <div className="flex justify-center w-full py-4">
      <motion.div 
        className="relative w-full max-w-2xl h-[min(48rem,calc(100vh-8rem))] perspective-1000 cursor-pointer focus-visible pointer-events-auto"
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
            className="absolute inset-0 w-full h-full backface-hidden bg-card-bg border border-line p-6 sm:p-8"
            style={{ 
              transform: 'rotateY(0deg)',
              pointerEvents: isFlipped ? 'none' : 'auto',
              zIndex: isFlipped ? 1 : 2
            }}
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
            
            <div className="h-full flex flex-col pt-8 relative">
              {/* Top shadow - fixed at top of scroll area, avatar-width, accounting for scrollbar */}
              <div className="absolute top-8 left-1/2 w-40 sm:w-44 h-8 pointer-events-none z-20 transition-opacity duration-200" style={{ background: 'linear-gradient(to bottom, var(--bg) 0%, transparent 100%)', transform: 'translateX(calc(-50% - 4px))', opacity: showFrontTopShadow ? 1 : 0 }}></div>
              
              {/* Scrollable content anchored to top */}
              <div ref={frontScrollRef} className="flex-1 overflow-y-auto ascii-scrollbar pr-2">
                {/* Avatar */}
                <div className="mb-6 sm:mb-7 flex justify-center">
                  <div className="w-40 h-40 sm:w-44 sm:h-44 border border-accent bg-bg-elev overflow-hidden">
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
                <h2 className="text-2xl sm:text-3xl font-bold text-fg mb-2 font-mono text-center">{aboutData.name}</h2>
                <p className="text-accent font-medium mb-2 font-mono text-center text-base sm:text-lg">{aboutData.role}</p>
                <p className="text-muted text-sm sm:text-base mb-8 sm:mb-10 text-center font-mono">{aboutData.education}</p>

                {/* Stats - TUI list style */}
                <div className="border border-line bg-bg-elev p-4 sm:p-5 mb-4">
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

              {/* Flip hint at bottom */}
              <div className="relative pt-3 border-t border-line">
                <div className="absolute bottom-full left-0 right-0 h-6 pointer-events-none transition-opacity duration-200" style={{ background: 'linear-gradient(to top, var(--bg) 0%, transparent 100%)', opacity: showFrontBottomShadow ? 1 : 0 }}></div>
                <p className="text-muted text-xs sm:text-sm text-center font-mono opacity-70">
                  click to flip
                </p>
              </div>
            </div>
          </motion.div>

          {/* Back of card */}
          <motion.div 
            className="absolute inset-0 w-full h-full backface-hidden bg-card-bg border border-line p-6 sm:p-8"
            style={{ 
              transform: 'rotateY(180deg)',
              pointerEvents: isFlipped ? 'auto' : 'none',
              zIndex: isFlipped ? 2 : 1
            }}
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
              <div className="relative border-b border-line pb-2">
                <h3 className="text-base sm:text-lg font-bold text-accent font-mono">
                  {bracketed('about')}
                </h3>
                <div className="absolute top-full left-0 right-0 h-6 pointer-events-none transition-opacity duration-200" style={{ background: 'linear-gradient(to bottom, var(--bg) 0%, transparent 100%)', opacity: showBackTopShadow ? 1 : 0 }}></div>
              </div>
              
              <div ref={backScrollRef} className="flex-1 space-y-5 sm:space-y-6 overflow-y-auto ascii-scrollbar pr-2 pt-5">
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
                  <div className="space-y-1 text-base sm:text-lg text-muted font-mono border-l-2 border-line pl-3 mb-4">
                    {aboutData.back.interests.map((interest, index) => (
                      <div key={index}>{interest}</div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative pt-3 border-t border-line">
                <div className="absolute bottom-full left-0 right-0 h-6 pointer-events-none transition-opacity duration-200" style={{ background: 'linear-gradient(to top, var(--bg) 0%, transparent 100%)', opacity: showBackBottomShadow ? 1 : 0 }}></div>
                <p className="text-muted text-xs sm:text-sm text-center font-mono opacity-70">
                  click to flip back
                </p>
              </div>
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
