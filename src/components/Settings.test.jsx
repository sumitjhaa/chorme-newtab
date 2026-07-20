import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Settings from './Settings.jsx'

beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()
  chrome.storage.local.get.mockImplementation((keys) => Promise.resolve({}))
  chrome.storage.local.set.mockImplementation(() => Promise.resolve())
})

describe('Settings', () => {
  it('always renders sidebar elements (hidden via CSS when closed)', () => {
    const { container } = render(<Settings isOpen={false} onClose={vi.fn()} />)
    const sidebar = container.querySelector('.settings-sidebar')
    expect(sidebar).not.toHaveClass('open')
  })

  it('renders sidebar with open class when open', () => {
    const { container } = render(<Settings isOpen={true} onClose={vi.fn()} />)
    const sidebar = container.querySelector('.settings-sidebar')
    expect(sidebar).toHaveClass('open')
  })

  it('shows General group title', () => {
    render(<Settings isOpen={true} onClose={vi.fn()} />)
    expect(screen.getByText('General')).toBeInTheDocument()
  })

  it('calls onClose when overlay is clicked', () => {
    const onClose = vi.fn()
    const { container } = render(<Settings isOpen={true} onClose={onClose} />)
    fireEvent.click(container.querySelector('.settings-overlay'))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('loads language setting from chrome.storage on mount', async () => {
    chrome.storage.local.get.mockImplementation(() => Promise.resolve({ language: 'fr' }))
    render(<Settings isOpen={true} onClose={vi.fn()} />)
    await waitFor(() => {
      expect(screen.getByDisplayValue('Français')).toBeInTheDocument()
    })
  })

  it('falls back to localStorage when chrome.storage fails', async () => {
    localStorage.setItem('newtab_settings', JSON.stringify({ language: 'de' }))
    chrome.storage.local.get.mockImplementation(() => {
      throw new Error('Not available')
    })
    render(<Settings isOpen={true} onClose={vi.fn()} />)
    await waitFor(() => {
      expect(screen.getByDisplayValue('Deutsch')).toBeInTheDocument()
    })
  })

  it('changes language and saves to chrome.storage', () => {
    render(<Settings isOpen={true} onClose={vi.fn()} />)
    fireEvent.change(screen.getByDisplayValue('English'), { target: { value: 'ja' } })
    expect(chrome.storage.local.set).toHaveBeenCalledWith({ language: 'ja' })
  })

  it('toggles dark mode', () => {
    render(<Settings isOpen={true} onClose={vi.fn()} />)
    fireEvent.click(screen.getByText('Dark'))
    expect(chrome.storage.local.set).toHaveBeenCalledWith({ darkMode: 'dark' })
  })

  it('updates tab title', () => {
    render(<Settings isOpen={true} onClose={vi.fn()} />)
    const input = screen.getByDisplayValue('New Tab')
    fireEvent.change(input, { target: { value: 'My Tab' } })
    expect(chrome.storage.local.set).toHaveBeenCalledWith({ tabTitle: 'My Tab' })
  })
})
