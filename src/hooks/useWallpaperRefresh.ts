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
  * @param intervalMs - refresh interval in ms, null to disable auto-refresh
  */
export function useWallpaperRefresh(
    onRefresh: () => void,
    intervalMs: number | null = DEFAULT_REFRESH_INTERVAL
): void {
    const callbackRef = useRef(onRefresh)
    callbackRef.current = onRefresh
    
    useEffect(() => {
        if (intervalMs === null) return
        const id = setInterval(() => callbackRef.current(), intervalMs)
        return () => clearInterval(id)
    }, [intervalMs])
}
