/**
 * @fileoverview Type definitions for todo list functionality.
 */

/** A single todo item */
export interface TodoItem {
  /** Unique identifier */
  id: string
  /** Task description */
  text: string
  /** Associated URL (optional) */
  url: string
  /** Link title (optional) */
  title: string
  /** Completion status */
  completed: boolean
  /** Creation timestamp */
  createdAt: number
}

/** A todo list containing multiple items */
export interface TodoList {
  /** Unique identifier */
  id: string
  /** List title */
  title: string
  /** Array of todo items */
  items: TodoItem[]
  /** Creation timestamp */
  createdAt: number
  /** Last update timestamp */
  updatedAt: number
}

/** State management for todo lists */
export interface ListsState {
  /** Array of all todo lists */
  lists: TodoList[]
  /** Currently active/selected list ID */
  activeListId: string | null
}
