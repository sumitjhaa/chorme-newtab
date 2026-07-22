import en from './en.js'
import es from './es.js'
import fr from './fr.js'
import de from './de.js'
import pt from './pt.js'
import ja from './ja.js'
import ko from './ko.js'
import zh from './zh.js'
import hi from './hi.js'
import ar from './ar.js'

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
