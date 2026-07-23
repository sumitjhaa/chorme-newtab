import { useEffect } from 'react'
import { useSettings } from './useSettings'

export function useBackgroundCSSVariables() {
    const { settings } = useSettings()
    
    useEffect(() => {
        const root = document.documentElement
        root.style.setProperty('--bg-blur', `${settings.bgBlur}px`)
        root.style.setProperty('--bg-brightness', `${settings.bgBrightness}%`)
    }, [settings.bgBlur, settings.bgBrightness])
}
