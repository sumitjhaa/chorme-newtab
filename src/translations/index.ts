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
import ru from './ru'
import it from './it'
import nl from './nl'
import pl from './pl'
import tr from './tr'
import vi from './vi'
import th from './th'
import id from './id'
import uk from './uk'
import sv from './sv'

const translations = {
  en, es, fr, de, pt, ja, ko, zh, hi, ar,
  ru, it, nl, pl, tr, vi, th, id, uk, sv,
}

export function t(key: string, lang = 'en'): string {
  return translations[lang]?.[key] || translations.en[key] || key
}

export function getLanguageName(code: string): string {
  const names: Record<string, string> = {
    en: 'English', es: 'Español', fr: 'Français', de: 'Deutsch',
    pt: 'Português', ja: '日本語', ko: '한국어', zh: '中文',
    hi: 'हिन्दी', ar: 'العربية', ru: 'Русский', it: 'Italiano',
    nl: 'Nederlands', pl: 'Polski', tr: 'Türkçe', vi: 'Tiếng Việt',
    th: 'ไทย', id: 'Bahasa Indonesia', uk: 'Українська', sv: 'Svenska',
  }
  return names[code] || code
}

export default translations
