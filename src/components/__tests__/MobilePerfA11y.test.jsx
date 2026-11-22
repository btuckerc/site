import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { describe, it, expect, vi, afterEach } from 'vitest'
import Projects from '../../pages/Projects'
import ContactForm from '../ContactForm'
import CommandPalette from '../CommandPalette'
import Footer from '../Footer'
import { GameCapture } from '../StarterSelectionCapture'
import { FocusProvider } from '../../hooks/useRovingFocus.jsx'
import { ThemeProvider } from '../../hooks/useTheme.jsx'
import { useHotkeys } from '../../hooks/useHotkeys'
import { useActiveSection } from '../../hooks/useActiveSection'
import { safeGetItem, safeSetItem } from '../../utils/safeStorage'
import App from '../../App'

vi.mock('../../hooks/useFont', () => ({
  FontProvider: ({ children }) => children,
  useFont: () => ({
    fontId: 'neue-montreal',
    fonts: [
      { id: 'neue-montreal', name: 'Neue Montreal', family: 'sans-serif' },
      { id: 'obel-mono', name: 'Obel Mono', family: 'monospace' },
      { id: 'system', name: 'System', family: 'sans-serif' },
    ],
    setFont: vi.fn(),
  }),
}))

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Projects keyboard reachability', () => {
  it('renders project accordion triggers as naturally tabbable without aria-selected', () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <FocusProvider>
            <Projects />
          </FocusProvider>
        </MemoryRouter>
      </HelmetProvider>
    )

    const triggers = document.querySelectorAll('.tui-project-trigger')
    expect(triggers.length).toBeGreaterThan(0)
    triggers.forEach((button) => {
      expect(button.getAttribute('tabindex')).toBeNull()
      expect(button.getAttribute('aria-selected')).toBeNull()
    })

    // Escape during IME composition or with modifier keys must preserve the search query.
    const searchInput = screen.getByRole('searchbox', { name: 'Find projects' })
    fireEvent.change(searchInput, { target: { value: 'swift' } })
    fireEvent.keyDown(searchInput, { key: 'Escape', isComposing: true })
    expect(searchInput).toHaveValue('swift')
    fireEvent.keyDown(searchInput, { key: 'Escape', keyCode: 229 })
    expect(searchInput).toHaveValue('swift')
    fireEvent.keyDown(searchInput, { key: 'Escape', altKey: true })
    expect(searchInput).toHaveValue('swift')
    fireEvent.keyDown(searchInput, { key: 'Escape' })
    expect(searchInput).toHaveValue('')
  })
})

describe('useHotkeys browser, modal, and scroll preservation', () => {
  function HotkeyHarness({ disabled = false, onCommandPalette, onSearch, onGoToBottom }) {
    useHotkeys({ disabled, onCommandPalette, onSearch, onGoToBottom })
    return (
      <div>
        <button type="button">ordinary button</button>
      </div>
    )
  }

  it('does not preventDefault on Arrow keys outside focus items, modifier shortcuts, or when disabled', () => {
    const onCommandPalette = vi.fn()
    const onSearch = vi.fn()
    const onGoToBottom = vi.fn()
    const { rerender } = render(
      <FocusProvider>
        <HotkeyHarness onCommandPalette={onCommandPalette} onSearch={onSearch} onGoToBottom={onGoToBottom} />
      </FocusProvider>
    )

    const arrowEvent = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true })
    document.body.dispatchEvent(arrowEvent)
    expect(arrowEvent.defaultPrevented).toBe(false)

    const cmdColonEvent = new KeyboardEvent('keydown', { key: ':', metaKey: true, bubbles: true, cancelable: true })
    document.body.dispatchEvent(cmdColonEvent)
    expect(cmdColonEvent.defaultPrevented).toBe(false)
    expect(onCommandPalette).not.toHaveBeenCalled()

    const legacyImeEscape = new KeyboardEvent('keydown', { key: 'Escape', keyCode: 229, bubbles: true, cancelable: true })
    document.body.dispatchEvent(legacyImeEscape)
    expect(legacyImeEscape.defaultPrevented).toBe(false)

    const colonEvent = new KeyboardEvent('keydown', { key: ':', shiftKey: true, bubbles: true, cancelable: true })
    document.body.dispatchEvent(colonEvent)
    expect(colonEvent.defaultPrevented).toBe(true)
    expect(onCommandPalette).toHaveBeenCalledOnce()

    const shiftGEvent = new KeyboardEvent('keydown', { key: 'G', shiftKey: true, bubbles: true, cancelable: true })
    document.body.dispatchEvent(shiftGEvent)
    expect(shiftGEvent.defaultPrevented).toBe(true)
    expect(onGoToBottom).toHaveBeenCalledOnce()

    rerender(
      <FocusProvider>
        <HotkeyHarness disabled onCommandPalette={onCommandPalette} onSearch={onSearch} onGoToBottom={onGoToBottom} />
      </FocusProvider>
    )
    const slashEvent = new KeyboardEvent('keydown', { key: '/', bubbles: true, cancelable: true })
    document.body.dispatchEvent(slashEvent)
    expect(slashEvent.defaultPrevented).toBe(false)
    expect(onSearch).not.toHaveBeenCalled()
  })
})

