/**
 * @fileoverview Search bar settings panel.
 */

import { useCallback, memo } from 'react'
import { useSettings } from '../../hooks/useSettings'
import { useTranslation } from '../../hooks/useTranslation'
import { SEARCH_ENGINES } from '../../constants'
import { SettingRow } from '../ui/SettingRow'
import { SettingInput } from '../ui/SettingInput'
import { ToggleSwitch } from '../ui/ToggleSwitch'
import type { SearchEngineKey } from '../../types'

/**
 * Search bar settings with engine selection and suggestion toggles.
 * 
 * @example <SearchSettings />
 */
function SearchSettings() {
  const { settings, update } = useSettings()
  const { t } = useTranslation()

  const toggleEnableSearchBar = useCallback(() => {
    update('enableSearchBar', !settings.enableSearchBar)
  }, [settings.enableSearchBar, update])

  const toggleOpenInNewTab = useCallback(() => {
    update('openInNewTab', !settings.openInNewTab)
  }, [settings.openInNewTab, update])

  const toggleShowSuggestions = useCallback(() => {
    update('showSuggestions', !settings.showSuggestions)
  }, [settings.showSuggestions, update])

  const handleSearchPlaceholderChange = useCallback((val: string) => {
    update('searchPlaceholder', val)
  }, [update])

  const handleSearchEngineChange = useCallback((key: SearchEngineKey) => {
    update('searchEngine', key)
  }, [update])

  return (
    <div className="settings-group">
      <div className="settings-group-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>{t('searchBar')}</span>
        <ToggleSwitch
          checked={settings.enableSearchBar}
          onChange={toggleEnableSearchBar}
        />
      </div>

      {settings.enableSearchBar && (
        <>
          <SettingRow label={t('openInNewTab')}>
            <ToggleSwitch
              checked={settings.openInNewTab}
              onChange={toggleOpenInNewTab}
            />
          </SettingRow>

          <SettingRow label={t('suggestions')}>
            <ToggleSwitch
              checked={settings.showSuggestions}
              onChange={toggleShowSuggestions}
            />
          </SettingRow>

          <SettingRow label={t('placeholder')}>
            <SettingInput
              type="text"
              value={settings.searchPlaceholder}
              onChange={handleSearchPlaceholderChange}
              placeholder={t('defaultPlaceholder')}
            />
          </SettingRow>

          <div className="setting-row" style={{ alignItems: 'flex-start' }}>
            <span className="setting-label">{t('searchEngine')}</span>
            <div className="engine-icon-grid">
              {(Object.keys(SEARCH_ENGINES) as SearchEngineKey[]).map((key) => (
                <button
                  key={key}
                  className={`engine-icon-btn ${settings.searchEngine === key ? 'active' : ''}`}
                  onClick={() => handleSearchEngineChange(key)}
                  title={SEARCH_ENGINES[key].name}
                >
                  <img
                    src={`icons/engines/${key.toLowerCase()}.png`}
                    alt={SEARCH_ENGINES[key].name}
                  />
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default memo(SearchSettings)
