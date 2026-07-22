import { loadSettings, saveSettings, loadJSON, saveJSON } from '../utils/persistence.js'

function hasChromeStorage() {
  return typeof chrome !== 'undefined' && chrome?.storage?.local
}

export async function getFromStorage(key) {
  if (hasChromeStorage()) {
    try {
      const result = await chrome.storage.local.get([key])
      return result[key] ?? null
    } catch {}
  }
  const data = loadSettings()
  return data[key] ?? null
}

export async function setToStorage(key, value) {
  if (hasChromeStorage()) {
    try {
      await chrome.storage.local.set({ [key]: value })
      return
    } catch {}
  }
  saveSettings({ [key]: value })
}

export function loadSettingsAll() {
  if (hasChromeStorage()) {
    chrome.storage.local.get(null).catch(() => {})
  }
  return loadSettings()
}

export function saveSetting(key, value) {
  saveSettings({ [key]: value })
  try { chrome?.storage?.local?.set({ [key]: value }) } catch {}
}

export { loadJSON, saveJSON }
