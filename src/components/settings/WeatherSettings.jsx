import { useSettings } from '../../hooks/useSettings.js'
import { useTranslation } from '../../hooks/useTranslation.js'
import ToggleSwitch from '../ToggleSwitch.jsx'

export default function WeatherSettings() {
  const { settings, update } = useSettings()
  const { t } = useTranslation()

  return (
    <div className="settings-group">
      <div className="settings-group-title">{t('weather')}</div>
      <div className="setting-row">
        <span className="setting-label">{t('showWeather')}</span>
        <ToggleSwitch
          checked={settings.showWeatherWidget}
          onChange={() => update('showWeatherWidget', !settings.showWeatherWidget)}
        />
      </div>

      {settings.showWeatherWidget && (
        <>
          <div className="setting-row">
            <span className="setting-label">{t('geolocation')}</span>
            <select
              className="setting-select"
              value={settings.geolocation}
              onChange={(e) => update('geolocation', e.target.value)}
            >
              <option value="approximate">{t('approximate')}</option>
              <option value="manual">{t('manual')}</option>
              <option value="precise">{t('precise')}</option>
            </select>
          </div>

          {settings.geolocation === 'manual' && (
            <div className="setting-row">
              <span className="setting-label">{t('location')}</span>
              <input
                type="text"
                className="setting-input"
                value={settings.manualLocation}
                onChange={(e) => update('manualLocation', e.target.value)}
                placeholder={t('cityOrCoords')}
              />
            </div>
          )}

          <div className="setting-row">
            <span className="setting-label">{t('tempUnit')}</span>
            <select
              className="setting-select"
              value={settings.tempUnit}
              onChange={(e) => update('tempUnit', e.target.value)}
            >
              <option value="celsius">{t('celsius')}</option>
              <option value="fahrenheit">{t('fahrenheit')}</option>
            </select>
          </div>

          <div className="setting-row">
            <span className="setting-label">{t('forecast')}</span>
            <select
              className="setting-select"
              value={settings.forecast}
              onChange={(e) => update('forecast', e.target.value)}
            >
              <option value="automatic">{t('automatic')}</option>
              <option value="always">{t('always')}</option>
              <option value="never">{t('never')}</option>
            </select>
          </div>

          <div className="setting-row">
            <span className="setting-label">{t('temperature')}</span>
            <select
              className="setting-select"
              value={settings.tempDisplay}
              onChange={(e) => update('tempDisplay', e.target.value)}
            >
              <option value="actual">{t('actual')}</option>
              <option value="feels_like">{t('feelsLike')}</option>
              <option value="both">{t('both')}</option>
            </select>
          </div>

          <div className="setting-row">
            <span className="setting-label">{t('show')}</span>
            <select
              className="setting-select"
              value={settings.weatherShow}
              onChange={(e) => update('weatherShow', e.target.value)}
            >
              <option value="description_icon">{t('descAndIcon')}</option>
              <option value="description">{t('description')}</option>
              <option value="icon">{t('icon')}</option>
              <option value="nothing">{t('nothing')}</option>
            </select>
          </div>
        </>
      )}
    </div>
  )
}
