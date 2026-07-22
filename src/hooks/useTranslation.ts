// @ts-nocheck
import { useCallback } from 'react'
import { t as translate, getLanguageName } from '../translations/index'
import { useSettings } from './useSettings'

export function useTranslation() {
  const { settings } = useSettings()
  const lang = settings.language || 'en'
  const t = useCallback((key) => translate(key, lang), [lang])
  return { t, lang, getLanguageName }
}
