import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ProjectCard = ({ project }) => {
  const [expandedSection, setExpandedSection] = useState(null)
  const [isMainExpanded, setIsMainExpanded] = useState(false)

  const sections = [
    { id: 'overview', label: 'Overview', content: project.overview },
    { id: 'stack', label: 'Tech Stack', content: project.stack },
    { id: 'features', label: 'Key Features', content: project.features },
    { id: 'links', label: 'Links', content: project.links }
  ]

  const toggleMain = () => {
    setIsMainExpanded(!isMainExpanded)
    if (isMainExpanded) {
      setExpandedSection(null)
    }
  }

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId)
  }

  return (
    <motion.div
      className="bg-card-bg border border-line p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <button
        onClick={toggleMain}
        className="w-full text-left focus-visible"
        aria-expanded={isMainExpanded}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-bold text-fg">{project.title}</h3>
              <span className="text-accent font-mono text-sm">{project.year}</span>
            </div>
            <p className="text-muted text-sm mb-3 leading-relaxed">{project.blurb}</p>
            <div className="flex flex-wrap gap-1">
              {project.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-accent/10 border border-accent/20 text-accent font-mono"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="ml-4 text-accent flex-shrink-0 font-mono text-lg">
            {isMainExpanded ? '▼' : '▶'}
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isMainExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-border pt-4"
          >
            <div className="space-y-2">
              {sections.map((section) => (
                <motion.div key={section.id} className="border border-border/50">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full px-4 py-3 text-left hover:bg-accent/5 transition-colors flex items-center justify-between focus-visible"
                    aria-expanded={expandedSection === section.id}
                  >
                    <span className="text-sm font-medium text-fg">{section.label}</span>
                    <motion.div
                      animate={{ rotate: expandedSection === section.id ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-accent"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {expandedSection === section.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden border-t border-border/50"
                      >
                        <div className="p-4 bg-card-bg/30">
                          {section.id === 'stack' && Array.isArray(section.content) ? (
                            <div className="flex flex-wrap gap-1">
                              {section.content.map((tech, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 text-xs bg-accent/10 border border-accent/20 text-accent font-mono"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          ) : section.id === 'features' && Array.isArray(section.content) ? (
                            <ul className="space-y-1">
                              {section.content.map((feature, index) => (
                                <li key={index} className="text-muted text-sm flex items-start">
                                  <span className="text-accent mr-2 mt-1">▸</span>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          ) : section.id === 'links' && typeof section.content === 'object' ? (
                            <div className="space-y-2">
                              {Object.entries(section.content).map(([key, url]) => (
                                <a
                                  key={key}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-3 py-1 text-sm bg-accent/10 border border-accent/20 text-accent rounded hover:bg-accent/20 transition-colors focus-visible"
                                >
                                  <span className="capitalize">{key}</span>
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                </a>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted text-sm leading-relaxed">{section.content}</p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default ProjectCard