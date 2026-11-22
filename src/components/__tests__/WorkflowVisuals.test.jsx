import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import {
  FinishingGap,
  RealCheckCases,
  ToolingSystemMap,
  WorkflowLoopDiagram,
  WorktreeDiagram,
} from '../WorkflowVisuals'

describe('WorkflowVisuals', () => {
  it('switches loop steps with click and keyboard arrows, Home, and End', async () => {
    const user = userEvent.setup()
    render(<WorkflowLoopDiagram />)

    const briefTab = screen.getByRole('tab', { name: /write brief/i })
    const worktreeTab = screen.getByRole('tab', { name: /worktree/i })
    const testTab = screen.getByRole('tab', { name: /test build/i })
    const panel = screen.getByRole('tabpanel')

    expect(briefTab).toHaveAttribute('aria-selected', 'true')
    expect(panel).toHaveAttribute('aria-labelledby', briefTab.id)
    expect(panel).toHaveAttribute('tabindex', '0')
    expect(screen.getByText(/design the change and write a short brief/i)).toBeInTheDocument()
    expect(screen.getByText(/flow: steps 01 through 04/i)).toBeInTheDocument()

    briefTab.focus()
    await user.keyboard('{ArrowRight}')
    expect(worktreeTab).toHaveAttribute('aria-selected', 'true')
    expect(panel).toHaveAttribute('aria-labelledby', worktreeTab.id)

    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('tab', { name: /review/i })).toHaveAttribute('aria-selected', 'true')

    await user.keyboard('{ArrowUp}')
    expect(worktreeTab).toHaveAttribute('aria-selected', 'true')

    await user.keyboard('{End}')
    expect(testTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText(/inkjoin/i)).toBeInTheDocument()

    await user.keyboard('{Home}')
    expect(briefTab).toHaveAttribute('aria-selected', 'true')
  })

  it('hides the example column in compact mode for Home', () => {
    render(<WorkflowLoopDiagram compact />)
    expect(screen.queryByText(/^example$/i)).not.toBeInTheDocument()
  })

  it('switches verification cases and computes proportional bar widths', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <MemoryRouter>
        <RealCheckCases />
      </MemoryRouter>
    )

    expect(screen.getByText(/262 MB/)).toBeInTheDocument()
    const winFills = container.querySelectorAll('.wf-bar-fill-win')
    expect(winFills).toHaveLength(3)
    expect(winFills[0].style.width).toBe('30%')
    expect(winFills[1].style.width).toBe('61%')
    expect(winFills[2].style.width).toBe('35%')

    const anglTab = screen.getByRole('tab', { name: /angl browser/i })
    await user.click(anglTab)
    expect(anglTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText(/227 MB/)).toBeInTheDocument()
    expect(screen.getByText(/287 MB/)).toBeInTheDocument()
    expect(container.querySelector('.wf-bar-fill-win').style.width).toBe('79%')

    const omaloTab = screen.getByRole('tab', { name: /omalo/i })
    await user.click(omaloTab)
    expect(omaloTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText(/\+ New catch: shows up once/)).toBeInTheDocument()
    expect(screen.getByText(/illustrative state diff/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /read the omalo catch check/i })).toHaveAttribute('href', '/projects/s3-amoled#catch-check')

    const herdwickTab = screen.getByRole('tab', { name: /herdwick/i })
    await user.click(herdwickTab)
    expect(herdwickTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText(/SSH \/ Tailscale/i)).toBeInTheDocument()
  })

  it('toggles between isolated worktrees and a shared checkout with test-before-merge order', async () => {
    const user = userEvent.setup()
    render(<WorktreeDiagram />)

    const isolatedBtn = screen.getByRole('button', { name: /separate git worktrees/i })
    const sharedBtn = screen.getByRole('button', { name: /one shared checkout/i })

    expect(isolatedBtn).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText(/review & test/i)).toBeInTheDocument()
    expect(screen.getByText(/merge once it passes/i)).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent(/review and test before merging/i)

    await user.click(sharedBtn)
    expect(sharedBtn).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('status')).toHaveTextContent(/share one checkout/i)
  })

  it('renders the four tooling cards with accessible external links and matching alert wording', () => {
    render(<ToolingSystemMap />)

    expect(screen.getByText(/coding session \(mac \+ linux\)/i)).toBeInTheDocument()
    expect(screen.getByText(/needs input or finishes/i)).toBeInTheDocument()

    const externalLinks = screen.getAllByRole('link')
    expect(externalLinks).toHaveLength(7)
    externalLinks.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('aria-describedby', 'new-tab-note')
      expect(link.textContent).not.toMatch(/[→↗←]/)
    })
  })

  it('renders every visual figure with an explicit figcaption', () => {
    const { container } = render(
      <MemoryRouter>
        <WorkflowLoopDiagram />
        <RealCheckCases />
        <WorktreeDiagram />
        <ToolingSystemMap />
        <FinishingGap />
      </MemoryRouter>
    )
    const figures = container.querySelectorAll('figure')
    expect(figures).toHaveLength(5)
    figures.forEach((figure) => {
      expect(figure.querySelector('figcaption')).not.toBeNull()
    })
  })
})
