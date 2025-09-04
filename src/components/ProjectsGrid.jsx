import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRovingFocus } from '../hooks/useRovingFocus.jsx'
import projectsData from '../../data/projects.json'

const ProjectsGrid = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedProject, setExpandedProject] = useState(null)
  const searchInputRef = useRef()
  
  // Filter projects based on search query
  const filteredProjects = projectsData.filter(project => {
    const searchTerm = searchQuery.toLowerCase()
    return (
      project.title.toLowerCase().includes(searchTerm) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      project.blurb.toLowerCase().includes(searchTerm)
    )
  })

  const { getItemProps } = useRovingFocus('projects-grid', filteredProjects)

  // Global keydown handler for `/` to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const activeElement = document.activeElement
        if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
          e.preventDefault()
          searchInputRef.current?.focus()
        }
      } else if (e.key === 'Escape') {
        if (searchQuery) {
          setSearchQuery('')
          searchInputRef.current?.blur()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [searchQuery])

  const toggleExpanded = (projectId) => {
    setExpandedProject(expandedProject === projectId ? null : projectId)
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-md mx-auto">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search projects... (press / to focus)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-search-input
            className="w-full px-4 py-3 font-mono text-sm bg-bgElev border border-line text-fg placeholder-muted focus:outline-none focus:border-focus transition-colors duration-[var(--duration-fast)]"
            style={{ borderRadius: 'var(--radius)' }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-fg transition-colors duration-[var(--duration-fast)] focus:outline-none focus-visible:ring-2 focus-visible:ring-focus/50"
              style={{ borderRadius: 'var(--radius)' }}
              aria-label="Clear search"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"/>
              </svg>
            </button>
          )}
        </div>
        
        {filteredProjects.length !== projectsData.length && (
          <div className="text-center mt-4">
            <span className="text-muted text-sm font-mono">
              Showing {filteredProjects.length} of {projectsData.length} projects
            </span>
          </div>
        )}
      </div>

      {/* Projects Grid */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.16, delay: index * 0.02 }}
              className="border border-line bg-bg overflow-hidden"
              style={{ borderRadius: 'var(--radius)' }}
            >
              {/* Project Header */}
              <button
                onClick={() => toggleExpanded(project.id)}
                className="w-full p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-focus/50 focus-visible:ring-inset transition-colors duration-[var(--duration-fast)] hover:bg-bgElev"
                {...getItemProps(project, index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-bold text-fg font-mono truncate">
                        {project.title}
                      </h3>
                      <span className="text-muted font-mono text-sm whitespace-nowrap">
                        {project.year}
                      </span>
                    </div>
                    
                    <p className="text-muted text-sm mb-3 leading-relaxed">
                      {project.blurb}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs font-mono bg-line text-fg"
                          style={{ borderRadius: 'var(--radius)' }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="ml-4 text-accent">
                    <motion.svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      animate={{ rotate: expandedProject === project.id ? 180 : 0 }}
                      transition={{ duration: 0.16 }}
                    >
                      <path d="M12 15.39l-3.76-3.73 1.38-1.39L12 12.64l2.38-2.37 1.38 1.39z"/>
                    </motion.svg>
                  </div>
                </div>
              </button>

              {/* Expanded Content */}
              <AnimatePresence>
                {expandedProject === project.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="border-t border-line bg-bgElev"
                  >
                    <div className="p-6 space-y-6">
                      {/* Overview */}
                      <section>
                        <h4 className="font-mono text-sm font-bold text-accent mb-3">
                          [ Overview ]
                        </h4>
                        <p className="text-fg text-sm leading-relaxed">
                          {project.overview}
                        </p>
                      </section>

                      {/* Stack */}
                      <section>
                        <h4 className="font-mono text-sm font-bold text-accent mb-3">
                          [ Stack ]
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {project.stack.map(tech => (
                            <span
                              key={tech}
                              className="px-3 py-1 text-xs font-mono bg-line text-fg"
                              style={{ borderRadius: 'var(--radius)' }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </section>

                      {/* Links */}
                      <section>
                        <h4 className="font-mono text-sm font-bold text-accent mb-3">
                          [ Links ]
                        </h4>
                        <div className="flex flex-wrap gap-4">
                          {project.links.github && (
                            <a
                              href={project.links.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors duration-[var(--duration-fast)] focus:outline-none focus-visible:ring-2 focus-visible:ring-focus/50 px-2 py-1"
                              style={{ borderRadius: 'var(--radius)' }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                              </svg>
                              GitHub
                            </a>
                          )}
                          {project.links.demo && (
                            <a
                              href={project.links.demo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors duration-[var(--duration-fast)] focus:outline-none focus-visible:ring-2 focus-visible:ring-focus/50 px-2 py-1"
                              style={{ borderRadius: 'var(--radius)' }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
                              </svg>
                              Live Demo
                            </a>
                          )}
                        </div>
                      </section>

                      {/* Features */}
                      {project.features && (
                        <section>
                          <h4 className="font-mono text-sm font-bold text-accent mb-3">
                            [ Features ]
                          </h4>
                          <ul className="space-y-1">
                            {project.features.map((feature, idx) => (
                              <li key={idx} className="text-fg text-sm">
                                • {feature}
                              </li>
                            ))}
                          </ul>
                        </section>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted font-mono text-sm">
              No projects found matching "{searchQuery}"
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 text-accent hover:text-focus font-mono text-sm underline focus:outline-none focus-visible:ring-2 focus-visible:ring-focus/50 px-2 py-1"
              style={{ borderRadius: 'var(--radius)' }}
            >
              Clear search
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ProjectsGrid