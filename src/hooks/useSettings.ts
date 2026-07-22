/**
  * @fileoverview Hook for accessing application settings context.
  */

import { useContext } from 'react'
import { SettingsContext } from '../context/SettingsContext'
import type { Settings, SettingsKey } from '../types'

/** Return type for useSettings hook */
interface UseSettingsReturn {
    /** Current application settings */
    settings: Settings
    /** Function to update a setting */
    update: (key: SettingsKey, value: any) => void
}

/**
  * Hook to access the settings context.
  * Must be used within a SettingsProvider.
  * 
  * @returns Settings object and update function
  * @throws Error if used outside SettingsProvider
  */
export function useSettings(): UseSettingsReturn {
    const ctx = useContext(SettingsContext)
    if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
    return ctx
}
