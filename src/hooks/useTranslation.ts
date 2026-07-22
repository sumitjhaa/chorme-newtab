// @ts-nocheck
import { useCallback } from 'react'
import { t as translate, getLanguageName } from '../translations/index'
import { useSettings } from './useSettings'

interface UseTranslationReturn {
  t: (key: string) => string
  lang: string
  getLanguageName: (code: string) => string
}

export function useTranslation(): UseTranslationReturn {
  const { settings } = useSettings()
  const lang = settings.language || 'en'
  const t = useCallback((key: string) => translate(key, lang), [lang])
  return { t, lang, getLanguageName }
}