describe('CommandPalette accessibility', () => {
  it('exposes combobox/listbox semantics with sibling status, guards IME/modifiers, and traps Tab', () => {
    const onClose = vi.fn()
    render(
      <MemoryRouter>
        <ThemeProvider>
          <CommandPalette isOpen onClose={onClose} />
        </ThemeProvider>
      </MemoryRouter>
    )

    const combobox = screen.getByRole('combobox', { name: 'Search commands' })
    const listbox = screen.getByRole('listbox', { name: 'Commands' })
    expect(combobox).toHaveAttribute('aria-controls', listbox.id)
    expect(combobox.getAttribute('aria-activedescendant')).toBeTruthy()

    // Composing Enter must not execute or close the dialog.
    fireEvent.keyDown(combobox, { key: 'Enter', isComposing: true })
    expect(onClose).not.toHaveBeenCalled()

    // Modified ArrowDown must keep native behavior.
    const activeBefore = combobox.getAttribute('aria-activedescendant')
    fireEvent.keyDown(combobox, { key: 'ArrowDown', metaKey: true })
    expect(combobox.getAttribute('aria-activedescendant')).toBe(activeBefore)

    // Modified Escape / Tab must keep browser/OS defaults.
    const closeBtn = screen.getByRole('button', { name: 'Close command palette' })
    closeBtn.focus()
    fireEvent.keyDown(closeBtn, { key: 'Tab', ctrlKey: true })
    expect(document.activeElement).toBe(closeBtn)
    fireEvent.keyDown(closeBtn, { key: 'Escape', ctrlKey: true })
    expect(onClose).not.toHaveBeenCalled()

    fireEvent.keyDown(closeBtn, { key: 'Tab' })
    expect(document.activeElement).toBe(combobox)

    fireEvent.keyDown(combobox, { key: 'Tab', shiftKey: true })
    expect(document.activeElement).toBe(closeBtn)

    fireEvent.change(combobox, { target: { value: 'zzzz-no-match' } })
    expect(combobox.getAttribute('aria-activedescendant')).toBeNull()
    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('no commands found')
    expect(listbox.contains(status)).toBe(false)

    // Escape runs onClose exactly once from either input or Close button.
    fireEvent.keyDown(combobox, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('suspends background hotkeys while open and restores focus to opener after Escape', async () => {
    const rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0)
      return 1
    })

    render(
      <MemoryRouter initialEntries={['/contact']}>
        <App />
      </MemoryRouter>
    )

    // Click dock while an unrelated control holds focus (Safari click behavior):
    // Escape must still restore focus to the dock button itself.
    const dockButton = screen.getByRole('button', { name: /^Open command palette/ })
    const homeLink = screen.getByRole('link', { name: 'Go to homepage' })
    homeLink.focus()
    fireEvent.click(dockButton)

    const dialog = screen.getByRole('dialog', { name: 'Command Palette' })
    expect(dialog).toBeInTheDocument()

    // Pressing '/' on Close button must not navigate away from /contact.
    const closeBtn = screen.getByRole('button', { name: 'Close command palette' })
    closeBtn.focus()
    fireEvent.keyDown(closeBtn, { key: '/' })
    expect(screen.getByRole('dialog', { name: 'Command Palette' })).toBeInTheDocument()

    fireEvent.keyDown(closeBtn, { key: 'Escape' })
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Command Palette' })).toBeNull()
      expect(document.activeElement).toBe(dockButton)
    })
    rafSpy.mockRestore()
  })
})

