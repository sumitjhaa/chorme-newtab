// @ts-nocheck
import { useSettings } from '../../hooks/useSettings'
import { useTranslation } from '../../hooks/useTranslation'
import ToggleSwitch from '../ToggleSwitch'

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'pt', label: 'Português' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'zh', label: '中文' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'ar', label: 'العربية' },
]

export default function GeneralSettings() {
  const { settings, update } = useSettings()
  const { t, lang, getLanguageName } = useTranslation()

  return (
    <div className="settings-group">
      <div className="settings-group-title">{t('general')}</div>

      <div className="setting-row">
        <span className="setting-label">{t('hideSettingsIcons')}</span>
        <ToggleSwitch
          checked={settings.hideSettingsIcons}
          onChange={() => update('hideSettingsIcons', !settings.hideSettingsIcons)}
        />
      </div>

      <div className="setting-row">
        <span className="setting-label">{t('language')} {lang !== 'en' && `(${getLanguageName(lang)})`}</span>
        <select
          className="setting-select"
          value={settings.language}
          onChange={(e) => update('language', e.target.value)}
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>{l.label}</option>
          ))}
        </select>
      </div>

      <div className="setting-row">
        <span className="setting-label">{t('darkMode')}</span>
        <div className="segmented-control">
          {['light', 'dark', 'system'].map((mode) => (
            <button
              key={mode}
              className={`segmented-option ${settings.darkMode === mode ? 'active' : ''}`}
              onClick={() => update('darkMode', mode)}
            >
              {t(mode)}
            </button>
          ))}
        </div>
      </div>

      <div className="setting-row">
        <span className="setting-label">{t('tabTitle')}</span>
        <input
          type="text"
          className="setting-input"
          value={settings.tabTitle}
          onChange={(e) => update('tabTitle', e.target.value)}
          placeholder={t('newTab')}
        />
      </div>
    </div>
  )
}
