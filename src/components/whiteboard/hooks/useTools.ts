/**
 * @fileoverview Hook for managing whiteboard tool state.
 */

import { useState, useCallback } from 'react'
import { TOOL_TYPES, PRESET_COLORS, getToolById, type ToolDef } from '../tools'

/** localStorage key for tool state */
const STORAGE_KEY = 'newtab_whiteboard'

/** Tool state interface */
interface ToolState {
  /** Active tool ID */
  activeTool: string
  /** Selected color */
  color: string
  /** Line width */
  lineWidth: number
}

/**
 * Load tool state from localStorage.
 * @returns Saved tool state
 */
function loadToolState(): ToolState {
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

/**
 * Save tool state to localStorage.
 * @param state - Partial state to save
 */
function saveToolState(state: Partial<ToolState>): void {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || {}
    Object.assign(data, state)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {}
}

/**
 * Hook for managing whiteboard tool state with persistence.
 * 
 * @returns Tool state and selection functions
 */
export function useTools() {
  const [activeTool, setActiveTool] = useState<string>(() => loadToolState().activeTool)
  const [color, setColor] = useState<string>(() => loadToolState().color)
  const [lineWidth, setLineWidth] = useState<number>(() => loadToolState().lineWidth)

  const selectTool = useCallback((id: string) => {
    setActiveTool(id)
    const base = getToolById(id)
    const next = base.id === 'eraser' ? base.lineWidth : lineWidth
    saveToolState({ activeTool: id, lineWidth: next })
  }, [lineWidth])

  const selectColor = useCallback((c: string) => {
    setColor(c)
    saveToolState({ color: c })
  }, [])

  const selectLineWidth = useCallback((w: number) => {
    setLineWidth(w)
    saveToolState({ lineWidth: w })
  }, [])

  const tool: ToolDef = { ...getToolById(activeTool), lineWidth }

  return { activeTool, color, tool, lineWidth, selectTool, selectColor, selectLineWidth }
}