describe('ContactForm accessibility', () => {
  it('commits aria-invalid and error markup BEFORE moving focus to first invalid field', async () => {
    render(<ContactForm />)

    const nameInput = screen.getByLabelText('name *')
    let stateAtFocus = null
    nameInput.addEventListener('focus', () => {
      stateAtFocus = {
        invalid: nameInput.getAttribute('aria-invalid'),
        describedBy: nameInput.getAttribute('aria-describedby'),
        errorText: document.getElementById('contact-name-error')?.textContent || null,
      }
    })

    fireEvent.click(screen.getByRole('button', { name: 'send' }))

    await waitFor(() => {
      expect(document.activeElement).toBe(nameInput)
    })
    expect(stateAtFocus).toEqual({
      invalid: 'true',
      describedBy: 'contact-name-error',
      errorText: 'name required',
    })
    expect(nameInput).toHaveAttribute('autocomplete', 'name')
    expect(screen.getByLabelText('email *')).toHaveAttribute('autocomplete', 'email')
  })

  it('rejects emails failing native typeMismatch such as consecutive dots', async () => {
    render(<ContactForm />)
    fireEvent.change(screen.getByLabelText('name *'), { target: { value: 'Pat' } })
    fireEvent.change(screen.getByLabelText('email *'), { target: { value: 'pat@example..org' } })
    fireEvent.change(screen.getByLabelText('message *'), { target: { value: 'Hello there, checking validation.' } })

    fireEvent.click(screen.getByRole('button', { name: 'send' }))

    await waitFor(() => {
      expect(screen.getByLabelText('email *')).toHaveAttribute('aria-invalid', 'true')
      expect(document.getElementById('contact-email-error')).toHaveTextContent("that email doesn't look right")
    })
  })
})

describe('Footer menu keyboard navigation', () => {
  it('uses roving tabIndex=-1, returns focus to trigger on Tab, and wraps ArrowUp cleanly', () => {
    render(
      <MemoryRouter>
        <Footer onCommandPaletteToggle={vi.fn()} />
      </MemoryRouter>
    )

    const separators = screen.getAllByText('│')
    expect(separators.length).toBeGreaterThan(0)
    separators.forEach((separator) => {
      expect(separator).toHaveAttribute('aria-hidden', 'true')
    })

    const fontBtn = screen.getByRole('button', { name: 'Select font family' })
    fireEvent.click(fontBtn)
    const items = screen.getAllByRole('menuitemradio')
    expect(items).toHaveLength(3)
    items.forEach((item) => expect(item).toHaveAttribute('tabindex', '-1'))

    // ArrowUp when focus is on container (currentIndex === -1) jumps to last item.
    const menu = screen.getByRole('menu', { name: 'Font family' })
    document.body.focus()
    fireEvent.keyDown(menu, { key: 'ArrowUp' })
    expect(document.activeElement).toBe(items[2])

    fireEvent.keyDown(items[2], { key: 'Home' })
    expect(document.activeElement).toBe(items[0])

    fireEvent.keyDown(items[0], { key: 'ArrowDown' })
    expect(document.activeElement).toBe(items[1])

    // Modified keys and composing Escape must leave the font menu open.
    fireEvent.keyDown(items[1], { key: 'ArrowDown', metaKey: true })
    expect(document.activeElement).toBe(items[1])
    fireEvent.keyDown(items[1], { key: 'Tab', ctrlKey: true })
    expect(screen.getByRole('menu', { name: 'Font family' })).toBeInTheDocument()
    fireEvent.keyDown(items[1], { key: 'Escape', isComposing: true })
    expect(screen.getByRole('menu', { name: 'Font family' })).toBeInTheDocument()

    // Tab from middle item synchronously hands focus back to font button and closes menu.
    fireEvent.keyDown(items[1], { key: 'Tab' })
    expect(document.activeElement).toBe(fontBtn)
    expect(screen.queryByRole('menu', { name: 'Font family' })).toBeNull()
  })

  it('keeps Links popover open on Safari null-relatedTarget blur and closes when focus tabs past trigger', () => {
    render(
      <MemoryRouter>
        <Footer onCommandPaletteToggle={vi.fn()} />
      </MemoryRouter>
    )

    const linksBtn = screen.getByRole('button', { name: 'Toggle social links menu' })
    const dockBtn = screen.getByRole('button', { name: /^Open command palette/ })
    fireEvent.click(linksBtn)

    const panel = document.getElementById('footer-social-links')
    expect(panel).toBeInTheDocument()
    const firstLink = panel.querySelector('a')
    expect(document.activeElement).toBe(firstLink)

    // Safari tap/click on a link or button fires focusout with relatedTarget: null.
    fireEvent.blur(firstLink, { relatedTarget: null })
    expect(document.getElementById('footer-social-links')).toBeInTheDocument()

    // Composing Escape must not close the popover.
    fireEvent.keyDown(firstLink, { key: 'Escape', isComposing: true })
    expect(document.getElementById('footer-social-links')).toBeInTheDocument()

    // Moving focus to the trigger keeps the popover open; tabbing onward to the dock closes it.
    fireEvent.blur(firstLink, { relatedTarget: linksBtn })
    expect(document.getElementById('footer-social-links')).toBeInTheDocument()
    fireEvent.blur(linksBtn, { relatedTarget: dockBtn })
    expect(document.getElementById('footer-social-links')).toBeNull()
    expect(linksBtn).toHaveAttribute('aria-expanded', 'false')
  })

  it('restores focus to the persistent Font trigger when palette opens via colon inside font menu', async () => {
    const rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0)
      return 1
    })

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )

    const fontBtn = screen.getByRole('button', { name: 'Select font family' })
    fireEvent.click(fontBtn)
    const firstFont = screen.getAllByRole('menuitemradio')[0]
    firstFont.focus()

    fireEvent.keyDown(firstFont, { key: ':' })
    const dialog = screen.getByRole('dialog', { name: 'Command Palette' })
    expect(dialog).toBeInTheDocument()

    const combobox = screen.getByRole('combobox', { name: 'Search commands' })
    fireEvent.keyDown(combobox, { key: 'Escape' })
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Command Palette' })).toBeNull()
      expect(document.activeElement).toBe(fontBtn)
    })
    rafSpy.mockRestore()
  })
})

