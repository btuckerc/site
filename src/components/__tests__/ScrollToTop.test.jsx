import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Link, MemoryRouter, useNavigate } from 'react-router-dom'
import ScrollToTop from '../ScrollToTop'

const BackButton = () => {
  const navigate = useNavigate()
  return <button type="button" onClick={() => navigate(-1)}>back</button>
}

const renderNavigation = (initialEntries = ['/']) =>
  render(
    <MemoryRouter
      initialEntries={initialEntries}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <ScrollToTop />
      <Link to="/article">article</Link>
      <Link to="/article#grain">article hash</Link>
      <div id="grain">grain section</div>
      <BackButton />
    </MemoryRouter>,
  )

describe('ScrollToTop', () => {
  it('resets pushed paths and scrolls hash links beneath the sticky header', async () => {
    const user = userEvent.setup()
    const scrollTo = vi.fn()
    const originalScrollTo = window.scrollTo
    window.scrollTo = scrollTo

    renderNavigation()
    await user.click(screen.getByRole('link', { name: 'article' }))
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'auto' })

    scrollTo.mockClear()
    await user.click(screen.getByRole('link', { name: 'article hash' }))
    await waitFor(() => {
      expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'smooth' })
    })

    window.scrollTo = originalScrollTo
  })

  it('leaves POP navigation to browser scroll restoration', async () => {
    const user = userEvent.setup()
    const scrollTo = vi.fn()
    const originalScrollTo = window.scrollTo
    window.scrollTo = scrollTo

    renderNavigation(['/home', '/article'])
    await user.click(screen.getByRole('button', { name: 'back' }))
    expect(scrollTo).not.toHaveBeenCalled()

    window.scrollTo = originalScrollTo
  })
})
