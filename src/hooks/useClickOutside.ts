/**
 * @fileoverview Hook for detecting clicks outside a referenced element.
 */

import { RefObject, useEffect } from 'react'

/**
 * Calls handler when a click occurs outside the referenced element.
 * 
 * @param ref - ref to the element to check
 * @param handler - callback when click is outside
 * @param enabled - whether to listen (default true)
 */
export function useClickOutside(
  ref: RefObject<HTMLElement>,
  handler: () => void,
  enabled = true
): void {
  useEffect(() => {
    if (!enabled) return

    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null
      if (!ref.current || (target && ref.current.contains(target))) {
        return
      }
      handler()
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler, enabled])
}
