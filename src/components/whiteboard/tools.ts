// @ts-nocheck
export const TOOL_TYPES = {
  PENCIL: 'pencil',
  MARKER: 'marker',
  WHITEBRUSH: 'whitebrush',
  ERASER: 'eraser',
  LINE: 'line',
  RECT: 'rect',
  CIRCLE: 'circle',
  ARROW: 'arrow',
}

export const TOOLS = [
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

export const PRESET_COLORS = [
  '#ffffff', '#000000', '#ef4444', '#f97316',
  '#eab308', '#22c55e', '#3b82f6', '#8b5cf6',
  '#ec4899', '#06b6d4', '#84cc16', '#f43f5e',
]

export function getToolById(id) {
  return TOOLS.find(t => t.id === id) || TOOLS[0]
}

export function isShapeTool(id) {
  const t = getToolById(id)
  return t.category === 'shape'
}
