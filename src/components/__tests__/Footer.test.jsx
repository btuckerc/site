import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Link } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import Footer from '../Footer'
import { useState } from 'react'

vi.mock('../../hooks/useFont', () => ({ useFont: () => ({ fontId: 'neue-montreal', fonts: [], setFont: vi.fn() }) }))

describe('command dock', () => {
  it('keeps the same accessible button while moving between home and interior pages', () => {
    const open = vi.fn()
    render(<MemoryRouter><Link to="/projects">Projects</Link><Link to="/">Home</Link><Footer onCommandPaletteToggle={open} /></MemoryRouter>)
    const button = screen.getByRole('button', { name: 'Open command palette (type colon for commands)' })
    expect(button.parentElement).toHaveClass('is-floating')
    fireEvent.click(screen.getByRole('link', { name: 'Projects' }))
    expect(button.parentElement).toHaveClass('is-compact')
    expect(button).toHaveAttribute('aria-describedby', 'command-dock-tooltip')
    expect(button.querySelector('.command-dock-colon')).toHaveTextContent(':')
    expect(button.querySelector('.command-dock-roof')).toBeNull()
    fireEvent.click(button)
    expect(open).toHaveBeenCalledOnce()
    fireEvent.click(screen.getByRole('link', { name: 'Home' }))
    expect(screen.getByRole('button', { name: 'Open command palette (type colon for commands)' })).toBe(button)
    expect(button.parentElement).toHaveClass('is-floating')
  })
  it('toggles open and closed on consecutive clicks', () => {
    function Harness() {
      const [open, setOpen] = useState(false)
      return <MemoryRouter><Footer isCommandPaletteOpen={open} onCommandPaletteToggle={() => setOpen(v => !v)} /></MemoryRouter>
    }
    render(<Harness />)
    fireEvent.click(screen.getByRole('button', { name: /^Open command palette/ }))
    const close = screen.getByRole('button', { name: /^Close command palette/ })
    expect(close).toHaveAttribute('aria-expanded', 'true')
    fireEvent.click(close)
    expect(screen.getByRole('button', { name: /^Open command palette/ })).toHaveAttribute('aria-expanded', 'false')
  })
})
