import { useSettings } from '../../hooks/useSettings.js'
import { useTranslation } from '../../hooks/useTranslation.js'
import ToggleSwitch from '../ToggleSwitch.jsx'

export default function ClockSettings() {
  const { settings, update } = useSettings()
  const { t } = useTranslation()

  return (
    <div className="settings-group">
      <div className="settings-group-title">{t('date')}</div>
      <div className="setting-row">
        <span className="setting-label">{t('showClock')}</span>
        <ToggleSwitch
          checked={settings.showClockWidget}
          onChange={() => update('showClockWidget', !settings.showClockWidget)}
        />
      </div>
      {settings.showClockWidget && (<>
        <div className="setting-row">
          <span className="setting-label">{t('twelveHrFormat')}</span>
          <ToggleSwitch
            checked={settings.clockFormat === '12h'}
            onChange={() => update('clockFormat', settings.clockFormat === '12h' ? '24h' : '12h')}
          />
        </div>
        <div className="setting-row">
          <span className="setting-label">{t('showAmPm')}</span>
          <ToggleSwitch
            checked={settings.showAmPm}
            onChange={() => update('showAmPm', !settings.showAmPm)}
          />
        </div>
        <div className="setting-row">
          <span className="setting-label">{t('showSeconds')}</span>
          <ToggleSwitch
            checked={settings.showSeconds}
            onChange={() => update('showSeconds', !settings.showSeconds)}
          />
        </div>
        <div className="setting-row">
          <span className="setting-label">{t('analogClock')}</span>
          <ToggleSwitch
            checked={settings.analogClock}
            onChange={() => update('analogClock', !settings.analogClock)}
          />
        </div>
        <div className="setting-row">
          <span className="setting-label">{t('worldClocks')}</span>
          <ToggleSwitch
            checked={(settings.worldClockTimezones || []).length > 0}
            onChange={() => {
              if ((settings.worldClockTimezones || []).length > 0) {
                update('worldClockTimezones', [])
              } else {
                update('worldClockTimezones', ['America/New_York', 'Europe/London', 'Asia/Tokyo'])
              }
            }}
          />
        </div>
        {(settings.worldClockTimezones || []).length > 0 && (
          <>
            {(settings.worldClockTimezones || []).map((tz, i) => (
              <div key={tz} className="setting-row">
                <select
                  className="setting-select"
                  value={tz}
                  onChange={(e) => {
                    const list = [...settings.worldClockTimezones]
                    list[i] = e.target.value
                    update('worldClockTimezones', list)
                  }}
                >
                  {Intl.supportedValuesOf('timeZone').map((tzOption) => {
                    const parts = tzOption.split('/')
                    const label = parts.length > 1 ? parts[parts.length - 1].replace(/_/g, ' ') : tzOption
                    return <option key={tzOption} value={tzOption}>{label}</option>
                  })}
                </select>
                <button
                  className="wc-remove-btn"
                  onClick={() => {
                    const list = [...settings.worldClockTimezones]
                    list.splice(i, 1)
                    update('worldClockTimezones', list)
                  }}
                >✕</button>
              </div>
            ))}
            <div className="setting-row">
              <button
                className="wc-add-btn"
                onClick={() => {
                  const list = [...(settings.worldClockTimezones || [])]
                  if (!list.includes('America/New_York')) list.push('America/New_York')
                  else if (!list.includes('Europe/London')) list.push('Europe/London')
                  else if (!list.includes('Asia/Tokyo')) list.push('Asia/Tokyo')
                  else list.push(Intl.supportedValuesOf('timeZone')[0])
                  update('worldClockTimezones', list)
                }}
              >{t('addWorldClock')}</button>
            </div>
          </>
        )}
        <div className="setting-row">
          <span className="setting-label">{t('clockSize')}</span>
          <div className="range-control">
            <input
              type="range"
              min="50"
              max="200"
              step="5"
              value={settings.clockSize}
              onChange={(e) => update('clockSize', Number(e.target.value))}
              className="slider"
            />
            <span className="range-value">{settings.clockSize}%</span>
          </div>
        </div>
        <div className="setting-row">
          <span className="setting-label">{t('timeZone')}</span>
          <select
            className="setting-select"
            value={settings.timeZone}
            onChange={(e) => update('timeZone', e.target.value)}
          >
            <option value="local">{t('local')}</option>
            {Intl.supportedValuesOf('timeZone').map((tz) => {
              const parts = tz.split('/')
              const label = parts.length > 1 ? parts[parts.length - 1].replace(/_/g, ' ') : tz
              return <option key={tz} value={tz}>{label}</option>
            })}
          </select>
        </div>
        <div className="setting-row">
          <span className="setting-label">{t('dateFormat')}</span>
          <select
            className="setting-select"
            value={settings.dateFormat}
            onChange={(e) => update('dateFormat', e.target.value)}
          >
            <option value="DD/MM/YYYY">{t('dayMonthYear')}</option>
            <option value="MM/DD/YYYY">{t('monthDayYear')}</option>
            <option value="YYYY-MM-DD">{t('yearMonthDay')}</option>
          </select>
        </div>
        <div className="setting-row">
          <span className="setting-label">{t('show')}</span>
          <select
            className="setting-select"
            value={settings.showClockDate}
            onChange={(e) => update('showClockDate', e.target.value)}
          >
            <option value="both">{t('clockAndDate')}</option>
            <option value="clock">{t('clockOnly')}</option>
            <option value="date">{t('dateOnly')}</option>
          </select>
        </div>
      </>)}
    </div>
  )
}
