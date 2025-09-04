import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CascadeList from '../CascadeList'

// Mock framer-motion to avoid animation complexities in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => <div>{children}</div>,
}))

describe('CascadeList', () => {
  const mockItems = [
    { id: 'item1', title: 'First Item', content: 'First item content' },
    { id: 'item2', title: 'Second Item', content: 'Second item content' },
    { id: 'item3', title: 'Third Item', content: 'Third item content' }
  ]

  const mockRenderItem = (item) => (
    <div>
      <h3>{item.title}</h3>
      <p>{item.content}</p>
    </div>
  )

  const mockRenderExpandedContent = (item, close) => (
    <div>
      <p>Expanded content for {item.title}</p>
      <button onClick={close}>Close</button>
    </div>
  )

  it('renders all items correctly', () => {
    render(
      <CascadeList
        items={mockItems}
        renderItem={mockRenderItem}
        renderExpandedContent={mockRenderExpandedContent}
      />
    )

    // Check that all items are rendered
    expect(screen.getByText('First Item')).toBeInTheDocument()
    expect(screen.getByText('Second Item')).toBeInTheDocument()
    expect(screen.getByText('Third Item')).toBeInTheDocument()
  })

  it('expands and collapses items when clicked', async () => {
    const user = userEvent.setup()
    
    render(
      <CascadeList
        items={mockItems}
        renderItem={mockRenderItem}
        renderExpandedContent={mockRenderExpandedContent}
      />
    )

    // Initially, expanded content should not be visible
    expect(screen.queryByText('Expanded content for First Item')).not.toBeInTheDocument()

    // Click the first item button to expand  
    const firstItemButton = screen.getByRole('button', { name: /first item/i })
    await user.click(firstItemButton)

    // Wait for expanded content to appear
    await waitFor(() => {
      expect(screen.getByText('Expanded content for First Item')).toBeInTheDocument()
    })

    // Check that aria-expanded is updated
    expect(firstItemButton).toHaveAttribute('aria-expanded', 'true')

    // Click again to collapse
    await user.click(firstItemButton)

    // Wait for content to disappear
    await waitFor(() => {
      expect(screen.queryByText('Expanded content for First Item')).not.toBeInTheDocument()
    })

    expect(firstItemButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('handles keyboard navigation correctly', async () => {
    const user = userEvent.setup()
    
    render(
      <CascadeList
        items={mockItems}
        renderItem={mockRenderItem}
        renderExpandedContent={mockRenderExpandedContent}
      />
    )

    const firstItemButton = screen.getAllByRole('button')[0]
    
    // Focus the first item
    firstItemButton.focus()
    expect(firstItemButton).toHaveFocus()

    // Press Enter to expand
    await user.keyboard('{Enter}')
    
    await waitFor(() => {
      expect(screen.getByText('Expanded content for First Item')).toBeInTheDocument()
    })

    // Press Escape to close
    await user.keyboard('{Escape}')
    
    await waitFor(() => {
      expect(screen.queryByText('Expanded content for First Item')).not.toBeInTheDocument()
    })
  })

  it('supports Space key for expansion', async () => {
    const user = userEvent.setup()
    
    render(
      <CascadeList
        items={mockItems}
        renderItem={mockRenderItem}
        renderExpandedContent={mockRenderExpandedContent}
      />
    )

    const firstItemButton = screen.getAllByRole('button')[0]
    firstItemButton.focus()

    // Press Space to expand
    await user.keyboard(' ')
    
    await waitFor(() => {
      expect(screen.getByText('Expanded content for First Item')).toBeInTheDocument()
    })

    expect(firstItemButton).toHaveAttribute('aria-expanded', 'true')
  })

  it('allows multiple items to be expanded simultaneously', async () => {
    const user = userEvent.setup()
    
    render(
      <CascadeList
        items={mockItems}
        renderItem={mockRenderItem}
        renderExpandedContent={mockRenderExpandedContent}
      />
    )

    const buttons = screen.getAllByRole('button')
    
    // Expand first item
    await user.click(buttons[0])
    await waitFor(() => {
      expect(screen.getByText('Expanded content for First Item')).toBeInTheDocument()
    })

    // Expand second item
    await user.click(buttons[1])
    await waitFor(() => {
      expect(screen.getByText('Expanded content for Second Item')).toBeInTheDocument()
    })

    // Both should be expanded
    expect(screen.getByText('Expanded content for First Item')).toBeInTheDocument()
    expect(screen.getByText('Expanded content for Second Item')).toBeInTheDocument()
  })

  it('properly sets ARIA attributes', () => {
    render(
      <CascadeList
        items={mockItems}
        renderItem={mockRenderItem}
        renderExpandedContent={mockRenderExpandedContent}
      />
    )

    const buttons = screen.getAllByRole('button')
    
    buttons.forEach((button, index) => {
      expect(button).toHaveAttribute('aria-expanded', 'false')
      expect(button).toHaveAttribute('aria-controls', `cascade-content-${mockItems[index].id}`)
    })
  })

  it('calls close function from expanded content', async () => {
    const user = userEvent.setup()
    
    render(
      <CascadeList
        items={mockItems}
        renderItem={mockRenderItem}
        renderExpandedContent={mockRenderExpandedContent}
      />
    )

    // Expand first item
    const firstItemButton = screen.getAllByRole('button')[0]
    await user.click(firstItemButton)

    await waitFor(() => {
      expect(screen.getByText('Expanded content for First Item')).toBeInTheDocument()
    })

    // Click the close button within expanded content
    const closeButton = screen.getByText('Close')
    await user.click(closeButton)

    await waitFor(() => {
      expect(screen.queryByText('Expanded content for First Item')).not.toBeInTheDocument()
    })
  })

  it('applies custom CSS classes', () => {
    const { container } = render(
      <CascadeList
        items={mockItems}
        renderItem={mockRenderItem}
        renderExpandedContent={mockRenderExpandedContent}
        className="custom-container"
        itemClassName="custom-item"
        expandedClassName="custom-expanded"
      />
    )

    expect(container.firstChild).toHaveClass('custom-container')
  })
})