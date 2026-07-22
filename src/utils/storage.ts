// @ts-nocheck
import { STORAGE_KEYS } from '../constants'

function loadAll() {
  try {
    return JSON.parse(localStorage.getItem('newtab_settings') || '{}')
  } catch {
    return {}
  }
}

function saveAll(data) {
  try {
    localStorage.setItem('newtab_settings', JSON.stringify(data))
  } catch {}
}

export async function getFromStorage(key) {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    try {
      const result = await chrome.storage.local.get([key])
      return result[key] ?? null
    } catch {
      const all = loadAll()
      return all[key] ?? null
    }
  }
  const all = loadAll()
  return all[key] ?? null
}

export async function setToStorage(key, value) {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    try {
      await chrome.storage.local.set({ [key]: value })
      return
    } catch {}
  }
  const all = loadAll()
  all[key] = value
  saveAll(all)
}

export async function getCurrentWallpaper() {
  return getFromStorage(STORAGE_KEYS.CURRENT_WALLPAPER)
}

export async function setCurrentWallpaper(wallpaper) {
  return setToStorage(STORAGE_KEYS.CURRENT_WALLPAPER, wallpaper)
}

export async function getWallpaperSource() {
  return getFromStorage(STORAGE_KEYS.WALLPAPER_SOURCE)
}

export async function setWallpaperSource(source) {
  return setToStorage(STORAGE_KEYS.WALLPAPER_SOURCE, source)
}

export async function getSearchEngine() {
  return getFromStorage(STORAGE_KEYS.SEARCH_ENGINE)
}

export async function setSearchEngine(engine) {
  return setToStorage(STORAGE_KEYS.SEARCH_ENGINE, engine)
}
