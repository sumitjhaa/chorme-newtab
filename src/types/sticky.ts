/**
 * @fileoverview Type definitions for sticky notes functionality.
 */

/** A single sticky note */
export interface StickyNote {
  /** Unique identifier */
  id: string
  /** Note text content */
  text: string
  /** Background color */
  color: string
  /** Position on canvas */
  position: { x: number; y: number }
  /** Dimensions */
  size: { width: number; height: number }
  /** Creation timestamp */
  createdAt: number
  /** Last update timestamp */
  updatedAt: number
}

/** State management for sticky notes */
export interface StickyNoteState {
  /** Array of all sticky notes */
  notes: StickyNote[]
  /** Currently active/selected note ID */
  activeNoteId: string | null
}
