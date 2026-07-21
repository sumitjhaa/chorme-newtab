const STORAGE_KEY = 'newtab_sticky'

export function loadNotes() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (Array.isArray(data)) return data
    if (data && typeof data === 'object') return [{ html: data.html || data.text || '', colorIdx: data.colorIdx ?? 0 }]
    return []
  } catch { return [] }
}

export function saveNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  window.dispatchEvent(new Event('sticky-update'))
}
