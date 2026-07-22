// @ts-nocheck
export type ToolType = 'pen' | 'eraser' | 'line' | 'rect' | 'circle' | 'text'

export interface WhiteboardTool {
  type: ToolType
  color: string
  size: number
}

export interface WhiteboardState {
  tools: WhiteboardTool[]
  activeTool: ToolType
  color: string
  brushSize: number
}
