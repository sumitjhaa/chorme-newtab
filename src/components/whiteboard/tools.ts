/**
  * @fileoverview Whiteboard tool definitions and utilities.
  */

/** Tool type constants */
export const TOOL_TYPES = {
    PENCIL: 'pencil',
    MARKER: 'marker',
    WHITEBRUSH: 'whitebrush',
    ERASER: 'eraser',
    LINE: 'line',
    RECT: 'rect',
    CIRCLE: 'circle',
    ARROW: 'arrow',
} as const

/** Tool ID type */
export type ToolId = typeof TOOL_TYPES[keyof typeof TOOL_TYPES]

/** Tool definition interface */
export interface ToolDef {
    /** Tool identifier */
    id: ToolId
    /** Display label */
    label: string
    /** Icon identifier */
    icon: string
    /** Default line width */
    lineWidth: number
    /** Tool opacity (0-1) */
    opacity: number
    /** Canvas composite operation */
    compositeOp: string
    /** Tool category */
    category: 'draw' | 'shape'
}

/** Available drawing tools */
export const TOOLS: ToolDef[] = [
    {
        id: TOOL_TYPES.PENCIL,
        label: 'Pencil',
        icon: 'pencil',
        lineWidth: 2,
        opacity: 1,
        compositeOp: 'source-over',
        category: 'draw',
    },
    {
        id: TOOL_TYPES.MARKER,
        label: 'Marker',
        icon: 'marker',
        lineWidth: 12,
        opacity: 0.6,
        compositeOp: 'source-over',
        category: 'draw',
    },
    {
        id: TOOL_TYPES.WHITEBRUSH,
        label: 'White Brush',
        icon: 'whitebrush',
        lineWidth: 8,
        opacity: 1,
        compositeOp: 'source-over',
        category: 'draw',
    },
    {
        id: TOOL_TYPES.ERASER,
        label: 'Eraser',
        icon: 'eraser',
        lineWidth: 24,
        opacity: 1,
        compositeOp: 'destination-out',
        category: 'draw',
    },
    {
        id: TOOL_TYPES.LINE,
        label: 'Line',
        icon: 'line',
        lineWidth: 2,
        opacity: 1,
        compositeOp: 'source-over',
        category: 'shape',
    },
    {
        id: TOOL_TYPES.RECT,
        label: 'Rectangle',
        icon: 'rect',
        lineWidth: 2,
        opacity: 1,
        compositeOp: 'source-over',
        category: 'shape',
    },
    {
        id: TOOL_TYPES.CIRCLE,
        label: 'Circle',
        icon: 'circle',
        lineWidth: 2,
        opacity: 1,
        compositeOp: 'source-over',
        category: 'shape',
    },
    {
        id: TOOL_TYPES.ARROW,
        label: 'Arrow',
        icon: 'arrow',
        lineWidth: 2,
        opacity: 1,
        compositeOp: 'source-over',
        category: 'shape',
    },
]

/** Preset color palette */
export const PRESET_COLORS = [
    '#ffffff', '#000000', '#ef4444', '#f97316',
    '#eab308', '#22c55e', '#3b82f6', '#8b5cf6',
    '#ec4899', '#06b6d4', '#84cc16', '#f43f5e',
]

/**
  * Get tool definition by ID.
  * @param id - Tool ID
  * @returns Tool definition (defaults to pencil)
  */
export function getToolById(id: string): ToolDef {
    return TOOLS.find(t => t.id === id) || TOOLS[0]
}

/**
  * Check if a tool is a shape tool.
  * @param id - Tool ID
  * @returns Whether the tool is a shape tool
  */
export function isShapeTool(id: string): boolean {
    const t = getToolById(id)
    return t.category === 'shape'
}
