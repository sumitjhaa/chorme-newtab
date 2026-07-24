/**
  * @fileoverview Type definitions for todo list functionality.
  */

/** A single todo item */
export interface TodoItem {
    /** Unique identifier */
    id: string
    /** URL of the bookmark */
    url: string
    /** Custom title set by user (overrides fetched title) */
    customTitle: string
    /** Auto-fetched page title */
    fetchedTitle: string
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
