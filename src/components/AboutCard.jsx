import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import aboutData from '../../data/about.json'

const AboutCard = ({ onFlip }) => {
  const [isFlipped, setIsFlipped] = useState(false)

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
    <div className="flex justify-center">
      <motion.div 
        className="relative w-96 h-[32rem] perspective-1000 cursor-pointer focus-visible"
        onClick={handleFlip}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`Flip card to see ${isFlipped ? 'front' : 'back'}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          className="relative w-full h-full preserve-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          {/* Front of card */}
          <motion.div 
            className="absolute inset-0 w-full h-full backface-hidden bg-card-bg border border-line rounded-xl p-8 flex flex-col items-center justify-center"
            style={{ transform: 'rotateY(0deg)' }}
          >
            {/* Avatar */}
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full border border-accent bg-bg-elev flex items-center justify-center">
                <div className="font-mono text-2xl text-accent">$</div>
              </div>
            </div>

            {/* Name and Role */}
            <h2 className="text-2xl font-bold text-fg mb-2 font-mono">{aboutData.name}</h2>
            <p className="text-accent font-medium mb-2 font-mono text-center">{aboutData.role}</p>
            <p className="text-muted text-sm mb-8 text-center font-mono">{aboutData.education}</p>

            {/* Stats row - TUI style */}
            <div className="w-full border border-line rounded-lg bg-bg-elev p-4 mb-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                {aboutData.front.stats.map((stat, index) => (
                  <div key={index} className="flex flex-col">
                    <span className="text-accent font-mono text-lg font-bold">{stat.value}</span>
                    <span className="text-muted text-xs uppercase tracking-wider font-mono">
                      {stat.label}
                    </span>
                    <span className="text-muted text-xs mt-1 font-mono">
                      {stat.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-muted text-xs text-center font-mono">
              <span className="text-accent">[</span> click to flip <span className="text-accent">]</span>
            </p>
          </motion.div>

          {/* Back of card */}
          <motion.div 
            className="absolute inset-0 w-full h-full backface-hidden bg-card-bg border border-line rounded-xl p-6"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <div className="h-full flex flex-col">
              <h3 className="text-lg font-bold text-accent mb-4 text-center font-mono">
                [ about_me.txt ]
              </h3>
              
              <div className="flex-1 space-y-4 overflow-y-auto">
                {/* Bio */}
                <div className="text-muted text-sm leading-relaxed font-mono">
                  {aboutData.back.bio}
                </div>

                {/* Skills by category */}
                <div>
                  <h4 className="text-fg font-semibold mb-3 text-sm font-mono">
                    <span className="text-accent">▸</span> Skills
                  </h4>
                  <div className="space-y-2">
                    {aboutData.back.skills.map((category, index) => (
                      <div key={index}>
                        <h5 className="text-accent text-xs font-mono font-medium mb-1">
                          {category.category}:
                        </h5>
                        <div className="flex flex-wrap gap-1 ml-2">
                          {category.items.map((skill, skillIndex) => (
                            <span 
                              key={skillIndex}
                              className="px-2 py-1 text-xs bg-line/30 text-muted rounded font-mono"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Badges */}
                <div>
                  <h4 className="text-fg font-semibold mb-2 text-sm font-mono">
                    <span className="text-accent">▸</span> Credentials
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {aboutData.back.badges.map((badge, index) => (
                      <div key={index} className="flex justify-between items-center text-xs font-mono">
                        <span className="text-muted">{badge.name}</span>
                        <span className="text-accent">{badge.year}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <h4 className="text-fg font-semibold mb-2 text-sm font-mono">
                    <span className="text-accent">▸</span> Interests
                  </h4>
                  <div className="text-xs text-muted font-mono leading-relaxed">
                    {aboutData.back.interests.join(' • ')}
                  </div>
                </div>
              </div>

              <p className="text-muted text-xs text-center font-mono mt-4">
                <span className="text-accent">[</span> click to flip back <span className="text-accent">]</span>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      <style jsx>{`
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