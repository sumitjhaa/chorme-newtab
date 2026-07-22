/**
 * @fileoverview Widget layout management utilities for column-based positioning.
 */

import type { WidgetId, LayoutMap, LayoutPosition } from '../types'
import { LAYOUT_DEFAULTS } from '../utils/defaults'

const LAYOUT_KEY = 'newtab_layout'
const NUM_COLUMNS = 6

/** Default layout for all widgets */
export const DEFAULT_LAYOUT: LayoutMap = LAYOUT_DEFAULTS as LayoutMap

/** Load layout from localStorage */
export function loadLayout(): LayoutMap {
  try {
    const data = JSON.parse(localStorage.getItem(LAYOUT_KEY) || 'null')
    if (!data) return DEFAULT_LAYOUT
    const merged = { ...DEFAULT_LAYOUT, ...data } as LayoutMap
    return merged
  } catch {
    return DEFAULT_LAYOUT
  }
}

/** Save layout to localStorage */
export function saveLayout(layout: LayoutMap): void {
  try {
    localStorage.setItem(LAYOUT_KEY, JSON.stringify(layout))
  } catch {}
}

/** Calculate which widgets go in which columns based on settings and layout */
export function calculateColumns(
  visibleWidgets: { id: WidgetId; component: React.ReactNode }[],
  layout: LayoutMap,
  numColumns: number = NUM_COLUMNS
): {
  columns: { id: WidgetId; component: React.ReactNode; order: number }[][]
  searchBarWidget: { id: WidgetId; component: React.ReactNode } | undefined
  sbCol: number
} {
  const columns: { id: WidgetId; component: React.ReactNode; order: number }[][] = Array.from(
    { length: numColumns },
    () => []
  )

  const searchBarWidget = visibleWidgets.find((w) => w.id === 'search-bar')
  const sbLayout = layout['search-bar'] || { col: 1 }
  const sbCol = Math.min(sbLayout.col ?? 1, numColumns - 2)

  visibleWidgets.forEach((w) => {
    if (w.id === 'search-bar') return
    const pos = layout[w.id] || { col: 0, order: 0 }
    const col = Math.min(pos.col, numColumns - 1)
    columns[col].push({ ...w, order: pos.order })
  })

  columns.forEach((col) => col.sort((a, b) => a.order - b.order))

  return { columns, searchBarWidget, sbCol }
}

/** Reorder widgets in a column after a drop */
export function reorderAfterDrop(
  prev: LayoutMap,
  widgetId: string,
  targetCol: number,
  targetOrder: number
): LayoutMap {
  const next = { ...prev }

  const affectedInTarget = Object.entries(next)
    .filter(([id, pos]) => id !== widgetId && pos.col === targetCol)
    .sort((a, b) => a[1].order - b[1].order)

  affectedInTarget.forEach(([id, pos], i) => {
    if (i >= targetOrder) {
      next[id as WidgetId] = { ...pos, order: i + 1 }
    } else {
      next[id as WidgetId] = pos
    }
  })

  next[widgetId as WidgetId] = { col: targetCol, order: targetOrder }
  saveLayout(next)
  return next
}
