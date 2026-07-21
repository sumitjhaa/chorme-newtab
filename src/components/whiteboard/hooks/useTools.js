import { useState, useCallback } from 'react'
import { TOOL_TYPES, PRESET_COLORS, getToolById } from '../tools.js'

const STORAGE_KEY = 'newtab_whiteboard'

function loadToolState() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    return {
      activeTool: data?.activeTool || TOOL_TYPES.PENCIL,
      color: data?.color || PRESET_COLORS[0],
      lineWidth: data?.lineWidth ?? 2,
    }
  } catch {
    return { activeTool: TOOL_TYPES.PENCIL, color: PRESET_COLORS[0], lineWidth: 2 }
  }
}

function saveToolState(state) {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || {}
    Object.assign(data, state)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {}
}

export function useTools() {
  const [activeTool, setActiveTool] = useState(() => loadToolState().activeTool)
  const [color, setColor] = useState(() => loadToolState().color)
  const [lineWidth, setLineWidth] = useState(() => loadToolState().lineWidth)

  const selectTool = useCallback((id) => {
    setActiveTool(id)
    const base = getToolById(id)
    const next = base.id === 'eraser' ? base.lineWidth : lineWidth
    saveToolState({ activeTool: id, lineWidth: next })
  }, [lineWidth])

  const selectColor = useCallback((c) => {
    setColor(c)
    saveToolState({ color: c })
  }, [])

  const selectLineWidth = useCallback((w) => {
    setLineWidth(w)
    saveToolState({ lineWidth: w })
  }, [])

  const tool = { ...getToolById(activeTool), lineWidth }

  return { activeTool, color, tool, lineWidth, selectTool, selectColor, selectLineWidth }
}
