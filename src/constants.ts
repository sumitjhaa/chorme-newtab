/**
  * @fileoverview Application constants for API sources, storage keys, and configuration.
  */

import type { WallpaperSource, SearchEngineKey, BgType, BgFrequency } from './types'

/** API source identifiers */
export const API_SOURCES = {
    WALLHAVEN: 'wallhaven' as const,
} satisfies Record<string, WallpaperSource>

/** localStorage and chrome.storage keys */
export const STORAGE_KEYS = {
    CURRENT_WALLPAPER: 'currentWallpaper',
    WALLPAPER_SOURCE: 'wallpaperSource',
    SEARCH_ENGINE: 'searchEngine',
    WALLPAPER_CACHE: 'wallpaperCache',
} as const

/** Search engine configurations */
export const SEARCH_ENGINES = {
    GOOGLE: { name: 'Google', url: 'https://www.google.com/search?q=' },
    DUCKDUCKGO: { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=' },
    BING: { name: 'Bing', url: 'https://www.bing.com/search?q=' },
    YAHOO: { name: 'Yahoo', url: 'https://search.yahoo.com/search?p=' },
    BRAVE: { name: 'Brave', url: 'https://search.brave.com/search?q=' },
    STARTPAGE: { name: 'Startpage', url: 'https://www.startpage.com/do/search?q=' },
    QWANT: { name: 'Qwant', url: 'https://www.qwant.com/?q=' },
    ECOSIA: { name: 'Ecosia', url: 'https://www.ecosia.org/search?q=' },
    SWISSCOWS: { name: 'Swisscows', url: 'https://swisscows.com/web?query=' },
    MOJEEK: { name: 'Mojeek', url: 'https://www.mojeek.com/search?q=' },
} satisfies Record<SearchEngineKey, { name: string; url: string }>

/** Default wallpaper refresh interval (30 minutes) */
export const DEFAULT_REFRESH_INTERVAL = 30 * 60 * 1000

/** Background type options */
export const BACKGROUND_TYPES = [
    { value: 'images' as const, label: 'Images' },
] satisfies { value: BgType; label: string }[]

/** Wallpaper refresh frequency options */
export const FREQUENCIES = [
    { value: 'every_tab' as const, label: 'Every Tab' },
    { value: 'every_hour' as const, label: 'Every Hour' },
    { value: 'every_day' as const, label: 'Every Day' },
    { value: 'daylight' as const, label: 'Daylight' },
    { value: 'locked' as const, label: 'Locked' },
] satisfies { value: BgFrequency; label: string }[]


