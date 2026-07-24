/**
  * @fileoverview Hook for managing todo lists with localStorage persistence.
  */

import { useCallback } from 'react'
import { useStorageSync } from './useStorageSync'
import { generateId } from '../lib'
import type { TodoList, TodoItem } from '../types/list'

/**
  * Migrate legacy TodoItem shapes to the current format.
  */
function migrateItem(raw: unknown): TodoItem {
    const n = raw as Record<string, unknown>
    return {
        id: (n.id as string) || generateId(),
        url: (n.url as string) || '',
        customTitle: (n.customTitle as string) || (n.title as string) || '',
        fetchedTitle: (n.fetchedTitle as string) || '',
        completed: (n.completed as boolean) || false,
        createdAt: (n.createdAt as number) || Date.now(),
    }
}

function migrateLists(raw: string): TodoList[] {
    try {
        const data = JSON.parse(raw || '[]')
        if (!Array.isArray(data)) return []
        return data.map((l: Record<string, unknown>) => ({
            id: (l.id as string) || generateId(),
            title: (l.title as string) || '',
            items: Array.isArray(l.items) ? l.items.map(migrateItem) : [],
            createdAt: (l.createdAt as number) || Date.now(),
            updatedAt: (l.updatedAt as number) || Date.now(),
        }))
    } catch { return [] }
}

/**
  * Hook for managing todo lists with localStorage persistence.
  * All mutations are ID-based to prevent index-shift bugs.
  */
export function useLists() {
    const { data: lists, setData: setLists } = useStorageSync<TodoList[]>('newtab_lists', 'lists-update', migrateLists)

    const addList = useCallback((id?: string) => {
        const now = Date.now()
        const newId = id || generateId()
        setLists(prev => [...prev, {
            id: newId,
            title: '',
            items: [],
            createdAt: now,
            updatedAt: now,
        }])
        return newId
    }, [setLists])

    const updateList = useCallback((id: string, list: TodoList) => {
        setLists(prev => prev.map(l => l.id === id ? list : l))
    }, [setLists])

    const removeList = useCallback((id: string) => {
        setLists(prev => prev.filter(l => l.id !== id))
    }, [setLists])

    const getList = useCallback((id: string) => {
        return lists.find(l => l.id === id)
    }, [lists])

    return { lists, addList, updateList, removeList, getList }
}
