/**
 * @fileoverview Hooks for debounced and throttled settings updates.
 */

import { useCallback, useRef, useEffect } from 'react'
import { useSettings } from './useSettings'
import { debounce, throttle } from '../lib/debounce'

/**
 * Returns a debounced update function that batches rapid setting changes.
 * Prevents excessive localStorage/chrome.storage writes from rapid slider movement.
 * 
 * @param delay - debounce delay in ms (default 150)
 */
export function useDebouncedUpdate(delay?: number) {
  const { update } = useSettings()
  const updateRef = useRef(update)
  
  useEffect(() => { updateRef.current = update }, [update])
  
  const debouncedUpdate = useCallback(
    debounce((key: string, value: any) => {
      updateRef.current(key as any, value)
    }, delay ?? 150),
    []
  )
  
  // Flush pending updates on unmount
  useEffect(() => () => debouncedUpdate.flush(), [debouncedUpdate])
  
  return debouncedUpdate
}

/**
 * Returns a throttled update function for things that shouldn't fire more than once per limit.
 * Good for refresh buttons.
 * 
 * @param limit - throttle limit in ms (default 1000)
 */
export function useThrottledUpdate(limit?: number) {
  const { update } = useSettings()
  const updateRef = useRef(update)
  
  useEffect(() => { updateRef.current = update }, [update])
  
  return useCallback(
    throttle((key: string, value: any) => {
      updateRef.current(key as any, value)
    }, limit ?? 1000),
    []
  )
}
