/**
  * @fileoverview Hook for synchronizing state with localStorage via custom events.
  */

import { useState, useEffect, useCallback, useRef } from 'react'

/**
  * Synchronizes state with localStorage via custom events.
  * 
  * @param key - localStorage key to sync
  * @param eventName - custom event name to listen for (e.g., 'sticky-update')
  * @param parser - optional custom parser (defaults to JSON.parse)
  */
export function useStorageSync<T>(
    key: string,
    eventName?: string,
    parser?: (raw: string) => T
): {
    data: T
    setData: (value: T | ((prev: T) => T)) => void
    reload: () => void
} {
    const [data, setDataState] = useState<T>(() => {
        const raw = localStorage.getItem(key)
        if (raw === null) return (Array.isArray(undefined) ? [] : {}) as T
        return parser ? parser(raw) : JSON.parse(raw)
    })

    const parserRef = useRef(parser)
    parserRef.current = parser

    const reload = useCallback(() => {
        const raw = localStorage.getItem(key)
        if (raw === null) {
            setDataState((Array.isArray(undefined) ? [] : {}) as T)
        } else {
            setDataState(parserRef.current ? parserRef.current(raw) : JSON.parse(raw))
        }
    }, [key])

    useEffect(() => {
        if (!eventName) return

        const handler = () => reload()
        window.addEventListener(eventName, handler)
        return () => window.removeEventListener(eventName, handler)
    }, [eventName, reload])

    const setData = useCallback(
        (value: T | ((prev: T) => T)) => {
            setDataState((prev) => {
                const next = typeof value === 'function' ? (value as (prev: T) => T)(prev) : value
                localStorage.setItem(key, JSON.stringify(next))
                if (eventName) {
                    window.dispatchEvent(new CustomEvent(eventName))
                }
                return next
            })
        },
        [key, eventName]
    )

    return { data, setData, reload }
}
