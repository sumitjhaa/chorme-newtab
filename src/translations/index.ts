// @ts-nocheck
import en from './en'
import es from './es'
import fr from './fr'
import de from './de'
import pt from './pt'
import ja from './ja'
import ko from './ko'
import zh from './zh'
import hi from './hi'
import ar from './ar'

const translations = { en, es, fr, de, pt, ja, ko, zh, hi, ar }

export function t(key, lang = 'en') {
  return translations[lang]?.[key] || translations.en[key] || key
}

export function getLanguageName(code) {
  const names = {
    en: 'English', es: 'Español', fr: 'Français', de: 'Deutsch',
    pt: 'Português', ja: '日本語', ko: '한국어', zh: '中文',
    hi: 'हिन्दी', ar: 'العربية',
  }
  return names[code] || code
}

export default translations
