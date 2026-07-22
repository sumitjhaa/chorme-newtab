/**
  * @fileoverview Hook for reactive CSS media query matching.
  */

import { useState, useEffect } from 'react'

/**
  * Reactive media query hook. Returns true when the query matches.
  * 
  * @param query - CSS media query string (e.g., '(prefers-color-scheme: dark)')
  */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(() => {
        if (typeof window === 'undefined') return false
        return window.matchMedia(query).matches
    })

    useEffect(() => {
        const mql = window.matchMedia(query)
        const handler = (e: MediaQueryListEvent) => setMatches(e.matches)

        setMatches(mql.matches)
        mql.addEventListener('change', handler)
        return () => mql.removeEventListener('change', handler)
    }, [query])

    return matches
}
