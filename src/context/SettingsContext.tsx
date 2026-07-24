/**
 * @fileoverview React context for application settings with cross-tab synchronization.
 */

import { createContext, useState, useEffect, useCallback, useMemo, useRef, type ReactNode } from 'react'
import { SETTINGS_DEFAULTS } from '../utils/defaults'
import { loadSettingsSync, saveSettingsSync } from '../utils/storage'
import type { Settings, SettingsKey } from '../types'

interface SettingsContextValue {
    settings: Settings
    update: <K extends SettingsKey>(key: K, value: Settings[K]) => void
}

export const SettingsContext = createContext<SettingsContextValue | null>(null)

function readAllSettings(): Settings {
    const stored = loadSettingsSync()
    return { ...SETTINGS_DEFAULTS, ...stored }
}

const STORAGE_FLUSH_MS = 150

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState(readAllSettings)
    const bcRef = useRef<BroadcastChannel | null>(null)
    const pendingRef = useRef<Record<string, unknown>>({})
    const storageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const channelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const pendingChannelRef = useRef<Record<string, unknown>>({})

    useEffect(() => {
        if (typeof BroadcastChannel !== 'undefined') {
            bcRef.current = new BroadcastChannel('newtab-settings')
        }
        return () => {
            bcRef.current?.close()
            bcRef.current = null
        }
    }, [])

    const flushStorage = useCallback(() => {
        if (Object.keys(pendingRef.current).length === 0) return
        saveSettingsSync(pendingRef.current as Partial<Settings>)
        pendingRef.current = {}
    }, [])

    const flushChannel = useCallback(() => {
        const pending = { ...pendingChannelRef.current }
        pendingChannelRef.current = {}
        if (Object.keys(pending).length > 0) {
            bcRef.current?.postMessage(pending)
        }
    }, [])

    useEffect(() => () => {
        flushStorage()
        flushChannel()
        if (storageTimerRef.current) clearTimeout(storageTimerRef.current)
        if (channelTimerRef.current) clearTimeout(channelTimerRef.current)
    }, [flushStorage, flushChannel])

    const update = useCallback(<K extends SettingsKey>(key: K, value: Settings[K]) => {
        setSettings(prev => ({ ...prev, [key]: value }))

        pendingRef.current[key] = value
        if (storageTimerRef.current) clearTimeout(storageTimerRef.current)
        storageTimerRef.current = setTimeout(() => {
            flushStorage()
            storageTimerRef.current = null
        }, STORAGE_FLUSH_MS)

        pendingChannelRef.current[key] = value
        if (channelTimerRef.current) clearTimeout(channelTimerRef.current)
        channelTimerRef.current = setTimeout(() => {
            flushChannel()
            channelTimerRef.current = null
        }, STORAGE_FLUSH_MS)
    }, [flushStorage, flushChannel])

    useEffect(() => {
        const bc = bcRef.current
        if (!bc) return
        bc.onmessage = (e: MessageEvent) => {
            if (e.data && typeof e.data === 'object') {
                setSettings(prev => ({ ...prev, ...e.data } as Settings))
            }
        }
        return () => { bc.onmessage = null }
    }, [])

    useEffect(() => {
        let debounceTimer: ReturnType<typeof setTimeout> | null = null
        function handleStorage() {
            if (debounceTimer) clearTimeout(debounceTimer)
            debounceTimer = setTimeout(() => {
                setSettings(readAllSettings())
                debounceTimer = null
            }, STORAGE_FLUSH_MS)
        }
        window.addEventListener('storage', handleStorage)
        return () => {
            window.removeEventListener('storage', handleStorage)
            if (debounceTimer) clearTimeout(debounceTimer)
        }
    }, [])

    const value = useMemo(() => ({ settings, update }), [settings, update])

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    )
}
