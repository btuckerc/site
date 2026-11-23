import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import {
  AgentStackDiagram,
  AgentWorkbench,
  FinishingGap,
  FullCouncilDiagram,
  RealCheckCases,
  ToolingSystemMap,
  WorktreeDiagram,
} from '../WorkflowVisuals'

describe('WorkflowVisuals', () => {
  it('switches 3D isometric model stack layers with click and keyboard arrows while keeping inactive panels inert', async () => {
    const user = userEvent.setup()
    const { container } = render(<AgentStackDiagram />)

    const directTab = screen.getByRole('tab', { name: /direct/i })
    const buildTab = screen.getByRole('tab', { name: /build/i })
    const gateTab = screen.getByRole('tab', { name: /council & audit/i })

    expect(directTab).toHaveAttribute('aria-selected', 'true')
    const activePanel = screen.getByRole('tabpanel')
    expect(activePanel).toHaveAttribute('aria-labelledby', directTab.id)
    expect(activePanel).toHaveTextContent(/Gemini 4 Neon/)
    expect(activePanel).toHaveTextContent(/Claude Opus 5.5/)

    const slots = container.querySelectorAll('.wf-layer-panel-stack > .wf-panel-slot')
    expect(slots).toHaveLength(3)
    expect(slots[0].hasAttribute('inert')).toBe(false)
    expect(slots[1].hasAttribute('inert')).toBe(true)

    directTab.focus()
    await user.keyboard('{ArrowRight}')
    expect(buildTab).toHaveAttribute('aria-selected', 'true')
    const buildPanel = screen.getByRole('tabpanel')
    expect(buildPanel).toHaveTextContent(/GPT-6\.2 Sol/)
    expect(buildPanel).toHaveTextContent(/Qwen 3\.8 27B/)
    expect(buildPanel).toHaveTextContent(/model_ok: true/)
    expect(slots[0].hasAttribute('inert')).toBe(true)
    expect(slots[1].hasAttribute('inert')).toBe(false)

    await user.keyboard('{End}')
    expect(gateTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent(/Full Council/)
    expect(screen.getByRole('tabpanel')).toHaveTextContent(/PASS \/ BLOCK \/ UNVERIFIED/)

    await user.keyboard('{Home}')
    expect(directTab).toHaveAttribute('aria-selected', 'true')
  })

  it('switches Full Council seats across all 5 blind reviewers and shows anti-gaming rules', async () => {
    const user = userEvent.setup()
    const { container } = render(<FullCouncilDiagram />)

    const solTab = screen.getByRole('tab', { name: /sol/i })
    const opusTab = screen.getByRole('tab', { name: /opus/i })
    const fableTab = screen.getByRole('tab', { name: /fable/i })
    const astraTab = screen.getByRole('tab', { name: /astra/i })
    const neonTab = screen.getByRole('tab', { name: /neon/i })

    expect(solTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent(/GPT-6\.2 Sol/)
    expect(screen.getByRole('tabpanel')).toHaveTextContent(/Breaker/)

    solTab.focus()
    await user.keyboard('{ArrowRight}')
    expect(opusTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent(/Claude Opus 5\.5/)

    await user.click(fableTab)
    expect(fableTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent(/Claude Fable/)

    await user.click(astraTab)
    expect(astraTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent(/GPT-6\.2 Astra/)

    await user.click(neonTab)
    expect(neonTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent(/Gemini 4 Neon/)

    const seatSlots = container.querySelectorAll('.wf-seat-panel-stack > .wf-panel-slot')
    expect(seatSlots).toHaveLength(5)
    expect(seatSlots[4].hasAttribute('inert')).toBe(false)
    expect(seatSlots[0].hasAttribute('inert')).toBe(true)

    expect(screen.getByText(/Blind Opus tiebreaker/i)).toBeInTheDocument()
  })

  it('switches the Home AgentWorkbench cleanly between Current model stack and Full council', async () => {
    const user = userEvent.setup()
    render(<AgentWorkbench />)

    const stackTab = screen.getByRole('tab', { name: /current model stack/i })
    const councilTab = screen.getByRole('tab', { name: /full council/i })

    expect(stackTab).toHaveAttribute('aria-selected', 'true')
    expect(councilTab).toHaveAttribute('aria-selected', 'false')

    await user.click(councilTab)
    expect(councilTab).toHaveAttribute('aria-selected', 'true')
    expect(stackTab).toHaveAttribute('aria-selected', 'false')
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

  it('renders the four stage-wired tooling cards with accessible external links and real stack copy', () => {
    render(<ToolingSystemMap />)

    expect(screen.getByText(/coding session \(mac \+ nous linux gpu\)/i)).toBeInTheDocument()
    expect(screen.getByText(/needs input or finishes/i)).toBeInTheDocument()
    expect(screen.getByText(/feeds 01 direct/i)).toBeInTheDocument()
    expect(screen.getByText(/local Qwen/i)).toBeInTheDocument()

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
        <AgentStackDiagram />
        <FullCouncilDiagram />
        <RealCheckCases />
        <WorktreeDiagram />
        <ToolingSystemMap />
        <FinishingGap />
      </MemoryRouter>
    )
    const figures = container.querySelectorAll('figure')
    expect(figures).toHaveLength(6)
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
