/**
 * @fileoverview localStorage persistence utilities for todo lists.
 */

import type { TodoList } from '../../types/list'

/** localStorage key for todo lists */
const STORAGE_KEY = 'newtab_lists'

/**
 * Load todo lists from localStorage.
 * @returns Array of todo lists
 */
export function loadLists(): TodoList[] {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (Array.isArray(data)) return data
    return []
  } catch { return [] }
}

/**
 * Save todo lists to localStorage and dispatch update event.
 * @param lists - Array of todo lists to save
 */
export function saveLists(lists: TodoList[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lists))
  window.dispatchEvent(new Event('lists-update'))
}
