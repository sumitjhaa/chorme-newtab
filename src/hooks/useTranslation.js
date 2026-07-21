import { useState, useEffect, useCallback } from 'react'
import { t as translate, getLanguageName } from '../translations.js'

function getLang() {
  try {
    const data = JSON.parse(localStorage.getItem('newtab_settings') || '{}')
    return data.language || 'en'
  } catch { return 'en' }
}

export function useTranslation() {
  const [lang, setLang] = useState(getLang)

  useEffect(() => {
    const handler = () => setLang(getLang())
    window.addEventListener('storage', handler)
    const id = setInterval(handler, 500)
    return () => { window.removeEventListener('storage', handler); clearInterval(id) }
  }, [])

  const t = useCallback((key) => translate(key, lang), [lang])

  return { t, lang, getLanguageName }
}
