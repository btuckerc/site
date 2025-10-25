import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import ProjectCard from '../components/ProjectCard'
import CloseButton from '../components/CloseButton'
import { useRovingFocus } from '../hooks/useRovingFocus.jsx'
import projectsData from '../../data/projects.json'

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [sortBy, setSortBy] = useState('featured')

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

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let projects = projectsData
    
    // Apply search filter if query exists
    if (searchQuery.trim()) {
      projects = projectsData
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
    } else {
      // Apply sorting when no search query
      projects = [...projectsData].sort((a, b) => {
        switch (sortBy) {
          case 'featured':
            // Sort by featured value (higher first), then by date
            const aFeatured = a.featured || 0
            const bFeatured = b.featured || 0
            if (aFeatured !== bFeatured) return bFeatured - aFeatured
            // Use date if available, otherwise fall back to year
            const aDate = a.date || `${a.year}-12-31`
            const bDate = b.date || `${b.year}-12-31`
            return new Date(bDate) - new Date(aDate)
          case 'recent':
            // Use date if available, otherwise fall back to year
            const aRecentDate = a.date || `${a.year}-12-31`
            const bRecentDate = b.date || `${b.year}-12-31`
            return new Date(bRecentDate) - new Date(aRecentDate)
          case 'oldest':
            // Use date if available, otherwise fall back to year
            const aOldestDate = a.date || `${a.year}-01-01`
            const bOldestDate = b.date || `${b.year}-01-01`
            return new Date(aOldestDate) - new Date(bOldestDate)
          default:
            return 0
        }
      })
    }
    
    return projects
  }, [searchQuery, sortBy])

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
    <div className="projects-page min-h-screen pt-20 pb-24 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 relative">
          <div className="absolute top-0 left-0">
            <CloseButton />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-fg mb-2 font-mono">
              <span className="text-accent">[</span> projects <span className="text-accent">]</span>
            </h1>
            <p className="text-muted text-xs font-mono">
              use search to filter or browse all
            </p>
          </div>
        </div>

        {/* Search and Sort */}
        <div className="mb-6 space-y-3">
          {/* Search Bar */}
          <div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="search..."
              data-search-input
              className="w-full px-3 py-2 bg-card-bg border border-line 
                focus:border-accent focus:outline-none
                text-fg placeholder-muted font-mono text-sm"
            />
            {searchQuery && (
              <div className="mt-1 text-xs text-muted font-mono">
                {filteredProjects.length} result{filteredProjects.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          {/* Sort Options - only show when not searching */}
          {!searchQuery && (
            <div className="flex items-center gap-2 text-sm font-mono">
              <span className="text-muted">sort:</span>
              <button
                onClick={() => setSortBy('featured')}
                className={`px-2 py-1 transition-colors ${
                  sortBy === 'featured' 
                    ? 'text-accent border-b border-accent' 
                    : 'text-muted hover:text-fg'
                }`}
              >
                featured
              </button>
              <span className="text-line">|</span>
              <button
                onClick={() => setSortBy('recent')}
                className={`px-2 py-1 transition-colors ${
                  sortBy === 'recent' 
                    ? 'text-accent border-b border-accent' 
                    : 'text-muted hover:text-fg'
                }`}
              >
                recent
              </button>
              <span className="text-line">|</span>
              <button
                onClick={() => setSortBy('oldest')}
                className={`px-2 py-1 transition-colors ${
                  sortBy === 'oldest' 
                    ? 'text-accent border-b border-accent' 
                    : 'text-muted hover:text-fg'
                }`}
              >
                oldest
              </button>
            </div>
          )}
        </div>

        {/* Projects List */}
        {filteredProjects.length > 0 ? (
          <div className="space-y-3 mb-12">
            {filteredProjects.map((project, index) => (
              <div key={project.id} {...getItemProps(project, index)}>
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
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

        {/* Bottom section */}
        {(!searchQuery || filteredProjects.length > 0) && (
          <div className="border-t border-line pt-6">
            <div className="text-xs font-mono text-muted">
              <div className="mb-2">
                <span className="text-accent">▸</span> more work on <a href="https://github.com/tuckercraig" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-fg transition-colors">github →</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Projects
