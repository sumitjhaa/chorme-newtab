// @ts-nocheck
const SETTINGS_KEY = 'newtab_settings'

export function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}')
  } catch {
    return {}
  }
}

export function saveSettings(partial) {
  try {
    const data = loadSettings()
    Object.assign(data, partial)
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(data))
  } catch {}
}

export function loadJSON(key, fallback = null) {
  try {
    const data = JSON.parse(localStorage.getItem(key) || 'null')
    return data ?? fallback
  } catch {
    return fallback
  }
}

export function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}
