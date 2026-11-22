import { useState, useRef } from 'react'
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation'

const CascadeList = ({
  items,
  renderItem,
  renderExpandedContent,
  className = '',
  itemClassName = '',
  expandedClassName = ''
}) => {
  const [expandedItems, setExpandedItems] = useState(new Set())
  const containerRef = useRef(null)

  const toggleItem = (itemId) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  const closeItem = (itemId) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev)
      newSet.delete(itemId)
      return newSet
    })
  }

  const closeAll = () => {
    setExpandedItems(new Set())
  }

  useKeyboardNavigation(
    expandedItems.size > 0,
    closeAll,
    null,
    containerRef
  )

  return (
    <div ref={containerRef} className={`space-y-2 ${className}`}>
      {items.map((item) => {
        const isExpanded = expandedItems.has(item.id)

        return (
          <div key={item.id} className={`relative ${itemClassName}`}>
            <button
              type="button"
              onClick={() => toggleItem(item.id)}
              className="w-full text-left p-4 border border-border bg-card-bg hover:bg-hover-bg transition-colors group"
              aria-expanded={isExpanded}
              aria-controls={`cascade-content-${item.id}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {renderItem(item)}
                </div>

                <div
                  className={`ml-4 text-accent transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                  aria-hidden="true"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>

            {isExpanded && (
              <div id={`cascade-content-${item.id}`} className="overflow-hidden tui-enter">
                <div className={`mt-2 ml-4 pl-4 border-l border-accent/30 ${expandedClassName}`}>
                  {renderExpandedContent && renderExpandedContent(item, () => closeItem(item.id))}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default CascadeList
