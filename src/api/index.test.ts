import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchRandomWallpaper } from './index'

beforeEach(() => {
    vi.clearAllMocks()
    chrome.runtime.lastError = null
})

describe('fetchRandomWallpaper', () => {
    it('sends message to background and resolves with wallpaper', async () => {
        const mockWallpaper = { url: 'https://example.com/wall.jpg', thumbnail: '', source: 'wallhaven' }

        ;(chrome.runtime.sendMessage as ReturnType<typeof vi.fn>).mockImplementation((_msg: unknown, cb: (response: unknown) => void) => {
            cb({ wallpaper: mockWallpaper })
        })

        const result = await fetchRandomWallpaper()
        expect(result).toEqual(mockWallpaper)
        expect(chrome.runtime.sendMessage).toHaveBeenCalledWith(
            { type: 'FETCH_WALLPAPER', source: 'wallhaven' },
            expect.any(Function)
        )
    })

    it('rejects when response has error', async () => {
        ;(chrome.runtime.sendMessage as ReturnType<typeof vi.fn>).mockImplementation((_msg: unknown, cb: (response: unknown) => void) => {
            cb({ error: 'API limit reached' })
        })

        await expect(fetchRandomWallpaper()).rejects.toThrow('API limit reached')
    })

    it('rejects when chrome.runtime.lastError is set', async () => {
        ;(chrome.runtime.sendMessage as ReturnType<typeof vi.fn>).mockImplementation((_msg: unknown, cb: (response: unknown) => void) => {
            chrome.runtime.lastError = { message: 'Service worker unavailable' }
            cb(null)
        })

        await expect(fetchRandomWallpaper()).rejects.toThrow('Service worker unavailable')
    })
})
