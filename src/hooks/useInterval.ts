/**
 * @fileoverview Hook for setting up intervals with automatic cleanup.
 */

import { useEffect, useRef } from 'react'

/**
 * Sets up an interval that automatically cleans up on unmount.
 * The callback is always called with the latest reference.
 * 
 * @param callback - function to call on each interval
 * @param delay - interval in ms, or null to pause
 */
export function useInterval(callback: () => void, delay: number | null): void {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    if (delay === null) return

    const id = setInterval(() => {
      callbackRef.current()
    }, delay)

    return () => clearInterval(id)
  }, [delay])
}
