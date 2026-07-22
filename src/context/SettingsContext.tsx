// @ts-nocheck
import { createContext, useState, useEffect, useCallback, useMemo } from 'react'
import { SETTINGS_DEFAULTS } from '../utils/defaults'
import { loadSettingsSync, saveSettingsSync } from '../utils/storage'
import type { Settings, SettingsKey } from '../types'

interface SettingsContextValue {
  settings: Settings
  update: (key: SettingsKey, value: any) => void
}

export const SettingsContext = createContext<SettingsContextValue | null>(null)

function readAllSettings(): Settings {
  const stored = loadSettingsSync()
  return { ...SETTINGS_DEFAULTS, ...stored }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(readAllSettings)

  const update = useCallback((key: SettingsKey, value: any) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value }
      saveSettingsSync({ [key]: value })
      try { chrome?.storage?.local?.set({ [key]: value }) } catch {}
      return next
    })
  }, [])

  useEffect(() => {
    async function loadFromChrome() {
      try {
        const stored = await chrome.storage.local.get(null)
        if (Object.keys(stored).length) {
          setSettings(prev => ({ ...prev, ...stored }))
        }
      } catch {}
    }
    loadFromChrome()
  }, [])

  useEffect(() => {
    function handleStorage() {
      setSettings(readAllSettings())
    }
    window.addEventListener('storage', handleStorage)
    const id = setInterval(handleStorage, 300)
    return () => {
      window.removeEventListener('storage', handleStorage)
      clearInterval(id)
    }
  }, [])

  useEffect(() => {
    if (typeof chrome === 'undefined' || !chrome?.storage?.onChanged) return
    function onChange(changes, area) {
      if (area !== 'local') return
      const patch = {}
      for (const [key, { newValue }] of Object.entries(changes)) {
        if (newValue !== undefined) patch[key] = newValue
      }
      if (Object.keys(patch).length) {
        setSettings(prev => ({ ...prev, ...patch }))
      }
    }
    chrome.storage.onChanged.addListener(onChange)
    return () => chrome.storage.onChanged.removeListener(onChange)
  }, [])

  const value = useMemo(() => ({ settings, update }), [settings, update])

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}
