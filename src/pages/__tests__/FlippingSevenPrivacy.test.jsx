import { render, screen, waitFor } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import FlippingSevenPrivacy from '../FlippingSevenPrivacy'

const renderPage = () =>
  render(
    <HelmetProvider>
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <FlippingSevenPrivacy />
      </MemoryRouter>
    </HelmetProvider>,
  )

describe('FlippingSevenPrivacy', () => {
  it('renders the policy and contact information', () => {
    renderPage()

    expect(
      screen.getByRole('heading', { level: 1, name: 'Simple app. Simple privacy.' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/we do not collect, transmit, sell, or share personal data/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'btuckerc.dev@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:btuckerc.dev@gmail.com',
    )
  })

  it('publishes page-specific document metadata', async () => {
    renderPage()

    await waitFor(() => {
      expect(document.title).toBe('Privacy Policy — Flipping Seven Calculator')
      expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
        'href',
        'https://btuckerc.dev/privacy/flipping-seven-calculator',
      )
    })
  })
})