describe('StarterSelectionCapture media preloading and touch startup', () => {
  it('uses preload="none", keeps source attached, and never autoplays on primary touch devices', () => {
    const playSpy = vi.fn(() => Promise.resolve())
    Object.defineProperty(HTMLMediaElement.prototype, 'play', {
      configurable: true,
      value: playSpy,
    })

    const originalMatchMedia = window.matchMedia
    window.matchMedia = vi.fn((query) => ({
      matches: query === '(hover: none) and (pointer: coarse)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))

    let ioCallback = null
    const originalIO = globalThis.IntersectionObserver
    globalThis.IntersectionObserver = class {
      constructor(cb) { ioCallback = cb }
      observe() {}
      disconnect() {}
    }

    try {
      render(<GameCapture />)
      const video = document.querySelector('video')
      expect(video).toHaveAttribute('preload', 'none')
      expect(video.querySelector('source')).toHaveAttribute('src', '/media/s3-amoled/pokemon-agent-battle.mp4')

      // Even if the video intersects immediately on cold load (e.g. #grain), touch does not autoplay.
      ioCallback?.([{ isIntersecting: true }])
      expect(playSpy).not.toHaveBeenCalled()
    } finally {
      window.matchMedia = originalMatchMedia
      globalThis.IntersectionObserver = originalIO
    }
  })
})

describe('useActiveSection cached steady-scroll tracking', () => {
  function SectionHarness() {
    const active = useActiveSection(['s1', 's2', 's3'])
    return (
      <div>
        <output data-testid="active-section">{active}</output>
        <section id="s1" />
        <section id="s2" />
        <section id="s3" />
      </div>
    )
  }

  it('performs zero getBoundingClientRect calls during steady scrolling', () => {
    const rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0)
      return 1
    })

    render(<SectionHarness />)
    const s1 = document.getElementById('s1')
    const s2 = document.getElementById('s2')
    const s3 = document.getElementById('s3')
    const rectSpy1 = vi.spyOn(s1, 'getBoundingClientRect').mockReturnValue({ top: 0 })
    const rectSpy2 = vi.spyOn(s2, 'getBoundingClientRect').mockReturnValue({ top: 500 })
    const rectSpy3 = vi.spyOn(s3, 'getBoundingClientRect').mockReturnValue({ top: 1000 })

    // Re-measure once via resize so cached offsets and document height reflect mocked positions.
    const scrollHeightSpy = vi.spyOn(document.documentElement, 'scrollHeight', 'get').mockReturnValue(2400)
    fireEvent(window, new Event('resize'))
    rectSpy1.mockClear()
    rectSpy2.mockClear()
    rectSpy3.mockClear()
    scrollHeightSpy.mockClear()

    // Scroll 10 times; cached offsets and doc height must be used without layout reads.
    for (let y = 100; y <= 1000; y += 100) {
      Object.defineProperty(window, 'scrollY', { configurable: true, value: y })
      fireEvent.scroll(window)
    }

    expect(rectSpy1).not.toHaveBeenCalled()
    expect(rectSpy2).not.toHaveBeenCalled()
    expect(rectSpy3).not.toHaveBeenCalled()
    expect(scrollHeightSpy).not.toHaveBeenCalled()
    expect(screen.getByTestId('active-section')).toHaveTextContent('s3')
    rafSpy.mockRestore()
  })
})

describe('safeStorage resilience', () => {
  it('falls back to in-memory storage when Web Storage throws SecurityError', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Blocked', 'SecurityError')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Blocked', 'SecurityError')
    })

    expect(safeSetItem('theme-mode-blocked', 'light')).toBe(false)
    expect(safeGetItem('theme-mode-blocked')).toBe('light')
  })

  it('prefers the newer in-memory value when getItem succeeds but setItem throws QuotaExceededError', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('dark')
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Quota exceeded', 'QuotaExceededError')
    })

    expect(safeSetItem('theme-mode-quota', 'light')).toBe(false)
    expect(safeGetItem('theme-mode-quota')).toBe('light')
  })
})
