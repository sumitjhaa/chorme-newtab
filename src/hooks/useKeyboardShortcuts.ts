/**
  * @fileoverview Hook for registering keyboard shortcuts.
  */

import { useEffect, useRef } from 'react'

/** Map of keyboard key names to handler functions */
interface ShortcutMap {
    [key: string]: () => void
}

/**
  * Registers keyboard shortcuts that work when no input element is focused.
  * 
  * @param shortcuts - map of key names to handlers (e.g., { Escape: fn, r: fn })
  * @param deps - dependencies array for the shortcuts
  */
export function useKeyboardShortcuts(shortcuts: ShortcutMap, deps: any[] = []): void {
    const shortcutsRef = useRef(shortcuts)
    shortcutsRef.current = shortcuts

    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement
            if (target.closest('input, textarea, select')) {
                return
            }

            const fn = shortcutsRef.current[e.key]
            if (fn) {
                e.preventDefault()
                fn()
            }
        }

        document.addEventListener('keydown', listener)
        return () => document.removeEventListener('keydown', listener)
    }, deps)
}
