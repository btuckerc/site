import { useEffect, useMemo, useRef, useState, useDeferredValue } from 'react'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import ProjectCard from '../components/ProjectCard'
import { useRovingFocus } from '../hooks/useRovingFocus.jsx'
import {
  createProjectSearchIndex,
  getProjectSearchSuggestions,
  getSearchHighlightTerms,
  searchProjects
} from '../utils/projectSearch'
import projectsData from '../../data/projects.json'
import PageMeta from '../components/PageMeta'

const sortOptions = [
  { id: 'featured', label: 'featured' },
  { id: 'recent', label: 'recent' },
  { id: 'oldest', label: 'oldest' }
]

const projectSearchIndex = createProjectSearchIndex(projectsData)

const getProjectDate = (project, boundary = '12-31') => project.date || `${project.year}-${boundary}`

const sortProjects = (projectResults, sortBy) =>
  [...projectResults].sort((a, b) => {
    const aProject = a.project
    const bProject = b.project

    switch (sortBy) {
      case 'featured': {
        const featuredDelta = (bProject.featured || 0) - (aProject.featured || 0)
        if (featuredDelta !== 0) return featuredDelta
        return new Date(getProjectDate(bProject)) - new Date(getProjectDate(aProject))
      }
      case 'recent':
        return new Date(getProjectDate(bProject)) - new Date(getProjectDate(aProject))
      case 'oldest':
        return new Date(getProjectDate(aProject, '01-01')) - new Date(getProjectDate(bProject, '01-01'))
      default:
        return 0
    }
  })

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('featured')
  const searchInputRef = useRef(null)
  const location = useLocation()
  const deferredSearchQuery = useDeferredValue(searchQuery)
  const isSearching = deferredSearchQuery.trim().length > 0

  const searchIndex = projectSearchIndex

  useEffect(() => {
    if (!location.state?.focusSearch) return

    window.requestAnimationFrame(() => {
      searchInputRef.current?.focus()
      searchInputRef.current?.select()
    })
  }, [location.state])

  const allSearchResults = useMemo(
    () => searchProjects(searchIndex, deferredSearchQuery),
    [deferredSearchQuery, searchIndex]
  )

  const sortedProjectResults = useMemo(
    () => (isSearching ? allSearchResults : sortProjects(allSearchResults, sortBy)),
    [allSearchResults, isSearching, sortBy]
  )

  const suggestions = useMemo(
    () => getProjectSearchSuggestions(searchIndex, deferredSearchQuery, isSearching ? 6 : 8),
    [deferredSearchQuery, isSearching, searchIndex]
  )

  const searchTerms = useMemo(() => getSearchHighlightTerms(deferredSearchQuery), [deferredSearchQuery])

  const projectItems = useMemo(
    () => sortedProjectResults.map(({ project }) => ({ id: project.id, ...project })),
    [sortedProjectResults]
  )

  const { getItemProps } = useRovingFocus('projects-list', projectItems)

  const applySearch = (query) => {
    setSearchQuery(query)
    window.requestAnimationFrame(() => {
      searchInputRef.current?.focus()
    })
  }

  const clearSearch = () => {
    setSearchQuery('')
    window.requestAnimationFrame(() => {
      searchInputRef.current?.focus()
    })
  }

  const handleSearchKeyDown = (event) => {
    if (event.key !== 'Escape') return

    event.stopPropagation()
    if (searchQuery) {
      setSearchQuery('')
    } else {
      searchInputRef.current?.blur()
    }
  }

  const resultSummary = isSearching
    ? `${sortedProjectResults.length} result${sortedProjectResults.length === 1 ? '' : 's'} for "${deferredSearchQuery}"`
    : `${sortedProjectResults.length} project${sortedProjectResults.length === 1 ? '' : 's'}`

  const renderSortButton = (option) => (
    <button
      key={option.id}
      type="button"
      onClick={() => setSortBy(option.id)}
      aria-pressed={sortBy === option.id}
      className={`tui-filter-option${sortBy === option.id ? ' tui-filter-option-active' : ''}`}
    >
      {option.label}
    </button>
  )

  return (
    <>
      <PageMeta
        title="Projects — Tucker Craig"
        description="Selected public projects by Tucker Craig, with code and context where available."
        url="https://btuckerc.dev/projects"
      />
      <div className="projects-page tui-page-shell min-h-svh pb-28 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="tui-page-header mb-6">
          <h1 className="tui-page-title text-center text-xl font-bold text-fg font-mono">
            <span className="text-accent">[</span> projects <span className="text-accent">]</span>
          </h1>
        </div>

        <search className="tui-control-panel mb-4 block border border-line bg-card-bg p-3 font-mono" aria-label="Projects">
          <div className="tui-search-field">
            <label htmlFor="project-search" className="sr-only">Find projects</label>
            <span className="tui-search-prefix" aria-hidden="true">/</span>
            <input
              ref={searchInputRef}
              id="project-search"
              type="text"
              role="searchbox"
              inputMode="search"
              enterKeyHint="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="macos, menu bar, python, agents…"
              data-search-input
              aria-describedby="projects-results-summary"
              autoComplete="off"
              spellCheck="true"
              className="tui-input tui-search-input h-10 w-full border border-line py-2 text-sm text-fg focus:border-accent focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="tui-clear-button tui-search-clear text-muted"
                aria-label="Clear project search"
              >
                <span aria-hidden="true" className="tui-search-clear-glyph">x</span>
              </button>
            )}
          </div>

          <div className="tui-filter-bar mt-2 text-xs text-muted">
            <span
              id="projects-results-summary"
              className="tui-result-count"
              aria-live="polite"
              aria-atomic="true"
            >
              {resultSummary}
            </span>

            {!isSearching && (
              <div className="tui-sort-group" role="group" aria-label="Sort projects">
                <span className="tui-refine-label" aria-hidden="true">sort</span>
                {sortOptions.map(renderSortButton)}
              </div>
            )}
          </div>

          {isSearching && suggestions.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-muted">related:</span>
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.label}
                  type="button"
                  onClick={() => applySearch(suggestion.label)}
                  className="tui-chip border border-line/80 px-2 py-0.5 text-muted hover:text-fg"
                >
                  <span>{suggestion.label}</span>
                </button>
              ))}
            </div>
          )}
        </search>

        {sortedProjectResults.length > 0 ? (
          <ul className="tui-project-list mb-10" aria-label="Projects">
            {sortedProjectResults.map(({ project, searchMeta }, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                searchMeta={searchMeta}
                searchTerms={searchTerms}
                focusProps={getItemProps(project, index)}
              />
            ))}
          </ul>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.12 }}
            className="tui-panel border border-line bg-card-bg px-5 py-10 text-center mb-12 font-mono"
          >
            <div className="text-muted">
              <div className="text-sm">No projects found for &quot;{deferredSearchQuery}&quot;.</div>
              <div className="mt-2 text-xs">Try fewer words or a different stack.</div>
              {searchQuery && (
                <div className="mt-5 flex justify-center">
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="tui-link-chip"
                  >
                    clear search
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {(!isSearching || sortedProjectResults.length > 0) && (
          <div className="border-t border-line pt-6">
            <div className="text-xs font-mono text-muted">
              <div className="mb-2">
                <span className="text-accent">▸</span> more public work on <a href="https://github.com/btuckerc" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-fg transition-colors">github →</a>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </>
  )
}

export default Projects
