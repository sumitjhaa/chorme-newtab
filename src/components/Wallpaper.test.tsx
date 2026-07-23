import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SettingsProvider } from '../context/SettingsContext'
import Wallpaper from './Wallpaper'
import type { ReactElement } from 'react'
import type { RenderOptions } from '@testing-library/react'

function renderWithProvider(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
    return render(<SettingsProvider>{ui}</SettingsProvider>, options)
}

beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    ;(chrome.storage.local.get as ReturnType<typeof vi.fn>).mockImplementation((_keys: unknown) => Promise.resolve({}))
    ;(chrome.storage.local.set as ReturnType<typeof vi.fn>).mockImplementation(() => Promise.resolve())
})

describe('Wallpaper', () => {
    it('renders wallpaper image when wallpaper has url', () => {
        const { container } = renderWithProvider(<Wallpaper wallpaper={{ url: 'https://example.com/img.jpg', thumbnail: '', source: 'wallhaven' }} isLoading={false} />)

        const img = container.querySelector('img')
        expect(img).toBeInTheDocument()
        expect(img).toHaveAttribute('src', 'https://example.com/img.jpg')
    })

    it('renders default background when wallpaper is null', () => {
        const { container } = renderWithProvider(<Wallpaper wallpaper={null} isLoading={false} />)

        expect(screen.queryByRole('img')).not.toBeInTheDocument()
        expect(container.querySelector('.default-background')).toBeInTheDocument()
    })

    it('renders default background when wallpaper has no url', () => {
        const { container } = renderWithProvider(<Wallpaper wallpaper={{ url: '', thumbnail: '', source: 'wallhaven' }} isLoading={false} />)

        expect(screen.queryByRole('img')).not.toBeInTheDocument()
        expect(container.querySelector('.default-background')).toBeInTheDocument()
    })

    it('shows loading overlay when isLoading is true', () => {
        const { container } = renderWithProvider(<Wallpaper wallpaper={null} isLoading={true} />)

        expect(container.querySelector('.loading-overlay')).toBeInTheDocument()
        expect(container.querySelector('.spinner')).toBeInTheDocument()
    })

    it('hides loading overlay when isLoading is false', () => {
        const { container } = renderWithProvider(<Wallpaper wallpaper={null} isLoading={false} />)

        expect(container.querySelector('.loading-overlay')).not.toBeInTheDocument()
    })

    it('always renders wallpaper overlay', () => {
        const { container } = renderWithProvider(<Wallpaper wallpaper={{ url: 'test.jpg', thumbnail: '', source: 'wallhaven' }} isLoading={false} />)

        expect(container.querySelector('.wallpaper-overlay')).toBeInTheDocument()
    })

    it('uses async decoding for images', () => {
        const { container } = renderWithProvider(<Wallpaper wallpaper={{ url: 'test.jpg', thumbnail: '', source: 'wallhaven' }} isLoading={false} />)

        expect(container.querySelector('img')).toHaveAttribute('decoding', 'async')
    })
})
