import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
    getFromStorage,
    setToStorage,
    getCurrentWallpaper,
    setCurrentWallpaper,
    getWallpaperSource,
    setWallpaperSource,
    getSearchEngine,
    setSearchEngine,
} from './storage'

let savedStorage: typeof chrome.storage

beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    savedStorage = chrome.storage
    ;(chrome as { storage?: typeof chrome.storage }).storage = undefined as unknown as typeof chrome.storage
})

afterEach(() => {
    ;(chrome as { storage: typeof chrome.storage }).storage = savedStorage
})

describe('getFromStorage / setToStorage', () => {
    it('returns null when key does not exist', async () => {
        const value = await getFromStorage('nonexistent')
        expect(value).toBeNull()
    })

    it('stores and retrieves a string value', async () => {
        await setToStorage('myKey', 'myValue')
        const value = await getFromStorage('myKey')
        expect(value).toBe('myValue')
    })

    it('stores and retrieves an object value', async () => {
        const obj = { url: 'https://example.com/img.jpg', source: 'wallhaven' }
        await setToStorage('wallpaper', obj)
        const value = await getFromStorage('wallpaper')
        expect(value).toEqual(obj)
    })

    it('overwrites existing value', async () => {
        await setToStorage('key', 'first')
        await setToStorage('key', 'second')
        const value = await getFromStorage('key')
        expect(value).toBe('second')
    })
})

describe('wallpaper helpers', () => {
    it('getCurrentWallpaper returns null when empty', async () => {
        const value = await getCurrentWallpaper()
        expect(value).toBeNull()
    })

    it('setCurrentWallpaper stores and getCurrentWallpaper retrieves', async () => {
        const wallpaper = { url: 'https://example.com/1.jpg', source: 'wallhaven' }
        await setCurrentWallpaper(wallpaper)
        const result = await getCurrentWallpaper()
        expect(result).toEqual(wallpaper)
    })
})

describe('wallpaper source helpers', () => {
    it('getWallpaperSource returns null when empty', async () => {
        const value = await getWallpaperSource()
        expect(value).toBeNull()
    })

    it('setWallpaperSource stores and getWallpaperSource retrieves', async () => {
        await setWallpaperSource('pixabay')
        const result = await getWallpaperSource()
        expect(result).toBe('pixabay')
    })
})

describe('search engine helpers', () => {
    it('getSearchEngine returns null when empty', async () => {
        const value = await getSearchEngine()
        expect(value).toBeNull()
    })

    it('setSearchEngine stores and getSearchEngine retrieves', async () => {
        await setSearchEngine('BRAVE')
        const result = await getSearchEngine()
        expect(result).toBe('BRAVE')
    })
})
