import { Component } from 'react'

/**
 * Keep the site shell usable when a route's lazy chunk cannot be evaluated.
 * Static hosts can return their HTML fallback for a missing hashed asset; a
 * contained recovery surface makes that failure actionable instead of
 * replacing the whole document with a blank page.
 */
class RouteErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      resetKey: props.resetKey,
    }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.resetKey !== state.resetKey) {
      return {
        error: null,
        resetKey: props.resetKey,
      }
    }

    return null
  }

  componentDidCatch(error, errorInfo) {
    // Keep the diagnostic in developer tools without exposing implementation
    // details or error text in the public page.
    console.error('Unable to load the current page.', error, errorInfo)
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <section
        className="tui-route-error mx-auto w-full max-w-3xl border border-line bg-card-bg/90 px-4 py-16 sm:px-6"
        role="alert"
        aria-labelledby="route-error-title"
      >
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">
          page unavailable
        </p>
        <h1 id="route-error-title" className="mt-3 font-mono text-2xl font-bold text-fg">
          This page could not load.
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-6 text-muted sm:text-base sm:leading-7">
          Reload the page to try again.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="tui-action mt-6 inline-flex min-h-11 items-center border border-line bg-card-bg px-4 py-2 font-mono text-sm text-muted"
        >
          <span className="tui-action-content">reload page ↻</span>
        </button>
      </section>
    )
  }
}

export default RouteErrorBoundary
