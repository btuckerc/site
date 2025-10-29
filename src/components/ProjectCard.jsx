import { useState } from 'react'

const ProjectCard = ({ project }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(true)
  const [isStackExpanded, setIsStackExpanded] = useState(true)
  const [isFeaturesExpanded, setIsFeaturesExpanded] = useState(true)
  const [isLinksExpanded, setIsLinksExpanded] = useState(true)

  // Show expandable arrow only if there's additional content
  const hasExpandableContent = 
    project.overview || 
    (project.stack && project.stack.length > 0) || 
    (project.features && project.features.length > 0) || 
    (project.links && Object.keys(project.links).length > 0)

  return (
    <div className="border border-line bg-card-bg p-5 font-mono">
      {/* Header - always visible */}
      <button
        onClick={() => hasExpandableContent && setIsExpanded(!isExpanded)}
        className="w-full text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
        disabled={!hasExpandableContent}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-fg">{project.title}</h3>
            {project.fork && (
              <span className="text-xs text-muted border border-line px-2 py-0.5 inline-block mt-1">forked</span>
            )}
          </div>
          <span className="text-sm text-accent shrink-0">{project.year}</span>
        </div>
        {project.blurb && (
          <p className="text-sm text-muted leading-relaxed mb-3">{project.blurb}</p>
        )}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted">
            {project.tags && project.tags.length > 0 ? (
              <>
                {project.tags.slice(0, 3).join(' · ')}
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
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-line space-y-4 text-sm">
          {/* Overview */}
          {project.overview && (
            <div>
              <button
                onClick={() => setIsOverviewExpanded(!isOverviewExpanded)}
                className="text-accent mb-2 font-semibold flex items-center gap-2 hover:text-fg transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              >
                <span>{isOverviewExpanded ? '▼' : '▶'}</span>
                <span>overview</span>
              </button>
              {isOverviewExpanded && (
                <div className="text-muted pl-3 leading-relaxed">{project.overview}</div>
              )}
            </div>
          )}

          {/* Tech Stack */}
          {project.stack && project.stack.length > 0 && (
            <div>
              <button
                onClick={() => setIsStackExpanded(!isStackExpanded)}
                className="text-accent mb-2 font-semibold flex items-center gap-2 hover:text-fg transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              >
                <span>{isStackExpanded ? '▼' : '▶'}</span>
                <span>stack</span>
              </button>
              {isStackExpanded && (
                <div className="text-muted pl-3">{project.stack.join(', ')}</div>
              )}
            </div>
          )}

          {/* Features */}
          {project.features && project.features.length > 0 && (
            <div>
              <button
                onClick={() => setIsFeaturesExpanded(!isFeaturesExpanded)}
                className="text-accent mb-2 font-semibold flex items-center gap-2 hover:text-fg transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              >
                <span>{isFeaturesExpanded ? '▼' : '▶'}</span>
                <span>features</span>
              </button>
              {isFeaturesExpanded && (
                <div className="pl-3 space-y-1">
                  {project.features.map((feature, idx) => (
                    <div key={idx} className="text-muted">· {feature}</div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Links - more prominent */}
          {project.links && Object.keys(project.links).length > 0 && (
            <div className="border-t border-line pt-4 mt-4">
              <button
                onClick={() => setIsLinksExpanded(!isLinksExpanded)}
                className="text-accent mb-3 font-semibold flex items-center gap-2 hover:text-fg transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              >
                <span>{isLinksExpanded ? '▼' : '▶'}</span>
                <span>links</span>
              </button>
              {isLinksExpanded && (
                <div className="pl-3 flex flex-wrap gap-3">
                  {Object.entries(project.links).map(([key, url]) => (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-accent/10 border border-accent/30 text-accent hover:bg-accent hover:text-bg transition-colors font-medium"
                    >
                      {key} →
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ProjectCard
