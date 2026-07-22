/**
  * @fileoverview Hook for internationalization and translations.
  */

import { useCallback } from 'react'
import { t as translate, getLanguageName } from '../translations/index'
import { useSettings } from './useSettings'

/** Return type for useTranslation hook */
interface UseTranslationReturn {
    /** Translation function */
    t: (key: string) => string
    /** Current language code */
    lang: string
    /** Get display name for a language code */
    getLanguageName: (code: string) => string
}

/**
  * Hook to access translation functionality.
  * Uses the current language from settings.
  * 
  * @returns Translation function, current language, and language name getter
  */
export function useTranslation(): UseTranslationReturn {
    const { settings } = useSettings()
    const lang = settings.language || 'en'
    const t = useCallback((key: string) => translate(key, lang), [lang])
    return { t, lang, getLanguageName }
}
