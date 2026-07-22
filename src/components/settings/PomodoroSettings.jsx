import { useSettings } from '../../hooks/useSettings.js'
import { useTranslation } from '../../hooks/useTranslation.js'
import ToggleSwitch from '../ToggleSwitch.jsx'

export default function PomodoroSettings() {
  const { settings, update } = useSettings()
  const { t } = useTranslation()

  return (
    <div className="settings-group">
      <div className="settings-group-title">{t('pomodoro')}</div>
      <div className="setting-row">
        <span className="setting-label">{t('showPomodoro')}</span>
        <ToggleSwitch
          checked={settings.showPomodoroWidget}
          onChange={() => update('showPomodoroWidget', !settings.showPomodoroWidget)}
        />
      </div>
      {settings.showPomodoroWidget && (<>
        <div className="setting-row">
          <span className="setting-label">{t('workMin')}</span>
          <input
            type="number"
            className="setting-input"
            min="1"
            max="120"
            value={settings.pomodoroWork ?? 25}
            onChange={(e) => update('pomodoroWork', Number(e.target.value))}
          />
        </div>
        <div className="setting-row">
          <span className="setting-label">{t('shortBreakMin')}</span>
          <input
            type="number"
            className="setting-input"
            min="1"
            max="30"
            value={settings.pomodoroShort ?? 5}
            onChange={(e) => update('pomodoroShort', Number(e.target.value))}
          />
        </div>
        <div className="setting-row">
          <span className="setting-label">{t('longBreakMin')}</span>
          <input
            type="number"
            className="setting-input"
            min="1"
            max="60"
            value={settings.pomodoroLong ?? 15}
            onChange={(e) => update('pomodoroLong', Number(e.target.value))}
          />
        </div>
        <div className="setting-row">
          <span className="setting-label">{t('longBreakAfter')}</span>
          <input
            type="number"
            className="setting-input"
            min="1"
            max="10"
            value={settings.pomodoroCycles ?? 4}
            onChange={(e) => update('pomodoroCycles', Number(e.target.value))}
          />
        </div>
      </>)}
    </div>
  )
}
