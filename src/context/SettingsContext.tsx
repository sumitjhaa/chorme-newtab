/**
  * @fileoverview React context for application settings with cross-tab synchronization.
  */

import { createContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react'
import { SETTINGS_DEFAULTS } from '../utils/defaults'
import { loadSettingsSync, saveSettingsSync } from '../utils/storage'
import type { Settings, SettingsKey } from '../types'

/** Context value containing settings and update function */
interface SettingsContextValue {
    /** Current application settings */
    settings: Settings
    /** Function to update a setting by key */
    update: (key: SettingsKey, value: Settings[SettingsKey]) => void
}

/** React context for settings */
export const SettingsContext = createContext<SettingsContextValue | null>(null)

/**
  * Read all settings from storage with defaults applied.
  * @returns Merged settings object
  */
function readAllSettings(): Settings {
    const stored = loadSettingsSync()
    return { ...SETTINGS_DEFAULTS, ...stored }
}

/**
  * Settings provider component that manages application settings state.
  * Syncs settings across tabs using BroadcastChannel and chrome.storage.
  * 
  * @param props.children - Child components
  */
export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState(readAllSettings)

    const bc = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('newtab-settings') : null

    const update = useCallback((key: SettingsKey, value: Settings[SettingsKey]) => {
        setSettings(prev => {
            const next = { ...prev, [key]: value }
            saveSettingsSync({ [key]: value })
            if (bc) bc.postMessage({ key, value })
            return next
        })
    }, [bc])

    useEffect(() => {
        async function loadFromChrome() {
            try {
                const stored = await chrome.storage.local.get(undefined as unknown as string)
                if (Object.keys(stored).length) {
                    setSettings(prev => ({ ...prev, ...stored } as Settings))
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
        return () => window.removeEventListener('storage', handleStorage)
    }, [])

    useEffect(() => {
        if (typeof chrome === 'undefined' || !chrome?.storage?.onChanged) return
        function onChange(changes: { [key: string]: { newValue?: unknown; oldValue?: unknown } }, area: string) {
            if (area !== 'local') return
            const patch: Record<string, unknown> = {}
            for (const [key, { newValue }] of Object.entries(changes)) {
                if (newValue !== undefined) patch[key] = newValue
            }
            if (Object.keys(patch).length) {
                setSettings(prev => ({ ...prev, ...patch } as Settings))
            }
        }
        chrome.storage.onChanged.addListener(onChange)
        return () => chrome.storage.onChanged.removeListener(onChange)
    }, [])

    useEffect(() => {
        if (!bc) return
        bc.onmessage = (e: MessageEvent) => {
            if (e.data?.key) {
                setSettings(prev => ({ ...prev, [e.data.key]: e.data.value } as Settings))
            }
        }
        return () => { bc.onmessage = null }
    }, [bc])

    const value = useMemo(() => ({ settings, update }), [settings, update])

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    )
}
