// @ts-nocheck
import type { WidgetId } from './index'

export interface WidgetConfig {
  id: WidgetId
  label: string
  description: string
  icon: string
  category: 'core' | 'productivity' | 'tools'
}

export interface WidgetState {
  visible: boolean
  collapsed: boolean
  position: { col: number; order: number }
}

export type WidgetStates = Record<WidgetId, WidgetState>
