// @ts-nocheck
export interface StickyNote {
  id: string
  text: string
  color: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  createdAt: number
  updatedAt: number
}

export interface StickyNoteState {
  notes: StickyNote[]
  activeNoteId: string | null
}
