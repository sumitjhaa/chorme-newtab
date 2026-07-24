/**
  * @fileoverview Widget layout management utilities for column-based positioning.
  */

import type { LayoutMap } from '../types'
import { LAYOUT_DEFAULTS } from '../utils/defaults'

const LAYOUT_KEY = 'newtab_layout'

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
