import { Fragment, memo, useId, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const createHighlightConfig = (terms = []) => {
  const highlightTerms = terms
    .filter((term) => term && term.length >= 3)
    .sort((a, b) => b.length - a.length)

  if (highlightTerms.length === 0) return null

  return {
    pattern: new RegExp(`(${highlightTerms.map(escapeRegExp).join('|')})`, 'ig'),
    terms: highlightTerms.map((term) => term.toLowerCase())
  }
}

const HighlightedText = ({ text, highlightConfig }) => {
  const value = String(text ?? '')

  if (!value || !highlightConfig) return value

  const parts = value.split(highlightConfig.pattern)

  return parts.map((part, index) => {
    const isMatch = highlightConfig.terms.some((term) => part.toLowerCase() === term)
    return isMatch ? (
      <mark key={`${part}-${index}`} className="tui-search-mark">
        {part}
      </mark>
    ) : (
      <Fragment key={`${part}-${index}`}>{part}</Fragment>
    )
  })
}

const ProjectCardComponent = ({ project, focusProps = {}, searchMeta = null, searchTerms = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(true)
  const [isStackExpanded, setIsStackExpanded] = useState(true)
  const [isFeaturesExpanded, setIsFeaturesExpanded] = useState(true)
  const [isLinksExpanded, setIsLinksExpanded] = useState(true)
  const [isVerificationExpanded, setIsVerificationExpanded] = useState(true)

  const metaBadges = useMemo(
    () => [
      project.source,
      project.activity,
      project.visibility
    ].filter(Boolean),
    [project.activity, project.source, project.visibility]
  )

  const validLinks = useMemo(
    () => Object.entries(project.links || {}).filter(([, url]) => Boolean(url)),
    [project.links]
  )
  const contentId = useId()
  const matchedFields = searchMeta?.matchedFields?.filter(Boolean) || []
  const highlightConfig = useMemo(() => createHighlightConfig(searchTerms), [searchTerms])

  // Show expandable arrow only if there's additional content
  const hasExpandableContent = 
    project.overview || 
    (project.stack && project.stack.length > 0) || 
    (project.features && project.features.length > 0) || 
    validLinks.length > 0 ||
    project.verified

  return (
    <div className="tui-panel border border-line bg-card-bg p-5 font-mono">
      {/* Header - always visible */}
      <button
        type="button"
        onClick={() => hasExpandableContent && setIsExpanded(!isExpanded)}
        className="w-full text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
        disabled={!hasExpandableContent}
        aria-expanded={hasExpandableContent ? isExpanded : undefined}
        aria-controls={hasExpandableContent ? contentId : undefined}
        {...focusProps}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-fg">
              <HighlightedText text={project.title} highlightConfig={highlightConfig} />
            </h3>
            {project.fork && (
              <span className="text-xs text-muted border border-line px-2 py-0.5 inline-block mt-1">forked</span>
            )}
            {metaBadges.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {metaBadges.map((badge, index) => (
                  <span
                    key={`${badge}-${index}`}
                    className="text-[0.7rem] leading-none text-muted border border-line px-2 py-1"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>
          <span className="text-sm text-accent shrink-0">{project.year}</span>
        </div>
        {project.blurb && (
          <p className="text-sm text-muted leading-relaxed mb-3">
            <HighlightedText text={project.blurb} highlightConfig={highlightConfig} />
          </p>
        )}
        {matchedFields.length > 0 && (
          <div className="tui-result-meta mb-3 text-[0.72rem] leading-relaxed text-muted">
            <span className="text-accent">match</span> {matchedFields.join(' · ')}
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted min-w-0">
            {project.tags && project.tags.length > 0 ? (
              <>
                {project.tags.slice(0, 3).map((tag, index) => (
                  <Fragment key={tag}>
                    {index > 0 && <span> · </span>}
                    <HighlightedText text={tag} highlightConfig={highlightConfig} />
                  </Fragment>
                ))}
                {project.tags.length > 3 && ` · +${project.tags.length - 3}`}
              </>
            ) : (
              <span className="text-muted/50">no tags</span>
            )}
          </div>
          {hasExpandableContent && (
            <span className="text-accent text-sm ml-2">{isExpanded ? '▼' : '▶'}</span>
          )}
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="project-content"
            id={contentId}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.14, ease: [0.4, 0, 0.2, 1] }}
            className="mt-4 pt-4 border-t border-line space-y-4 text-sm"
          >
          {/* Overview */}
          {project.overview && (
            <div>
              <button
                type="button"
                onClick={() => setIsOverviewExpanded(!isOverviewExpanded)}
                aria-expanded={isOverviewExpanded}
                className="text-accent mb-2 font-semibold flex items-center gap-2 hover:text-fg transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              >
                <span>{isOverviewExpanded ? '▼' : '▶'}</span>
                <span>overview</span>
              </button>
              {isOverviewExpanded && (
                <div className="text-muted pl-3 leading-relaxed">
                  <HighlightedText text={project.overview} highlightConfig={highlightConfig} />
                </div>
              )}
            </div>
          )}

          {/* Tech Stack */}
          {project.stack && project.stack.length > 0 && (
            <div>
              <button
                type="button"
                onClick={() => setIsStackExpanded(!isStackExpanded)}
                aria-expanded={isStackExpanded}
                className="text-accent mb-2 font-semibold flex items-center gap-2 hover:text-fg transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              >
                <span>{isStackExpanded ? '▼' : '▶'}</span>
                <span>stack</span>
              </button>
              {isStackExpanded && (
                <div className="text-muted pl-3">
                  {project.stack.map((tech, index) => (
                    <Fragment key={tech}>
                      {index > 0 && <span>, </span>}
                      <HighlightedText text={tech} highlightConfig={highlightConfig} />
                    </Fragment>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Features */}
          {project.features && project.features.length > 0 && (
            <div>
              <button
                type="button"
                onClick={() => setIsFeaturesExpanded(!isFeaturesExpanded)}
                aria-expanded={isFeaturesExpanded}
                className="text-accent mb-2 font-semibold flex items-center gap-2 hover:text-fg transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              >
                <span>{isFeaturesExpanded ? '▼' : '▶'}</span>
                <span>features</span>
              </button>
              {isFeaturesExpanded && (
                <div className="pl-3 space-y-1">
                  {project.features.map((feature, idx) => (
                    <div key={idx} className="text-muted">
                      · <HighlightedText text={feature} highlightConfig={highlightConfig} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Verification */}
          {project.verified && (
            <div>
              <button
                type="button"
                onClick={() => setIsVerificationExpanded(!isVerificationExpanded)}
                aria-expanded={isVerificationExpanded}
                className="text-accent mb-2 font-semibold flex items-center gap-2 hover:text-fg transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              >
                <span>{isVerificationExpanded ? '▼' : '▶'}</span>
                <span>verified</span>
              </button>
              {isVerificationExpanded && (
                <div className="text-muted pl-3 leading-relaxed">
                  <HighlightedText text={project.verified} highlightConfig={highlightConfig} />
                </div>
              )}
            </div>
          )}

          {/* Links - more prominent */}
          {validLinks.length > 0 && (
            <div className="border-t border-line pt-4 mt-4">
              <button
                type="button"
                onClick={() => setIsLinksExpanded(!isLinksExpanded)}
                aria-expanded={isLinksExpanded}
                className="text-accent mb-3 font-semibold flex items-center gap-2 hover:text-fg transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              >
                <span>{isLinksExpanded ? '▼' : '▶'}</span>
                <span>links</span>
              </button>
              {isLinksExpanded && (
                <div className="pl-3 flex flex-wrap gap-3">
                  {validLinks.map(([key, url]) => (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tui-link-chip"
                    >
                      {key} →
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const ProjectCard = memo(ProjectCardComponent, (previous, next) => (
  previous.project === next.project &&
  previous.searchMeta === next.searchMeta &&
  previous.searchTerms === next.searchTerms &&
  previous.focusProps?.tabIndex === next.focusProps?.tabIndex &&
  previous.focusProps?.['aria-selected'] === next.focusProps?.['aria-selected']
))

export default ProjectCard
