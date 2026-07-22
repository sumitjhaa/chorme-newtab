/**
  * @fileoverview Hook for periodic wallpaper refresh intervals.
  */

import { useEffect, useRef } from 'react'
import { DEFAULT_REFRESH_INTERVAL } from '../constants'

/**
  * Sets up a periodic wallpaper refresh interval.
  * Cleans up automatically on unmount.
  * 
  * @param onRefresh - callback to invoke on each interval tick
  * @param intervalMs - refresh interval in ms (default from constants)
  */
export function useWallpaperRefresh(
    onRefresh: () => void,
    intervalMs?: number
): void {
    const callbackRef = useRef(onRefresh)
    callbackRef.current = onRefresh
    
    useEffect(() => {
        const id = setInterval(() => callbackRef.current(), intervalMs ?? DEFAULT_REFRESH_INTERVAL)
        return () => clearInterval(id)
    }, [intervalMs])
}
