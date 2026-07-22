/**
  * @fileoverview Hooks for applying settings as CSS variables to the document root.
  */

import { useEffect, useMemo } from 'react'
import { useSettings } from './useSettings'

/**
  * Applies font-related CSS variables to the document root.
  * Replaces the useEffect in App.tsx that sets font properties.
  */
export function useFontCSSVariables() {
    const { settings } = useSettings()
    
    return useEffect(() => {
        const root = document.documentElement
        root.style.setProperty('--font-family', `'${settings.fontFamily}', sans-serif`)
        root.style.setProperty('--font-weight', String(settings.fontWeight))
        root.style.setProperty('--font-color', settings.fontColor)
        root.style.setProperty('--font-size', `${Math.round(settings.fontSize)}%`)
        root.style.setProperty('--font-shadow', settings.fontShadow > 0 
            ? `0 0 ${settings.fontShadow}px rgba(0,0,0,0.8)` 
            : 'none')
    }, [settings.fontFamily, settings.fontWeight, settings.fontColor, settings.fontSize, settings.fontShadow])
}

/**
  * Applies background-related CSS variables to the document root.
  */
export function useBackgroundCSSVariables() {
    const { settings } = useSettings()
    
    return useEffect(() => {
        const root = document.documentElement
        root.style.setProperty('--bg-blur', `${settings.bgBlur}px`)
        root.style.setProperty('--bg-brightness', `${settings.bgBrightness}%`)
    }, [settings.bgBlur, settings.bgBrightness])
}
