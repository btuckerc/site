import { useEffect, useMemo, useRef, useState, useDeferredValue } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import ProjectCard from '../components/ProjectCard'
import CloseButton from '../components/CloseButton'
import { useRovingFocus } from '../hooks/useRovingFocus.jsx'
import {
  createProjectSearchIndex,
  getProjectSearchSuggestions,
  getSearchHighlightTerms,
  searchProjects
} from '../utils/projectSearch'
import projectsData from '../../data/projects.json'

const filterOptions = [
  { id: 'all', label: 'all' },
  { id: 'github', label: 'github' },
  { id: 'local', label: 'local' },
  { id: 'agentic', label: 'agentic' }
]

const sortOptions = [
  { id: 'featured', label: 'featured' },
  { id: 'recent', label: 'recent' },
  { id: 'oldest', label: 'oldest' }
]

const projectSearchIndex = createProjectSearchIndex(projectsData)

const getProjectDate = (project, boundary = '12-31') => project.date || `${project.year}-${boundary}`

const matchesSourceFilter = (project, sourceFilter) => {
  const source = `${project.source || ''} ${project.visibility || ''}`.toLowerCase()
  const tags = (project.tags || []).join(' ').toLowerCase()
  const title = project.title.toLowerCase()

  switch (sourceFilter) {
    case 'github':
      return source.includes('github') || source.includes('public')
    case 'local':
      return source.includes('local') || source.includes('macmini')
    case 'agentic':
      return (
        tags.includes('agentic') ||
        title.includes('openclaw') ||
        title.includes('hermes') ||
        tags.includes('mcp') ||
        tags.includes('n8n')
      )
    default:
      return true
  }
}

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
  const [sourceFilter, setSourceFilter] = useState('all')
  const [areFiltersOpen, setAreFiltersOpen] = useState(false)
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

  const filteredProjectResults = useMemo(() => {
    const scopedResults = allSearchResults.filter(({ project }) => matchesSourceFilter(project, sourceFilter))
    return isSearching ? scopedResults : sortProjects(scopedResults, sortBy)
  }, [allSearchResults, isSearching, sortBy, sourceFilter])

  const filterCounts = useMemo(() => {
    const countSource = isSearching ? allSearchResults.map(({ project }) => project) : projectsData

    return filterOptions.reduce((counts, option) => {
      counts[option.id] = countSource.filter((project) => matchesSourceFilter(project, option.id)).length
      return counts
    }, {})
  }, [allSearchResults, isSearching])

  const suggestions = useMemo(
    () => getProjectSearchSuggestions(searchIndex, deferredSearchQuery, isSearching ? 6 : 8),
    [deferredSearchQuery, isSearching, searchIndex]
  )

  const searchTerms = useMemo(() => getSearchHighlightTerms(deferredSearchQuery), [deferredSearchQuery])

  const projectItems = useMemo(
    () => filteredProjectResults.map(({ project }) => ({ id: project.id, ...project })),
    [filteredProjectResults]
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
    ? `${filteredProjectResults.length} result${filteredProjectResults.length === 1 ? '' : 's'} for "${deferredSearchQuery}"`
    : `${filteredProjectResults.length} project${filteredProjectResults.length === 1 ? '' : 's'}`

  const hasOtherScopeMatches =
    isSearching && filteredProjectResults.length === 0 && allSearchResults.length > 0 && sourceFilter !== 'all'

  const emptyMessage = isSearching
    ? `No projects found for "${deferredSearchQuery}"${sourceFilter !== 'all' ? ` in ${sourceFilter}` : ''}.`
    : `No projects found in ${sourceFilter}.`

  const renderFilterButton = (option) => (
    <button
      key={option.id}
      type="button"
      onClick={() => setSourceFilter(option.id)}
      aria-pressed={sourceFilter === option.id}
      className={`tui-filter-option ${
        sourceFilter === option.id
          ? 'tui-filter-option-active'
          : ''
      }`}
      aria-label={`${option.label}, ${filterCounts[option.id] || 0} projects`}
    >
      <span>{option.label}</span>
      <span className="text-[0.68rem] text-muted">{filterCounts[option.id] || 0}</span>
    </button>
  )

  const renderSortButton = (option) => (
    <button
      key={option.id}
      type="button"
      onClick={() => setSortBy(option.id)}
      aria-pressed={sortBy === option.id}
      className={`tui-filter-option ${
        sortBy === option.id
          ? 'tui-filter-option-active'
          : ''
      }`}
    >
      <span>{option.label}</span>
    </button>
  )

  return (
    <>
      <Helmet>
        <title>Projects - Tucker Craig | Tools, Agents, and Systems</title>
        <meta name="description" content="Projects from Tucker Craig: agent systems, applied AI tools, public GitHub work, local prototypes, OpenClaw, Hermes, trading, iOS apps, and infrastructure projects." />
        <meta property="og:title" content="Projects - Tucker Craig Portfolio" />
        <meta property="og:description" content="Agent systems, applied AI tools, public GitHub work, local prototypes, OpenClaw, Hermes, trading, iOS apps, and infrastructure projects." />
        <meta property="og:url" content="https://btuckerc.dev/projects" />
        <link rel="canonical" href="https://btuckerc.dev/projects" />
      </Helmet>
      <div className="projects-page tui-page-shell min-h-svh pt-20 pb-28 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="tui-page-header mb-6 relative grid gap-4 md:block">
          <div className="justify-self-start md:absolute md:left-0 md:top-0">
            <CloseButton />
          </div>
          <div className="min-w-0 text-center">
            <h1 className="tui-page-title text-xl font-bold text-fg mb-2 font-mono">
              <span className="text-accent">[</span> projects <span className="text-accent">]</span>
            </h1>
            <p className="mx-auto max-w-[16rem] text-muted text-xs font-mono leading-relaxed sm:max-w-lg">
              public work, local prototypes, and the agent stuff I keep coming back to
            </p>
          </div>
        </div>

        <search className="tui-control-panel mb-6 block border border-line bg-card-bg p-3 font-mono" aria-label="Projects">
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
              placeholder="agent runtime, swift ios, dotfiles..."
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
            <button
              type="button"
              onClick={() => setAreFiltersOpen((isOpen) => !isOpen)}
              aria-expanded={areFiltersOpen}
              aria-controls="project-filter-panel"
              aria-label={`${areFiltersOpen ? 'Hide' : 'Show'} project filters`}
              className="tui-filter-button"
            >
              <span>filters</span>
              <span className="tui-filter-button-icon" aria-hidden="true">
                {areFiltersOpen ? '-' : '+'}
              </span>
            </button>

            <span
              id="projects-results-summary"
              className="tui-result-count"
              aria-live="polite"
              aria-atomic="true"
            >
              {resultSummary}
            </span>
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

          {areFiltersOpen && (
            <div id="project-filter-panel" className="tui-refine-drawer mt-3 border-t border-line/80 pt-3">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="tui-refine-label">source</span>
                {filterOptions.map(renderFilterButton)}
              </div>

              {!isSearching && (
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                  <span className="tui-refine-label">sort</span>
                  {sortOptions.map(renderSortButton)}
                </div>
              )}

              {isSearching && allSearchResults.length !== filteredProjectResults.length && sourceFilter !== 'all' && (
                <div className="mt-2 text-xs text-muted">
                  {allSearchResults.length} match{allSearchResults.length === 1 ? '' : 'es'} across all scopes.
                </div>
              )}
            </div>
          )}
        </search>

        {filteredProjectResults.length > 0 ? (
          <div className="space-y-3 mb-12">
            {filteredProjectResults.map(({ project, searchMeta }, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                searchMeta={searchMeta}
                searchTerms={searchTerms}
                focusProps={getItemProps(project, index)}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="tui-panel border border-line bg-card-bg/90 px-5 py-10 text-center mb-12 font-mono"
          >
            <div className="text-muted">
              <div className="text-sm">{emptyMessage}</div>
              <div className="mt-2 text-xs">Try fewer words, a different stack, or one of the scopes above.</div>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {hasOtherScopeMatches && (
                  <button
                    type="button"
                    onClick={() => setSourceFilter('all')}
                    className="tui-link-chip"
                  >
                    show all {allSearchResults.length} match{allSearchResults.length === 1 ? '' : 'es'}
                  </button>
                )}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="tui-link-chip"
                  >
                    clear search
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {(!isSearching || filteredProjectResults.length > 0) && (
          <div className="border-t border-line pt-6">
            <div className="text-xs font-mono text-muted">
              <div className="mb-2">
                <span className="text-accent">▸</span> more public work on <a href="https://github.com/btuckerc" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-fg transition-colors">github →</a>
              </div>
              <div>
                <span className="text-accent">▸</span> local-only projects are here when I could check the repo, docs, or running state
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
