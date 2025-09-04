import { useEffect, useState } from 'react'
import { useAnimation } from 'framer-motion'

export const useScrollAnimation = () => {
  const controls = useAnimation()
  const [elementRef, setElementRef] = useState(null)

  useEffect(() => {
    if (!elementRef) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start({
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.6,
              ease: 'easeOut'
            }
          })
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    observer.observe(elementRef)
    return () => observer.disconnect()
  }, [elementRef, controls])

  return {
    ref: setElementRef,
    controls,
    initial: { opacity: 0, y: 30 }
  }
}

export const useStaggeredScrollAnimation = (itemCount = 0) => {
  const [elementRef, setElementRef] = useState(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (!elementRef || hasAnimated) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true)
          // Trigger staggered animations for child elements
          const children = elementRef.querySelectorAll('[data-stagger]')
          children.forEach((child, index) => {
            setTimeout(() => {
              child.style.opacity = '1'
              child.style.transform = 'translateY(0px)'
            }, index * 100)
          })
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    observer.observe(elementRef)
    return () => observer.disconnect()
  }, [elementRef, hasAnimated])

  return {
    ref: setElementRef,
    hasAnimated
  }
}