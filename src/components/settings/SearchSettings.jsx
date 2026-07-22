import { useSettings } from '../../hooks/useSettings.js'
import { useTranslation } from '../../hooks/useTranslation.js'
import { SEARCH_ENGINES } from '../../constants.js'
import ToggleSwitch from '../ToggleSwitch.jsx'

export default function SearchSettings() {
  const { settings, update } = useSettings()
  const { t } = useTranslation()

  return (
    <div className="settings-group">
      <div className="settings-group-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>{t('searchBar')}</span>
        <ToggleSwitch
          checked={settings.enableSearchBar}
          onChange={() => update('enableSearchBar', !settings.enableSearchBar)}
        />
      </div>

      {settings.enableSearchBar && (
        <>
          <div className="setting-row">
            <span className="setting-label">{t('openInNewTab')}</span>
            <ToggleSwitch
              checked={settings.openInNewTab}
              onChange={() => update('openInNewTab', !settings.openInNewTab)}
            />
          </div>

          <div className="setting-row">
            <span className="setting-label">{t('suggestions')}</span>
            <ToggleSwitch
              checked={settings.showSuggestions}
              onChange={() => update('showSuggestions', !settings.showSuggestions)}
            />
          </div>

          <div className="setting-row">
            <span className="setting-label">{t('placeholder')}</span>
            <input
              type="text"
              className="setting-input"
              value={settings.searchPlaceholder}
              onChange={(e) => update('searchPlaceholder', e.target.value)}
              placeholder={t('defaultPlaceholder')}
            />
          </div>

          <div className="setting-row" style={{ alignItems: 'flex-start' }}>
            <span className="setting-label">{t('searchEngine')}</span>
            <div className="engine-icon-grid">
              {Object.keys(SEARCH_ENGINES).map((key) => (
                <button
                  key={key}
                  className={`engine-icon-btn ${settings.searchEngine === key ? 'active' : ''}`}
                  onClick={() => update('searchEngine', key)}
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
