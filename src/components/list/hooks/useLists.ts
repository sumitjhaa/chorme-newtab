// @ts-nocheck
import { useState, useEffect, useRef, useCallback } from 'react'
import { loadLists, saveLists } from '../persistence'

export function useLists() {
  const [lists, setLists] = useState(loadLists)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    function refresh() { setLists(loadLists()) }
    window.addEventListener('lists-update', refresh)
    const interval = setInterval(refresh, 300)
    setReady(true)
    return () => {
      window.removeEventListener('lists-update', refresh)
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    if (ready) saveLists(lists)
  }, [lists, ready])

  const addList = useCallback(() => {
    setLists(prev => [...prev, { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), title: '', items: [] }])
  }, [])

  const updateList = useCallback((i, list) => {
    setLists(prev => prev.map((l, idx) => idx === i ? list : l))
  }, [])

  const removeList = useCallback((i) => {
    setLists(prev => prev.filter((_, idx) => idx !== i))
  }, [])

  return { lists, addList, updateList, removeList }
}
