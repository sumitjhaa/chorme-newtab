/**
  * @fileoverview Hook for creating debounced callback functions.
  */

import { useRef, useCallback, useEffect } from 'react'

/**
  * Returns a debounced version of the provided callback.
  * The callback is only called after `delay` ms of inactivity.
  * Cancels pending call on unmount.
  * 
  * @param callback - function to debounce
  * @param delay - debounce delay in ms
  */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
    callback: T,
    delay: number
): T & { cancel: () => void; flush: () => void } {
    const callbackRef = useRef(callback)
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const lastArgsRef = useRef<Parameters<T> | null>(null)

    callbackRef.current = callback

    const cancel = useCallback(() => {
        if (timeoutRef.current !== null) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }
    }, [])

    const flush = useCallback(() => {
        if (timeoutRef.current !== null) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
            if (lastArgsRef.current) {
                callbackRef.current(...lastArgsRef.current)
                lastArgsRef.current = null
            }
        }
    }, [])

    useEffect(() => {
        return () => cancel()
    }, [cancel])

    const debouncedFn = useCallback(
        (...args: Parameters<T>) => {
            lastArgsRef.current = args
            cancel()
            timeoutRef.current = setTimeout(() => {
                timeoutRef.current = null
                lastArgsRef.current = null
                callbackRef.current(...args)
            }, delay)
        },
        [delay, cancel]
    ) as T & { cancel: () => void; flush: () => void }

    debouncedFn.cancel = cancel
    debouncedFn.flush = flush

    return debouncedFn
}
