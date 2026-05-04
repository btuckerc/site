import { useCallback, useEffect, useState } from 'react'
import { useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

export const usePointerDepth = ({
  maxRotateX = 0.5,
  maxRotateY = 0.65,
  maxTranslateX = 0,
  maxTranslateY = 0,
  liftZ = 0,
  hoverScale = 1,
  mode = 'repel',
  perspective = 1400,
  spring = { stiffness: 160, damping: 24, mass: 0.4 }
} = {}) => {
  const shouldReduceMotion = useReducedMotion()
  const [canUsePointerDepth, setCanUsePointerDepth] = useState(false)
  const isDepthDisabled = shouldReduceMotion || !canUsePointerDepth
  const isAttracting = mode === 'attract'
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const pointerActive = useMotionValue(0)
  const smoothX = useSpring(pointerX, spring)
  const smoothY = useSpring(pointerY, spring)
  const smoothActive = useSpring(pointerActive, spring)
  const rotateX = useTransform(
    smoothY,
    [-1, 1],
    isAttracting ? [-maxRotateX, maxRotateX] : [maxRotateX, -maxRotateX]
  )
  const rotateY = useTransform(
    smoothX,
    [-1, 1],
    isAttracting ? [maxRotateY, -maxRotateY] : [-maxRotateY, maxRotateY]
  )
  const x = useTransform(smoothX, [-1, 1], [-maxTranslateX, maxTranslateX])
  const y = useTransform(smoothY, [-1, 1], [-maxTranslateY, maxTranslateY])
  const z = useTransform(smoothActive, [0, 1], [0, liftZ])
  const scale = useTransform(smoothActive, [0, 1], [1, hoverScale])

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined

    const media = window.matchMedia('(hover: hover) and (pointer: fine)')
    const syncPointerCapability = () => setCanUsePointerDepth(media.matches)
    syncPointerCapability()

    if (media.addEventListener) {
      media.addEventListener('change', syncPointerCapability)
      return () => media.removeEventListener('change', syncPointerCapability)
    }

    media.addListener(syncPointerCapability)
    return () => media.removeListener(syncPointerCapability)
  }, [])

  const updatePointerDepth = useCallback((event) => {
    if (isDepthDisabled) return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2

    pointerX.set(clamp(x, -1, 1))
    pointerY.set(clamp(y, -1, 1))
    pointerActive.set(1)
  }, [isDepthDisabled, pointerActive, pointerX, pointerY])

  const resetPointerDepth = useCallback(() => {
    pointerX.set(0)
    pointerY.set(0)
    pointerActive.set(0)
  }, [pointerActive, pointerX, pointerY])

  useEffect(() => {
    if (isDepthDisabled) resetPointerDepth()
  }, [isDepthDisabled, resetPointerDepth])

  return {
    depthHandlers: isDepthDisabled ? {} : {
      onMouseMove: updatePointerDepth,
      onMouseLeave: resetPointerDepth,
      onBlur: resetPointerDepth
    },
    depthStyle: isDepthDisabled ? undefined : {
      rotateX,
      rotateY,
      x,
      y,
      z,
      scale,
      transformPerspective: perspective,
      transformStyle: 'preserve-3d'
    },
    resetPointerDepth
  }
}

export default usePointerDepth
