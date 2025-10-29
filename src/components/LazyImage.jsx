import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LazyImage = ({ 
  src, 
  alt, 
  width,
  height,
  className = '',
  placeholderClassName = '',
  fallback = null 
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '50px'
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleLoad = () => {
    setIsLoaded(true)
  }

  const handleError = () => {
    setHasError(true)
  }

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      <AnimatePresence>
        {!isLoaded && !hasError && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 bg-card-bg border border-border flex items-center justify-center ${placeholderClassName}`}
          >
            <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {hasError && fallback ? (
        fallback
      ) : (
        isInView && (
          <motion.img
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={`w-full h-full object-cover ${className}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            onLoad={handleLoad}
            onError={handleError}
          />
        )
      )}
    </div>
  )
}

export default LazyImage