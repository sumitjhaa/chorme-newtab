/**
 * @fileoverview General settings panel for language, dark mode, and tab title.
 */

import { useCallback, memo } from 'react'
import { useSettings } from '../../hooks/useSettings'
import { useTranslation } from '../../hooks/useTranslation'
import { SettingRow } from '../ui/SettingRow'
import { SettingSelect } from '../ui/SettingSelect'
import { SettingInput } from '../ui/SettingInput'
import { SegmentedControl } from '../ui/SegmentedControl'
import { ToggleSwitch } from '../ui/ToggleSwitch'

/** Available language options */
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
  { code: 'ru', label: 'Русский' },
  { code: 'it', label: 'Italiano' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'pl', label: 'Polski' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'th', label: 'ไทย' },
  { code: 'id', label: 'Bahasa Indonesia' },
  { code: 'uk', label: 'Українська' },
  { code: 'sv', label: 'Svenska' },
]

/**
 * General settings panel with language, dark mode, and tab title controls.
 * 
 * @example <GeneralSettings />
 */
function GeneralSettings() {
  const { settings, update } = useSettings()
  const { t, lang, getLanguageName } = useTranslation()

  const handleToggleHideSettingsIcons = useCallback(() => {
    update('hideSettingsIcons', !settings.hideSettingsIcons)
  }, [settings.hideSettingsIcons, update])

  const handleLanguageChange = useCallback((val: string) => {
    update('language', val)
  }, [update])

  const handleDarkModeChange = useCallback((val: string) => {
    update('darkMode', val)
  }, [update])

  const handleTabTitleChange = useCallback((val: string) => {
    update('tabTitle', val)
  }, [update])

  return (
    <div className="settings-group">
      <div className="settings-group-title">{t('general')}</div>

      <SettingRow label={t('hideSettingsIcons')}>
        <ToggleSwitch
          checked={settings.hideSettingsIcons}
          onChange={handleToggleHideSettingsIcons}
        />
      </SettingRow>

      <SettingRow label={`${t('language')}${lang !== 'en' ? ` (${getLanguageName(lang)})` : ''}`}>
        <SettingSelect
          value={settings.language}
          onChange={handleLanguageChange}
          options={LANGUAGES.map((l) => ({ value: l.code, label: l.label }))}
        />
      </SettingRow>

      <SettingRow label={t('darkMode')}>
        <SegmentedControl
          options={['light', 'dark', 'system'].map((mode) => ({ value: mode, label: t(mode) }))}
          value={settings.darkMode}
          onChange={handleDarkModeChange}
        />
      </SettingRow>

      <SettingRow label={t('tabTitle')}>
        <SettingInput
          type="text"
          value={settings.tabTitle}
          onChange={handleTabTitleChange}
          placeholder={t('newTab')}
        />
      </SettingRow>
    </div>
  )
}

export default memo(GeneralSettings)
