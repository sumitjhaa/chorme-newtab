// @ts-nocheck
import { useContext } from 'react'
import { SettingsContext } from '../context/SettingsContext'
import type { Settings, SettingsKey } from '../types'

interface UseSettingsReturn {
  settings: Settings
  update: (key: SettingsKey, value: any) => void
}

export function useSettings(): UseSettingsReturn {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
