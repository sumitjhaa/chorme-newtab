/**
  * @fileoverview Type definitions for widget configuration.
  */

import type { WidgetId } from './index'

/** Widget configuration and metadata */
export interface WidgetConfig {
    /** Widget identifier */
    id: WidgetId
    /** Display label */
    label: string
    /** Description of widget functionality */
    description: string
    /** Icon identifier */
    icon: string
    /** Widget category */
    category: 'core' | 'productivity' | 'tools'
}

/** Widget state for visibility and positioning */
export interface WidgetState {
    /** Whether widget is visible */
    visible: boolean
    /** Whether widget is collapsed */
    collapsed: boolean
    /** Layout position */
    position: { col: number; order: number }
}

/** Mapping of widget IDs to their states */
export type WidgetStates = Record<WidgetId, WidgetState>
