/**
  * @fileoverview Dark mode utilities for applying and resolving theme preferences.
  */

import type { DarkMode } from '../types'

/** Apply dark/light/system mode to the document element */
export function applyDarkMode(mode: DarkMode): void {
    if (mode === 'light') {
        document.documentElement.classList.remove('dark')
        document.documentElement.classList.add('light')
    } else if (mode === 'dark') {
        document.documentElement.classList.remove('light')
        document.documentElement.classList.add('dark')
    } else {
        document.documentElement.classList.remove('light', 'dark')
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        document.documentElement.classList.add(prefersDark ? 'dark' : 'light')
    }
}

/** Get the effective dark mode (resolves 'system' to actual preference) */
export function getEffectiveDarkMode(mode: DarkMode): 'light' | 'dark' {
    if (mode === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return mode
}
