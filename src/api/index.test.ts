// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchRandomWallpaper, getAvailableSources } from './index'
import { API_SOURCES } from '../constants'

beforeEach(() => {
  vi.clearAllMocks()
  chrome.runtime.lastError = null
})

describe('getAvailableSources', () => {
  it('returns all 4 sources', () => {
    const sources = getAvailableSources()
    expect(sources).toHaveLength(4)
    expect(sources).toContain(API_SOURCES.WALLHAVEN)
    expect(sources).toContain(API_SOURCES.PIXABAY)
    expect(sources).toContain(API_SOURCES.PICSUM)
    expect(sources).toContain(API_SOURCES.CATBOX)
  })
})

describe('fetchRandomWallpaper', () => {
  it('sends message to background and resolves with wallpaper', async () => {
    const mockWallpaper = { url: 'https://example.com/wall.jpg', source: 'wallhaven' }

    chrome.runtime.sendMessage.mockImplementation((msg, cb) => {
      cb({ wallpaper: mockWallpaper })
    })

    const result = await fetchRandomWallpaper('wallhaven')
    expect(result).toEqual(mockWallpaper)
    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith(
      { type: 'FETCH_WALLPAPER', source: 'wallhaven' },
      expect.any(Function)
    )
  })

  it('rejects when response has error', async () => {
    chrome.runtime.sendMessage.mockImplementation((msg, cb) => {
      cb({ error: 'API limit reached' })
    })

    await expect(fetchRandomWallpaper('wallhaven')).rejects.toThrow('API limit reached')
  })

  it('rejects when chrome.runtime.lastError is set', async () => {
    chrome.runtime.sendMessage.mockImplementation((msg, cb) => {
      chrome.runtime.lastError = { message: 'Service worker unavailable' }
      cb(null)
    })

    await expect(fetchRandomWallpaper('wallhaven')).rejects.toThrow('Service worker unavailable')
  })

  it('defaults to WALLHAVEN source when none specified', async () => {
    chrome.runtime.sendMessage.mockImplementation((msg, cb) => {
      cb({ wallpaper: { url: 'test.jpg' } })
    })

    await fetchRandomWallpaper()
    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith(
      { type: 'FETCH_WALLPAPER', source: 'wallhaven' },
      expect.any(Function)
    )
  })
})
