// @ts-nocheck
const STORAGE_KEY = 'newtab_lists'

export function loadLists() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (Array.isArray(data)) return data
    return []
  } catch { return [] }
}

export function saveLists(lists) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lists))
  window.dispatchEvent(new Event('lists-update'))
}
