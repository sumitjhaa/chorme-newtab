import { useSettings } from '../../hooks/useSettings.js'
import { useTranslation } from '../../hooks/useTranslation.js'
import ToggleSwitch from '../ToggleSwitch.jsx'

export default function GreetingSettings() {
  const { settings, update } = useSettings()
  const { t } = useTranslation()

  return (
    <div className="settings-group">
      <div className="settings-group-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>{t('greeting')}</span>
        <ToggleSwitch
          checked={settings.enableGreeting}
          onChange={() => update('enableGreeting', !settings.enableGreeting)}
        />
      </div>

      {settings.enableGreeting && (
        <div className="setting-row">
          <span className="setting-label">{t('greetingName')}</span>
          <input
            type="text"
            className="setting-input"
            value={settings.greetingName}
            onChange={(e) => update('greetingName', e.target.value)}
            placeholder={t('yourName')}
          />
        </div>
      )}
    </div>
  )
}
