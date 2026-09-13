import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import RouteErrorBoundary from '../RouteErrorBoundary'

const BrokenPage = () => {
  throw new Error('chunk failed')
}

describe('RouteErrorBoundary', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('keeps a recovery action visible when a lazy route throws', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <RouteErrorBoundary resetKey="/">
        <BrokenPage />
      </RouteErrorBoundary>,
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'This page could not load.' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reload page/i })).toBeInTheDocument()
  })
})
