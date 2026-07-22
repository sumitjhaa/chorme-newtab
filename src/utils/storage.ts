// @ts-nocheck
import type { Settings } from '../types'
import { SETTINGS_DEFAULTS } from './defaults'

const SETTINGS_KEY = 'newtab_settings'

function isChromeStorageAvailable(): boolean {
  return typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local !== undefined
}

// LocalStorage fallback functions
function loadFromLocalStorage<T>(key: string, fallback: T): T {
  try {
    const data = JSON.parse(localStorage.getItem(key) || 'null')
    return data ?? fallback
  } catch {
    return fallback
  }
}

function saveToLocalStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

// Chrome storage functions
async function loadFromChromeStorage<T>(key: string, fallback: T): Promise<T> {
  try {
    const result = await chrome.storage.local.get([key])
    return result[key] ?? fallback
  } catch {
    return loadFromLocalStorage(key, fallback)
  }
}

async function saveToChromeStorage<T>(key: string, value: T): Promise<void> {
  try {
    await chrome.storage.local.set({ [key]: value })
  } catch {
    saveToLocalStorage(key, value)
  }
}

// Unified API
export async function getFromStorage<T>(key: string, fallback: T | null = null): Promise<T | null> {
  if (isChromeStorageAvailable()) {
    return loadFromChromeStorage(key, fallback)
  }
  return loadFromLocalStorage(key, fallback)
}

export async function setToStorage<T>(key: string, value: T): Promise<void> {
  if (isChromeStorageAvailable()) {
    await saveToChromeStorage(key, value)
  } else {
    saveToLocalStorage(key, value)
  }
}

// Legacy helpers (used by App.tsx and tests)
export async function getCurrentWallpaper(): Promise<any> {
  return getFromStorage('currentWallpaper', null)
}

export async function setCurrentWallpaper(wallpaper: any): Promise<void> {
  return setToStorage('currentWallpaper', wallpaper)
}

export async function getWallpaperSource(): Promise<string | null> {
  return getFromStorage('wallpaperSource', null)
}

export async function setWallpaperSource(source: string): Promise<void> {
  return setToStorage('wallpaperSource', source)
}

export async function getSearchEngine(): Promise<string | null> {
  return getFromStorage('searchEngine', null)
}

export async function setSearchEngine(engine: string): Promise<void> {
  return setToStorage('searchEngine', engine)
}

// Settings-specific helpers
// Sync version for initial load (always reads localStorage)
export function loadSettingsSync(): Partial<Settings> {
  return loadFromLocalStorage(SETTINGS_KEY, {})
}

// Async version (tries chrome.storage first)
export async function loadSettings(): Promise<Partial<Settings>> {
  if (isChromeStorageAvailable()) {
    try {
      const result = await chrome.storage.local.get([SETTINGS_KEY])
      return result[SETTINGS_KEY] ?? {}
    } catch {
      return loadFromLocalStorage(SETTINGS_KEY, {})
    }
  }
  return loadFromLocalStorage(SETTINGS_KEY, {})
}

export function saveSettingsSync(partial: Partial<Settings>): void {
  const current = loadFromLocalStorage(SETTINGS_KEY, {})
  const merged = { ...current, ...partial }
  saveToLocalStorage(SETTINGS_KEY, merged)
  if (isChromeStorageAvailable()) {
    chrome.storage.local.set({ [SETTINGS_KEY]: merged }).catch(() => {})
  }
}

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

// JSON helpers for arbitrary keys
export async function loadJSON<T>(key: string, fallback: T): Promise<T> {
  return getFromStorage(key, fallback)
}

export async function saveJSON<T>(key: string, value: T): Promise<void> {
  return setToStorage(key, value)
}
