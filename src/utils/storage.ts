/**
  * @fileoverview Storage utilities with chrome.storage and localStorage fallback.
  */

import type { Settings } from '../types'
import { SETTINGS_DEFAULTS } from './defaults'

const SETTINGS_KEY = 'newtab_settings'

function isChromeStorageAvailable(): boolean {
    return typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local !== undefined
}

/**
  * Load data from localStorage with fallback.
  * @typeParam T - Data type
  * @param key - Storage key
  * @param fallback - Fallback value
  * @returns Stored value or fallback
  */
function loadFromLocalStorage<T>(key: string, fallback: T): T {
    try {
        const data = JSON.parse(localStorage.getItem(key) || 'null')
        return data ?? fallback
    } catch {
        return fallback
    }
}

/**
  * Save data to localStorage.
  * @typeParam T - Data type
  * @param key - Storage key
  * @param value - Value to store
  */
function saveToLocalStorage<T>(key: string, value: T): void {
    try {
        localStorage.setItem(key, JSON.stringify(value))
    } catch {}
}

/**
  * Load data from chrome.storage with localStorage fallback.
  * @typeParam T - Data type
  * @param key - Storage key
  * @param fallback - Fallback value
  * @returns Stored value or fallback
  */
async function loadFromChromeStorage<T>(key: string, fallback: T): Promise<T> {
    try {
        const result = await chrome.storage.local.get([key])
        return (result[key] as T) ?? fallback
    } catch {
        return loadFromLocalStorage(key, fallback)
    }
}

/**
  * Save data to chrome.storage with localStorage fallback.
  * @typeParam T - Data type
  * @param key - Storage key
  * @param value - Value to store
  */
async function saveToChromeStorage<T>(key: string, value: T): Promise<void> {
    try {
        await chrome.storage.local.set({ [key]: value })
    } catch {
        saveToLocalStorage(key, value)
    }
}

/**
  * Get data from storage (chrome.storage or localStorage).
  * @typeParam T - Data type
  * @param key - Storage key
  * @param fallback - Fallback value
  * @returns Stored value or fallback
  */
export async function getFromStorage<T>(key: string, fallback: T | null = null): Promise<T | null> {
    if (isChromeStorageAvailable()) {
        return loadFromChromeStorage(key, fallback)
    }
    return loadFromLocalStorage(key, fallback)
}

/**
  * Set data in storage (chrome.storage or localStorage).
  * @typeParam T - Data type
  * @param key - Storage key
  * @param value - Value to store
  */
export async function setToStorage<T>(key: string, value: T): Promise<void> {
    if (isChromeStorageAvailable()) {
        await saveToChromeStorage(key, value)
    } else {
        saveToLocalStorage(key, value)
    }
}

/**
  * Get the current wallpaper from storage.
  * @returns Wallpaper data or null
  */
export async function getCurrentWallpaper(): Promise<unknown> {
    return getFromStorage('currentWallpaper', null)
}

/**
  * Save the current wallpaper to storage.
  * @param wallpaper - Wallpaper data to save
  */
export async function setCurrentWallpaper(wallpaper: unknown): Promise<void> {
    return setToStorage('currentWallpaper', wallpaper)
}

/**
  * Get the saved wallpaper source from storage.
  * @returns Source identifier or null
  */
export async function getWallpaperSource(): Promise<string | null> {
    return getFromStorage('wallpaperSource', null)
}

/**
  * Save the wallpaper source to storage.
  * @param source - Source identifier
  */
export async function setWallpaperSource(source: string): Promise<void> {
    return setToStorage('wallpaperSource', source)
}

/**
  * Get the saved search engine from storage.
  * @returns Search engine key or null
  */
export async function getSearchEngine(): Promise<string | null> {
    return getFromStorage('searchEngine', null)
}

/**
  * Save the search engine to storage.
  * @param engine - Search engine key
  */
export async function setSearchEngine(engine: string): Promise<void> {
    return setToStorage('searchEngine', engine)
}

/**
  * Load settings synchronously from localStorage.
  * @returns Partial settings object
  */
export function loadSettingsSync(): Partial<Settings> {
    return loadFromLocalStorage(SETTINGS_KEY, {})
}

/**
  * Load settings asynchronously (tries chrome.storage first).
  * @returns Partial settings object
  */
export async function loadSettings(): Promise<Partial<Settings>> {
    if (isChromeStorageAvailable()) {
        try {
            const result = await chrome.storage.local.get([SETTINGS_KEY])
            return (result[SETTINGS_KEY] as Partial<Settings>) ?? {}
        } catch {
            return loadFromLocalStorage(SETTINGS_KEY, {})
        }
    }
    return loadFromLocalStorage(SETTINGS_KEY, {})
}

/**
  * Save settings synchronously to localStorage and chrome.storage.
  * @param partial - Partial settings to merge and save
  */
export function saveSettingsSync(partial: Partial<Settings>): void {
    const current = loadFromLocalStorage(SETTINGS_KEY, {})
    const merged = { ...current, ...partial }
    saveToLocalStorage(SETTINGS_KEY, merged)
    if (isChromeStorageAvailable()) {
        chrome.storage.local.set({ [SETTINGS_KEY]: merged }).catch(() => {})
    }
}

/**
  * Save settings asynchronously to chrome.storage and localStorage.
  * @param partial - Partial settings to merge and save
  */
export async function saveSettings(partial: Partial<Settings>): Promise<void> {
    if (isChromeStorageAvailable()) {
        try {
            const current = await loadSettings()
            const merged = { ...current, ...partial }
            await chrome.storage.local.set({ [SETTINGS_KEY]: merged })
            saveToLocalStorage(SETTINGS_KEY, merged)
            return
        } catch {}
    }
    const current = loadFromLocalStorage(SETTINGS_KEY, {})
    const merged = { ...current, ...partial }
    saveToLocalStorage(SETTINGS_KEY, merged)
}

/**
  * Load JSON data from storage (async wrapper).
  * @typeParam T - Data type
  * @param key - Storage key
  * @param fallback - Fallback value
  * @returns Stored value or fallback
  */
export async function loadJSON<T>(key: string, fallback: T): Promise<T> {
    return getFromStorage(key, fallback) as Promise<T>
}

/**
  * Save JSON data to storage (async wrapper).
  * @typeParam T - Data type
  * @param key - Storage key
  * @param value - Value to store
  */
export async function saveJSON<T>(key: string, value: T): Promise<void> {
    return setToStorage(key, value)
}
