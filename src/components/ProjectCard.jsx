import { Fragment, memo, useId, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GameCapture } from './StarterSelectionCapture'

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Links back into this site stay in the current tab; everything else opens a new one.
const isSameSite = (url) => /^https:\/\/btuckerc\.dev(\/|$)/.test(url)

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

  const validLinks = useMemo(
    () => Object.entries(project.links || {}).filter(([, url]) => Boolean(url)),
    [project.links]
  )
  const contentId = useId()
  const matchedFields = searchMeta?.matchedFields?.filter(Boolean) || []
  const highlightConfig = useMemo(() => createHighlightConfig(searchTerms), [searchTerms])

  const hasExpandableContent =
    project.overview ||
    project.media ||
    (project.stack && project.stack.length > 0) ||
    (project.features && project.features.length > 0) ||
    validLinks.length > 0

  return (
    <li className={`tui-project-row font-mono${isExpanded ? ' is-open' : ''}`}>
      <button
        type="button"
        onClick={() => hasExpandableContent && setIsExpanded(!isExpanded)}
        className="tui-project-trigger"
        disabled={!hasExpandableContent}
        aria-expanded={hasExpandableContent ? isExpanded : undefined}
        aria-controls={hasExpandableContent ? contentId : undefined}
        {...focusProps}
      >
        {hasExpandableContent ? (
          <span className="tui-disclosure tui-project-mark" aria-hidden="true" />
        ) : (
          <span className="tui-project-mark" aria-hidden="true" />
        )}
        <span className="tui-project-title">
          <HighlightedText text={project.title} highlightConfig={highlightConfig} />
          {project.fork && <span className="tui-project-label">fork</span>}
          {project.source === 'local' && <span className="tui-project-label">local</span>}
        </span>
        {project.blurb && (
          <span className="tui-project-blurb">
            <HighlightedText text={project.blurb} highlightConfig={highlightConfig} />
          </span>
        )}
        <span className="tui-project-year">{project.year}</span>
        {matchedFields.length > 0 && (
          <span className="tui-project-match tui-result-meta">
            <span className="text-accent">match</span> {matchedFields.join(' · ')}
          </span>
        )}
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="project-content"
            id={contentId}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.14, ease: [0.4, 0, 0.2, 1] }}
            className="tui-project-detail"
          >
            {project.media && (
              <GameCapture
                className={`project-capture${project.media.height > project.media.width ? ' project-capture-portrait' : ''}`}
                src={project.media.video}
                poster={project.media.poster}
                downloadSrc={null}
                width={project.media.width}
                height={project.media.height}
                label="preview"
                title={project.media.title}
                alt={project.media.alt}
                caption={project.media.caption}
                captureNote={null}
              />
            )}

            <dl className="tui-project-facts">
              {project.overview && (
                <div className="tui-project-fact">
                  <dt>overview</dt>
                  <dd>
                    <HighlightedText text={project.overview} highlightConfig={highlightConfig} />
                  </dd>
                </div>
              )}

              {project.stack && project.stack.length > 0 && (
                <div className="tui-project-fact">
                  <dt>stack</dt>
                  <dd>
                    {project.stack.map((tech, index) => (
                      <Fragment key={tech}>
                        {index > 0 && ', '}
                        <HighlightedText text={tech} highlightConfig={highlightConfig} />
                      </Fragment>
                    ))}
                  </dd>
                </div>
              )}

              {project.features && project.features.length > 0 && (
                <div className="tui-project-fact">
                  <dt>features</dt>
                  <dd>
                    <ul className="tui-project-features">
                      {project.features.map((feature) => (
                        <li key={feature}>
                          <HighlightedText text={feature} highlightConfig={highlightConfig} />
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              )}

              {validLinks.length > 0 && (
                <div className="tui-project-fact">
                  <dt>links</dt>
                  <dd className="tui-project-links">
                    {validLinks.map(([key, url]) => (
                      <a
                        key={key}
                        href={url}
                        {...(isSameSite(url) ? {} : {
                          target: '_blank',
                          rel: 'noopener noreferrer',
                          'aria-describedby': 'new-tab-note'
                        })}
                        className="tui-link-chip"
                      >
                        {key}
                      </a>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
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
