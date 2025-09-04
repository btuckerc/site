import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import ProjectCard from '../components/ProjectCard'
import CloseButton from '../components/CloseButton'
import { useRovingFocus } from '../hooks/useRovingFocus.jsx'
import projectsData from '../../data/projects.json'

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Fuzzy search implementation
  const fuzzyMatch = (text, query) => {
    if (!query) return true
    
    const queryLower = query.toLowerCase()
    const textLower = text.toLowerCase()
    
    let queryIndex = 0
    let score = 0
    
    for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
      if (textLower[i] === queryLower[queryIndex]) {
        queryIndex++
        score += 1
      }
    }
    
    return queryIndex === queryLower.length ? score : 0
  }

  // Filter projects based on search query
  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projectsData
    
    return projectsData
      .map(project => ({
        ...project,
        score: Math.max(
          fuzzyMatch(project.title, searchQuery),
          fuzzyMatch(project.blurb, searchQuery),
          ...project.tags.map(tag => fuzzyMatch(tag, searchQuery))
        )
      }))
      .filter(project => project.score > 0)
      .sort((a, b) => b.score - a.score)
  }, [searchQuery])

  // Create items for roving focus
  const projectItems = useMemo(() => 
    filteredProjects.map(project => ({ id: project.id, ...project })), 
    [filteredProjects]
  )

  const { getItemProps } = useRovingFocus('projects-list', projectItems)

  // Reset selection when search results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [searchQuery])

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <div className="absolute top-0 right-4">
            <CloseButton />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-fg mb-4 font-mono">
            <span className="text-accent">[</span> projects.json <span className="text-accent">]</span>
          </h1>
          <p className="text-muted max-w-2xl mx-auto text-sm font-mono">
            A collection of projects I've built. Use search to filter or browse all.
          </p>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8 max-w-lg mx-auto"
        >
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              data-search-input
              className="w-full px-4 py-3 bg-card-bg border border-line rounded-lg 
                focus:border-accent focus:outline-none transition-colors
                text-fg placeholder-muted font-mono text-sm"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          {searchQuery && (
            <div className="mt-2 text-xs text-muted font-mono text-center">
              {filteredProjects.length} result{filteredProjects.length !== 1 ? 's' : ''} found
            </div>
          )}
        </motion.div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="grid md:grid-cols-2 gap-6 mb-12"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                {...getItemProps(project, index)}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center py-12 mb-12"
          >
            <div className="text-muted font-mono">
              <div className="text-lg mb-2">¯\_(ツ)_/¯</div>
              <div className="text-sm">No projects found matching "{searchQuery}"</div>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 px-4 py-2 text-accent border border-accent/30 rounded
                  hover:bg-accent/10 transition-colors text-xs font-mono"
              >
                clear search
              </button>
            </div>
          </motion.div>
        )}

        {/* Bottom section - only show when not searching or no results */}
        {(!searchQuery || filteredProjects.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-center"
          >
            <div className="bg-card-bg border border-line rounded-lg p-6">
              <h3 className="text-lg font-bold text-fg mb-3 font-mono">
                <span className="text-accent">▸</span> more work
              </h3>
              <p className="text-muted mb-4 text-sm font-mono">
                Additional projects and contributions available on GitHub
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="https://github.com/tuckercraig"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded 
                    font-mono text-sm hover:bg-accent/90 transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-line text-muted 
                    hover:text-fg hover:border-accent transition-colors rounded font-mono text-sm
                    focus:outline-none focus:ring-2 focus:ring-accent/50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Projects