import { useEffect, useMemo, useRef, useState, useDeferredValue } from 'react'
import { useLocation } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb'
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
import { compareFeaturedProjects, getProjectDate } from '../seo/routesMeta'

const sortOptions = [
  { id: 'featured', label: 'featured' },
  { id: 'recent', label: 'recent' },
  { id: 'oldest', label: 'oldest' }
]

const projectSearchIndex = createProjectSearchIndex(projectsData)

const sortProjects = (projectResults, sortBy) =>
  [...projectResults].sort((a, b) => {
    const aProject = a.project
    const bProject = b.project

    switch (sortBy) {
      case 'featured':
        return compareFeaturedProjects(aProject, bProject)
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
    if (
      event.key !== 'Escape' ||
      event.isComposing ||
      event.nativeEvent?.isComposing ||
      event.keyCode === 229 ||
      event.metaKey ||
      event.ctrlKey ||
      event.altKey
    ) {
      return
    }

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
      <PageMeta route="/projects" />
      <div className="projects-page tui-page-shell min-h-svh">
        <div className="tui-rail">
          <Breadcrumb items={[{ label: 'home', to: '/' }, { label: 'projects' }]} />

          <header className="mb-6">
            <h1 className="tui-page-title text-3xl font-bold leading-tight text-fg sm:text-4xl">
              Projects
            </h1>
          </header>

          <search className="tui-control-panel mb-6 block p-3.5 font-mono" aria-label="Projects">
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
                className="tui-input tui-search-input h-10 w-full py-2 text-sm text-fg"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="tui-clear-button tui-search-clear text-muted"
                  aria-label="Clear project search"
                >
                  <span aria-hidden="true">x</span>
                </button>
              )}
            </div>

            <div className="tui-filter-bar mt-2.5 text-xs text-muted">
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
              <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-muted">related:</span>
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.label}
                    type="button"
                    onClick={() => applySearch(suggestion.label)}
                    className="tui-chip px-2.5 py-1 text-muted hover:text-fg"
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
            <div className="tui-panel px-5 py-10 text-center mb-12 font-mono tui-enter">
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
            </div>
          )}

          {(!isSearching || sortedProjectResults.length > 0) && (
            <div className="border-t border-line pt-6">
              <div className="text-xs font-mono text-muted">
                <span className="text-accent" aria-hidden="true">&gt;</span>{' '}
                more public work on{' '}
                <a
                  href="https://github.com/btuckerc"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-describedby="new-tab-note"
                  className="text-accent underline underline-offset-4 hover:text-fg transition-colors"
                >
                  github
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Projects
