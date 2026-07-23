import { describe, it, expect } from 'vitest'
import {
    API_SOURCES,
    STORAGE_KEYS,
    SEARCH_ENGINES,
    DEFAULT_REFRESH_INTERVAL,
} from './constants'

describe('API_SOURCES', () => {
    it('has wallhaven source', () => {
        expect(API_SOURCES.WALLHAVEN).toBe('wallhaven')
    })

    it('has exactly 1 source', () => {
        expect(Object.keys(API_SOURCES)).toHaveLength(1)
    })
})

describe('STORAGE_KEYS', () => {
    it('has required storage keys', () => {
        expect(STORAGE_KEYS.CURRENT_WALLPAPER).toBe('currentWallpaper')
        expect(STORAGE_KEYS.WALLPAPER_SOURCE).toBe('wallpaperSource')
        expect(STORAGE_KEYS.SEARCH_ENGINE).toBe('searchEngine')
    })
})

describe('SEARCH_ENGINES', () => {
    it('has 10 search engines', () => {
        expect(Object.keys(SEARCH_ENGINES)).toHaveLength(10)
    })

    it('each engine has name and url', () => {
        Object.values(SEARCH_ENGINES).forEach((engine) => {
            expect(engine).toHaveProperty('name')
            expect(engine).toHaveProperty('url')
            expect(typeof engine.name).toBe('string')
            expect(typeof engine.url).toBe('string')
            expect(engine.url).toContain('http')
        })
    })

    it('Google URL contains google.com/search', () => {
        expect(SEARCH_ENGINES.GOOGLE.url).toContain('google.com/search')
    })
})

describe('DEFAULT_REFRESH_INTERVAL', () => {
    it('is 30 minutes in milliseconds', () => {
        expect(DEFAULT_REFRESH_INTERVAL).toBe(30 * 60 * 1000)
    })
})
