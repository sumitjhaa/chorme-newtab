import { useState, useEffect, useRef, useCallback } from 'react'
import { loadNotes, saveNotes } from '../persistence.js'

function disableWidget() {
  try {
    const data = JSON.parse(localStorage.getItem('newtab_settings') || '{}')
    if (!data.showStickyNote) return
    data.showStickyNote = false
    localStorage.setItem('newtab_settings', JSON.stringify(data))
    try { chrome.storage.local.set({ showStickyNote: false }) } catch {}
    window.dispatchEvent(new Event('storage'))
  } catch {}
}

export function useNotes() {
  const [notes, setNotes] = useState(loadNotes)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    function refresh() { setNotes(loadNotes()) }
    window.addEventListener('sticky-update', refresh)
    const interval = setInterval(refresh, 300)
    setReady(true)
    return () => {
      window.removeEventListener('sticky-update', refresh)
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    if (ready) saveNotes(notes)
  }, [notes, ready])

  useEffect(() => {
    if (notes.length === 0) disableWidget()
  }, [notes.length])

  const update = useCallback((i, note) => {
    setNotes(prev => prev.map((n, idx) => idx === i ? note : n))
  }, [])

  const remove = useCallback((i) => {
    setNotes(prev => prev.filter((_, idx) => idx !== i))
  }, [])

  return { notes, update, remove }
}
