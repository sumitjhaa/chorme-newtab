/**
 * @fileoverview Type definitions for whiteboard functionality.
 */

/** Available drawing tool types */
export type ToolType = 'pen' | 'eraser' | 'line' | 'rect' | 'circle' | 'text'

/** Whiteboard drawing tool configuration */
export interface WhiteboardTool {
  /** Tool type */
  type: ToolType
  /** Drawing color */
  color: string
  /** Brush/line size */
  size: number
}

/** Whiteboard state management */
export interface WhiteboardState {
  /** Available drawing tools */
  tools: WhiteboardTool[]
  /** Currently selected tool */
  activeTool: ToolType
  /** Current drawing color */
  color: string
  /** Current brush size */
  brushSize: number
}
