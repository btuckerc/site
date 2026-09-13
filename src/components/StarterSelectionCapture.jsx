import { useEffect, useId, useRef, useState } from 'react'
import '../styles/media-capture.css'

const defaultVideo = '/media/s3-amoled/pokemon-agent-battle.mp4'
const defaultPoster = '/media/s3-amoled/pokemon-agent-battle-poster.png'
const defaultDownload = '/media/s3-amoled/pokemon-agent-battle.gif'
const defaultAlt = 'Full-panel replay showing manual Mudkip selection, a recorded Luna request in progress, the battle against Zigzagoon, and the completed result, with goal and status rails.'
const defaultCaption = 'Host-rendered UI replay · real Luna request and battle · model wait retained.'

const readReducedMotionPreference = () => (
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
)

/**
 * A small, native video surface that can be reused for reviewed game captures.
 * The default export preserves the current starter-selection copy while the
 * named component allows a future battle or Grain capture to supply its own
 * media, dimensions, labels, and caption.
 */
export const GameCapture = ({
  src = defaultVideo,
  poster = defaultPoster,
  downloadSrc = defaultDownload,
  downloadLabel = 'download GIF ↗',
  sourceType = 'video/mp4',
  width = 448,
  height = 368,
  alt = defaultAlt,
  caption = defaultCaption,
  label = 'game capture',
  title = 'Defeat the Zigzagoon',
  captureNote = 'The battle and Luna’s response are real. This replay shows them on a computer using the device’s actual interface. It doesn’t include a recording of the device or a voice command.',
  className = '',
}) => {
  const captionId = useId()
  const videoRef = useRef(null)
  const reducedMotionRef = useRef(readReducedMotionPreference())
  const userPausedRef = useRef(false)
  const lifecyclePauseRef = useRef(false)
  const resumeAfterLifecycleRef = useRef(false)
  const inViewRef = useRef(false)
  const pageVisibleRef = useRef(typeof document === 'undefined' || !document.hidden)
  const hasStartedRef = useRef(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    reducedMotionRef.current,
  )
  const [isPlaying, setIsPlaying] = useState(false)
  const [canHover, setCanHover] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia?.('(hover: hover) and (pointer: fine)').matches
  ))
  const [mediaHovered, setMediaHovered] = useState(false)
  const [mediaFocused, setMediaFocused] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setCanHover(query.matches)
    if (query.addEventListener) {
      query.addEventListener('change', update)
    } else {
      query.addListener?.(update)
    }

    return () => {
      if (query.removeEventListener) {
        query.removeEventListener('change', update)
      } else {
        query.removeListener?.(update)
      }
    }
  }, [])

  useEffect(() => {
    reducedMotionRef.current = prefersReducedMotion
  }, [prefersReducedMotion])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined

    video.muted = true
    video.playsInline = true
    video.loop = true

    const playIfAllowed = () => {
      if (
        !inViewRef.current ||
        !pageVisibleRef.current ||
        reducedMotionRef.current ||
        userPausedRef.current ||
        !video.paused
      ) {
        return
      }

      // Muted playback is generally permitted, but a policy or a browser
      // setting can still reject it. The poster and native play control remain
      // usable in that case; do not force retries or add a custom player.
      const playPromise = video.play()
      playPromise?.catch(() => {})
    }

    const pauseForLifecycle = () => {
      if (video.paused) return
      resumeAfterLifecycleRef.current = true
      lifecyclePauseRef.current = true
      video.pause()
    }

    const maybeResume = () => {
      if (!resumeAfterLifecycleRef.current) return
      if (!inViewRef.current || !pageVisibleRef.current || reducedMotionRef.current) return
      if (userPausedRef.current) return

      resumeAfterLifecycleRef.current = false
      playIfAllowed()
    }

    const handlePlay = () => {
      hasStartedRef.current = true
      lifecyclePauseRef.current = false
      userPausedRef.current = false
      setIsPlaying(true)
    }

    const handlePause = () => {
      setIsPlaying(false)
      if (lifecyclePauseRef.current) {
        lifecyclePauseRef.current = false
        return
      }
      if (hasStartedRef.current) userPausedRef.current = true
    }

    const handleVisibilityChange = () => {
      pageVisibleRef.current = !document.hidden
      if (document.hidden) {
        pauseForLifecycle()
      } else {
        maybeResume()
      }
    }

    const handleIntersection = ([entry]) => {
      inViewRef.current = Boolean(entry?.isIntersecting)
      if (!inViewRef.current) {
        pauseForLifecycle()
      } else {
        maybeResume()
        playIfAllowed()
      }
    }

    const motionQuery = typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null
    const handleMotionChange = (event) => {
      reducedMotionRef.current = event.matches
      setPrefersReducedMotion(event.matches)
      if (event.matches) {
        pauseForLifecycle()
      } else {
        maybeResume()
        playIfAllowed()
      }
    }

    video.addEventListener('play', handlePlay)
    video.addEventListener('playing', handlePlay)
    video.addEventListener('pause', handlePause)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    if (typeof IntersectionObserver === 'function') {
      const observer = new IntersectionObserver(handleIntersection, {
        threshold: [0, 0.1],
      })
      observer.observe(video)

      if (motionQuery?.addEventListener) {
        motionQuery.addEventListener('change', handleMotionChange)
      } else {
        motionQuery?.addListener?.(handleMotionChange)
      }

      return () => {
        observer.disconnect()
        video.removeEventListener('play', handlePlay)
        video.removeEventListener('playing', handlePlay)
        video.removeEventListener('pause', handlePause)
        document.removeEventListener('visibilitychange', handleVisibilityChange)
        if (motionQuery?.removeEventListener) {
          motionQuery.removeEventListener('change', handleMotionChange)
        } else {
          motionQuery?.removeListener?.(handleMotionChange)
        }
      }
    }

    // Older browsers without IntersectionObserver still get a normal poster
    // and native controls, with one visibility-gated playback attempt.
    inViewRef.current = true
    window.requestAnimationFrame(playIfAllowed)
    if (motionQuery?.addEventListener) {
      motionQuery.addEventListener('change', handleMotionChange)
    } else {
      motionQuery?.addListener?.(handleMotionChange)
    }

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('playing', handlePlay)
      video.removeEventListener('pause', handlePause)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (motionQuery?.removeEventListener) {
        motionQuery.removeEventListener('change', handleMotionChange)
      } else {
        motionQuery?.removeListener?.(handleMotionChange)
      }
    }
  }, [])

  const togglePlayback = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      userPausedRef.current = false
      resumeAfterLifecycleRef.current = false
      const playPromise = video.play()
      playPromise?.catch(() => {})
      return
    }

    userPausedRef.current = true
    resumeAfterLifecycleRef.current = false
    lifecyclePauseRef.current = false
    video.pause()
  }

  return (
    <figure
      className={`starter-capture ${className}`.trim()}
      data-reduced-motion={prefersReducedMotion ? 'true' : 'false'}
      style={{ '--starter-capture-aspect-ratio': `${width} / ${height}` }}
    >
      <p className="starter-capture-label">{label}</p>
      <strong className="starter-capture-title">{title}</strong>
      <div
        className="starter-capture-media"
        onPointerEnter={() => setMediaHovered(true)}
        onPointerLeave={() => setMediaHovered(false)}
        onFocus={() => setMediaFocused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setMediaFocused(false)
        }}
      >
        <video
          ref={videoRef}
          className="starter-capture-video"
          controls={!canHover || mediaHovered || mediaFocused}
          tabIndex={0}
          preload="metadata"
          poster={poster}
          width={width}
          height={height}
          muted
          playsInline
          loop
          aria-label={alt}
          aria-describedby={captionId}
        >
          <source src={src} type={sourceType} />
          Your browser does not support this video.
        </video>
      </div>
      <figcaption id={captionId} className="starter-capture-caption">
        <span>{caption}</span>
        <span className="starter-capture-actions">
          <button
            type="button"
            className="starter-capture-toggle"
            onClick={togglePlayback}
            aria-label={`${isPlaying ? 'Pause' : 'Play'} ${title.toLowerCase()} capture`}
            aria-pressed={isPlaying}
          >
            {isPlaying ? 'pause' : 'play'}
          </button>
          {downloadSrc && (
            <a href={downloadSrc} download className="starter-capture-download">
              {downloadLabel}
            </a>
          )}
        </span>
      </figcaption>
      {captureNote && (
        <details className="starter-capture-note">
          <summary>about this capture</summary>
          <p>{captureNote}</p>
        </details>
      )}
    </figure>
  )
}

const StarterSelectionCapture = (props) => <GameCapture {...props} />

export default StarterSelectionCapture
