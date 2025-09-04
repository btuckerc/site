import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
    setExpandedItems(prev => {
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
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      newSet.delete(itemId)
      return newSet
    })
  }

  const closeAll = () => {
    setExpandedItems(new Set())
  }

  // Use keyboard navigation for the container
  useKeyboardNavigation(
    expandedItems.size > 0,
    closeAll,
    null,
    containerRef
  )

  return (
    <div ref={containerRef} className={`space-y-2 ${className}`}>
      {items.map((item, index) => {
        const isExpanded = expandedItems.has(item.id)
        
        return (
          <motion.div
            key={item.id}
            className={`relative ${itemClassName}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <motion.button
              onClick={() => toggleItem(item.id)}
              className="w-full text-left p-4 rounded-lg border border-border bg-card-bg hover:bg-accent/5 transition-colors focus-visible group"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              aria-expanded={isExpanded}
              aria-controls={`cascade-content-${item.id}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {renderItem(item)}
                </div>
                
                <motion.div
                  className="ml-4 text-accent"
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.div>
              </div>
            </motion.button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  id={`cascade-content-${item.id}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className={`mt-2 ml-4 pl-4 border-l border-accent/30 ${expandedClassName}`}>
                    {renderExpandedContent && renderExpandedContent(item, () => closeItem(item.id))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}

export default CascadeList