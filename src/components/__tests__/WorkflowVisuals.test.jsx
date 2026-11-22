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
  it('switches loop steps with click and keyboard arrows, Home, and End while exposing only the active artifact', async () => {
    const user = userEvent.setup()
    const { container } = render(<WorkflowLoopDiagram />)

    const briefTab = screen.getByRole('tab', { name: /write brief/i })
    const worktreeTab = screen.getByRole('tab', { name: /worktree/i })
    const testTab = screen.getByRole('tab', { name: /test build/i })

    expect(briefTab).toHaveAttribute('aria-selected', 'true')
    const activePanel = screen.getByRole('tabpanel')
    expect(activePanel).toHaveAttribute('aria-labelledby', briefTab.id)
    expect(activePanel).toHaveAttribute('tabindex', '0')
    expect(activePanel).toHaveTextContent(/design the change and name the check/i)

    // Active artifact is accessible to assistive technology while inactive stacked panels stay inert.
    expect(screen.getByRole('group', { name: /illustrative brief · angl browser/i })).toBeInTheDocument()
    expect(screen.queryByRole('group', { name: /illustrative worktrees/i })).toBeNull()

    const slots = container.querySelectorAll('.wf-detail-stack > .wf-panel-slot')
    expect(slots).toHaveLength(4)
    expect(slots[0].hasAttribute('inert')).toBe(false)
    expect(slots[1].hasAttribute('inert')).toBe(true)
    expect(slots[1]).toHaveAttribute('aria-hidden', 'true')

    briefTab.focus()
    await user.keyboard('{ArrowRight}')
    expect(worktreeTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', worktreeTab.id)
    expect(screen.getByRole('group', { name: /illustrative worktrees/i })).toBeInTheDocument()
    expect(slots[0].hasAttribute('inert')).toBe(true)
    expect(slots[1].hasAttribute('inert')).toBe(false)

    // Horizontal tablist leaves ArrowDown free for page scrolling instead of changing tabs.
    await user.keyboard('{ArrowDown}')
    expect(worktreeTab).toHaveAttribute('aria-selected', 'true')

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: /review/i })).toHaveAttribute('aria-selected', 'true')

    await user.keyboard('{ArrowLeft}')
    expect(worktreeTab).toHaveAttribute('aria-selected', 'true')

    await user.keyboard('{End}')
    expect(testTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent(/227 MB on Wikipedia/i)

    await user.keyboard('{Home}')
    expect(briefTab).toHaveAttribute('aria-selected', 'true')
  })

  it('hides inline example prose in compact mode for Home while keeping the accessible mini-artifact', () => {
    const { container } = render(<WorkflowLoopDiagram compact />)
    expect(container.querySelector('.wf-detail-example-inline')).toBeNull()
    expect(screen.getByRole('group', { name: /illustrative brief · angl browser/i })).toBeInTheDocument()
  })

  it('switches verification cases with honest range bands, process diagram, memory grid, and SSH topology', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <MemoryRouter>
        <RealCheckCases />
      </MemoryRouter>
    )

    const activeWinPanel = screen.getByRole('tabpanel')
    expect(activeWinPanel).toHaveTextContent(/262 MB/)
    expect(activeWinPanel).toHaveTextContent(/788–931 MB/)
    const winFills = activeWinPanel.querySelectorAll('.wf-bar-fill-win')
    expect(winFills).toHaveLength(3)
    expect(winFills[0].style.width).toBe('28%')
    expect(winFills[1].style.width).toBe('58%')
    expect(winFills[2].style.width).toBe('35%')
    expect(activeWinPanel.querySelectorAll('.wf-bar-range-band')).toHaveLength(2)

    const anglTab = screen.getByRole('tab', { name: /angl browser/i })
    await user.click(anglTab)
    expect(anglTab).toHaveAttribute('aria-selected', 'true')
    const anglPanel = screen.getByRole('tabpanel')
    expect(anglPanel).toHaveTextContent(/227 MB/)
    expect(anglPanel).toHaveTextContent(/287 MB/)
    expect(anglPanel.querySelector('.wf-bar-fill-win').style.width).toBe('79%')
    expect(anglPanel).toHaveTextContent(/short-lived helper/i)

    const omaloTab = screen.getByRole('tab', { name: /omalo/i })
    await user.click(omaloTab)
    expect(omaloTab).toHaveAttribute('aria-selected', 'true')
    const omaloPanel = screen.getByRole('tabpanel')
    expect(omaloPanel).toHaveTextContent(/\+ New catch: shows up once/)
    expect(omaloPanel).toHaveTextContent(/illustrative state diff/i)
    expect(screen.getByRole('link', { name: /read the omalo catch check/i })).toHaveAttribute('href', '/projects/s3-amoled#catch-check')

    const herdwickTab = screen.getByRole('tab', { name: /herdwick/i })
    await user.click(herdwickTab)
    expect(herdwickTab).toHaveAttribute('aria-selected', 'true')
    const herdwickPanel = screen.getByRole('tabpanel')
    expect(herdwickPanel).toHaveTextContent(/SSH \/ Tailscale/i)
    expect(herdwickPanel).toHaveTextContent(/iOS Keychain/i)

    const omaloSlot = container.querySelector('[id$="-case-panel-omalo"]')
    expect(omaloSlot.hasAttribute('inert')).toBe(true)
  })

  it('toggles between isolated worktrees and a shared checkout with zero-shift stacked stages', async () => {
    const user = userEvent.setup()
    const { container } = render(<WorktreeDiagram />)

    const isolatedBtn = screen.getByRole('button', { name: /separate git worktrees/i })
    const sharedBtn = screen.getByRole('button', { name: /one shared checkout/i })

    expect(isolatedBtn).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('status')).toHaveTextContent(/review and test before merging/i)

    const stageSlots = container.querySelectorAll('.wf-wt-stage > .wf-panel-slot')
    expect(stageSlots).toHaveLength(2)
    expect(stageSlots[0]).toHaveAttribute('data-active', 'true')
    expect(stageSlots[1]).toHaveAttribute('data-active', 'false')
    expect(stageSlots[1].hasAttribute('inert')).toBe(true)

    await user.click(sharedBtn)
    expect(sharedBtn).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('status')).toHaveTextContent(/share one checkout/i)
    expect(stageSlots[0].hasAttribute('inert')).toBe(true)
    expect(stageSlots[1].hasAttribute('inert')).toBe(false)
  })

  it('renders the four stage-wired tooling cards with accessible external links and grounded Pace Bar copy', () => {
    render(<ToolingSystemMap />)

    expect(screen.getByText(/coding session \(mac \+ linux\)/i)).toBeInTheDocument()
    expect(screen.getByText(/needs input or finishes/i)).toBeInTheDocument()
    expect(screen.getByText(/feeds 01 brief/i)).toBeInTheDocument()
    expect(screen.getByText(/informs 02 worktree/i)).toBeInTheDocument()
    expect(screen.getByText(/so i can send small jobs to local models/i)).toBeInTheDocument()

    const externalLinks = screen.getAllByRole('link')
    expect(externalLinks).toHaveLength(7)
    externalLinks.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('aria-describedby', 'new-tab-note')
      expect(link.textContent).not.toMatch(/[→↗←]/)
    })
  })

  it('renders every visual figure with an explicit figcaption and paired finishing ledger', () => {
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
    const rows = container.querySelectorAll('.wf-finish-row')
    expect(rows).toHaveLength(4)
    rows.forEach((row) => {
      const kickers = row.querySelectorAll('.wf-finish-cell-kicker')
      expect(kickers).toHaveLength(2)
      expect(kickers[0]).toHaveTextContent('Easy place to stop')
      expect(kickers[1]).toHaveTextContent('What makes it usable')
      expect(kickers[0]).not.toHaveAttribute('aria-hidden', 'true')
      expect(kickers[1]).not.toHaveAttribute('aria-hidden', 'true')
    })
  })
})
