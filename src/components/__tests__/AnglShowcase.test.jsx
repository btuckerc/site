import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import AnglShowcase from '../AnglShowcase'

describe('AnglShowcase', () => {
  it('renders grounded Wikipedia memory bars, process architecture, window layout, and built-in controls', () => {
    const { container } = render(<AnglShowcase />)

    const figure = container.querySelector('figure.angl-showcase')
    expect(figure).not.toBeNull()
    expect(figure.querySelector('figcaption')).not.toBeNull()

    const barsGroup = screen.getByRole('group', { name: /memory footprint/i })
    expect(within(barsGroup).getByText(/227 MB/)).toBeInTheDocument()
    expect(within(barsGroup).getByText(/287 MB/)).toBeInTheDocument()
    expect(within(barsGroup).getByText(/427 MB/)).toBeInTheDocument()

    const fills = container.querySelectorAll('.angl-bar-fill')
    expect(fills).toHaveLength(3)
    expect(fills[0].style.width).toBe('53%')
    expect(fills[1].style.width).toBe('67%')
    expect(fills[2].style.width).toBe('100%')

    expect(screen.getByText(/angl --lists/i)).toBeInTheDocument()
    expect(screen.getByText(/no URL bar by default/i)).toBeInTheDocument()
    expect(screen.getByText('~/.config/angl/')).toBeInTheDocument()
  })
})
