import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { SettingsProvider } from '../context/SettingsContext'
import Settings from './Settings'
import type { ReactElement } from 'react'
import type { RenderOptions } from '@testing-library/react'

function renderWithProvider(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
    return render(<SettingsProvider>{ui}</SettingsProvider>, options)
}

function selectDropdown(triggerText: string, optionText: string) {
    const trigger = screen.getAllByText(triggerText).find(el => el.closest('.dd-trigger'))
    if (!trigger) throw new Error(`Dropdown trigger "${triggerText}" not found`)
    fireEvent.click(trigger.closest('.dd-trigger')!)
    const option = screen.getAllByText(optionText).find(el => el.closest('.dd-item'))
    if (!option) throw new Error(`Dropdown option "${optionText}" not found`)
    fireEvent.click(option)
}

function flushDebounces() {
    act(() => { vi.advanceTimersByTime(200) })
}

beforeEach(() => {
    vi.useFakeTimers()
    localStorage.clear()
    vi.clearAllMocks()
    ;(chrome.storage.local.get as ReturnType<typeof vi.fn>).mockImplementation((_keys: unknown) => Promise.resolve({}))
    ;(chrome.storage.local.set as ReturnType<typeof vi.fn>).mockImplementation(() => Promise.resolve())
})

afterEach(() => {
    vi.useRealTimers()
})

describe('Settings', () => {
    it('always renders sidebar elements (hidden via CSS when closed)', () => {
        const { container } = renderWithProvider(<Settings isOpen={false} onClose={vi.fn()} />)
        const sidebar = container.querySelector('.settings-sidebar')
        expect(sidebar).not.toHaveClass('open')
    })

    it('renders sidebar with open class when open', () => {
        const { container } = renderWithProvider(<Settings isOpen={true} onClose={vi.fn()} />)
        const sidebar = container.querySelector('.settings-sidebar')
        expect(sidebar).toHaveClass('open')
    })

    it('shows General group title', () => {
        renderWithProvider(<Settings isOpen={true} onClose={vi.fn()} />)
        expect(screen.getByText('General')).toBeInTheDocument()
    })

    it('calls onClose when overlay is clicked', () => {
        const onClose = vi.fn()
        const { container } = renderWithProvider(<Settings isOpen={true} onClose={onClose} />)
        fireEvent.click(container.querySelector('.settings-overlay')!)
        expect(onClose).toHaveBeenCalledOnce()
    })

    it('loads language setting from localStorage on mount', () => {
        localStorage.setItem('newtab_settings', JSON.stringify({ language: 'fr' }))
        const { container } = renderWithProvider(<Settings isOpen={true} onClose={vi.fn()} />)
        const triggers = container.querySelectorAll('.dd-trigger-label')
        const langTrigger = Array.from(triggers).find(el => el.textContent === 'Français')
        expect(langTrigger).toBeInTheDocument()
    })

    it('falls back to defaults when localStorage is empty', () => {
        const { container } = renderWithProvider(<Settings isOpen={true} onClose={vi.fn()} />)
        const triggers = container.querySelectorAll('.dd-trigger-label')
        const langTrigger = Array.from(triggers).find(el => el.textContent === 'English')
        expect(langTrigger).toBeInTheDocument()
    })

    it('changes language and saves to localStorage', () => {
        renderWithProvider(<Settings isOpen={true} onClose={vi.fn()} />)
        selectDropdown('English', '日本語')
        flushDebounces()
        const stored = JSON.parse(localStorage.getItem('newtab_settings') || '{}')
        expect(stored.language).toBe('ja')
    })

    it('toggles dark mode', () => {
        renderWithProvider(<Settings isOpen={true} onClose={vi.fn()} />)
        fireEvent.click(screen.getByText('Dark'))
        flushDebounces()
        const stored = JSON.parse(localStorage.getItem('newtab_settings') || '{}')
        expect(stored.darkMode).toBe('dark')
    })

    it('updates tab title', () => {
        renderWithProvider(<Settings isOpen={true} onClose={vi.fn()} />)
        const input = screen.getByDisplayValue('New Tab')
        fireEvent.change(input, { target: { value: 'My Tab' } })
        flushDebounces()
        const stored = JSON.parse(localStorage.getItem('newtab_settings') || '{}')
        expect(stored.tabTitle).toBe('My Tab')
    })
})
