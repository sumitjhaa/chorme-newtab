/**
 * @fileoverview Hook for managing todo lists with localStorage persistence.
 */

import { useCallback } from 'react'
import { useStorageSync } from '../../../hooks/useStorageSync'
import type { TodoList } from '../../../types/list'

/**
 * Hook for managing todo lists with localStorage persistence.
 * 
 * @returns Lists data and CRUD operations
 */
export function useLists() {
  const { data: lists, setData: setLists } = useStorageSync<TodoList[]>('newtab_lists', 'lists-update', (raw) => {
    try {
      const data = JSON.parse(raw || '[]')
      return Array.isArray(data) ? (data as TodoList[]) : []
    } catch { return [] }
  })

  const addList = useCallback(() => {
    const now = Date.now()
    setLists(prev => [...prev, { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), title: '', items: [], createdAt: now, updatedAt: now }])
  }, [setLists])

  const updateList = useCallback((i: number, list: TodoList) => {
    setLists(prev => prev.map((l, idx) => idx === i ? list : l))
  }, [setLists])

  const removeList = useCallback((i: number) => {
    setLists(prev => prev.filter((_, idx) => idx !== i))
  }, [setLists])

  return { lists, addList, updateList, removeList }
}
