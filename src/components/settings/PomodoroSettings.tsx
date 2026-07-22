/**
 * @fileoverview Pomodoro timer settings panel.
 */

import { useCallback, memo } from 'react'
import { useSettings } from '../../hooks/useSettings'
import { useTranslation } from '../../hooks/useTranslation'
import { SettingRow } from '../ui/SettingRow'
import { SettingInput } from '../ui/SettingInput'
import { ToggleSwitch } from '../ui/ToggleSwitch'

/**
 * Pomodoro timer settings with work/break duration controls.
 * 
 * @example <PomodoroSettings />
 */
function PomodoroSettings() {
  const { settings, update } = useSettings()
  const { t } = useTranslation()

  const toggleShowPomodoroWidget = useCallback(() => {
    update('showPomodoroWidget', !settings.showPomodoroWidget)
  }, [settings.showPomodoroWidget, update])

  const handleWorkChange = useCallback((val: string) => {
    update('pomodoroWork', Number(val))
  }, [update])

  const handleShortBreakChange = useCallback((val: string) => {
    update('pomodoroShort', Number(val))
  }, [update])

  const handleLongBreakChange = useCallback((val: string) => {
    update('pomodoroLong', Number(val))
  }, [update])

  const handleCyclesChange = useCallback((val: string) => {
    update('pomodoroCycles', Number(val))
  }, [update])

  return (
    <div className="settings-group">
      <div className="settings-group-title">{t('pomodoro')}</div>
      <SettingRow label={t('showPomodoro')}>
        <ToggleSwitch
          checked={settings.showPomodoroWidget}
          onChange={toggleShowPomodoroWidget}
        />
      </SettingRow>
      {settings.showPomodoroWidget && (<>
        <SettingRow label={t('workMin')}>
          <SettingInput
            type="number"
            min={1}
            max={120}
            value={String(settings.pomodoroWork ?? 25)}
            onChange={handleWorkChange}
          />
        </SettingRow>
        <SettingRow label={t('shortBreakMin')}>
          <SettingInput
            type="number"
            min={1}
            max={30}
            value={String(settings.pomodoroShort ?? 5)}
            onChange={handleShortBreakChange}
          />
        </SettingRow>
        <SettingRow label={t('longBreakMin')}>
          <SettingInput
            type="number"
            min={1}
            max={60}
            value={String(settings.pomodoroLong ?? 15)}
            onChange={handleLongBreakChange}
          />
        </SettingRow>
        <SettingRow label={t('longBreakAfter')}>
          <SettingInput
            type="number"
            min={1}
            max={10}
            value={String(settings.pomodoroCycles ?? 4)}
            onChange={handleCyclesChange}
          />
        </SettingRow>
      </>)}
    </div>
  )
}

export default memo(PomodoroSettings)
