/**
 * @fileoverview React context for application settings with cross-tab synchronization.
 */

import { createContext, useState, useEffect, useCallback, useMemo, useRef, type ReactNode } from 'react'
import { SETTINGS_DEFAULTS } from '../utils/defaults'
import { loadSettingsSync, saveSettingsSync } from '../utils/storage'
import type { Settings, SettingsKey } from '../types'

interface SettingsContextValue {
    settings: Settings
    update: (key: SettingsKey, value: Settings[SettingsKey]) => void
}

export const SettingsContext = createContext<SettingsContextValue | null>(null)

function readAllSettings(): Settings {
    const stored = loadSettingsSync()
    return { ...SETTINGS_DEFAULTS, ...stored }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState(readAllSettings)
    const bcRef = useRef<BroadcastChannel | null>(null)

    if (!bcRef.current && typeof BroadcastChannel !== 'undefined') {
        bcRef.current = new BroadcastChannel('newtab-settings')
    }

    const update = useCallback((key: SettingsKey, value: Settings[SettingsKey]) => {
        setSettings(prev => {
            const next = { ...prev, [key]: value }
            saveSettingsSync({ [key]: value })
            bcRef.current?.postMessage({ key, value })
            return next
        })
    }, [])

    useEffect(() => {
        const bc = bcRef.current
        if (!bc) return
        bc.onmessage = (e: MessageEvent) => {
            if (e.data?.key) {
                setSettings(prev => ({ ...prev, [e.data.key]: e.data.value } as Settings))
            }
        }
        return () => { bc.onmessage = null }
    }, [])

    useEffect(() => {
        function handleStorage() {
            setSettings(readAllSettings())
        }
        window.addEventListener('storage', handleStorage)
        return () => window.removeEventListener('storage', handleStorage)
    }, [])

    const value = useMemo(() => ({ settings, update }), [settings, update])

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    )
}
