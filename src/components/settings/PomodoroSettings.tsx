/**
 * @fileoverview Pomodoro timer settings panel.
 */

import { useCallback, memo } from 'react'
import { useSettings } from '../../hooks/useSettings'
import { useTranslation } from '../../hooks/useTranslation'
import { SettingRow } from '../ui/SettingRow'
import { ToggleSwitch } from '../ui/ToggleSwitch'

/**
 * Pomodoro timer settings with work/break duration controls.
 */
function PomodoroSettings() {
    const { settings, update } = useSettings()
    const { t } = useTranslation()

    const toggleShowPomodoroWidget = useCallback(() => {
        update('showPomodoroWidget', !settings.showPomodoroWidget)
    }, [settings.showPomodoroWidget, update])

    const handleWorkChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        update('pomodoroWork', Number(e.target.value))
    }, [update])

    const handleShortBreakChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        update('pomodoroShort', Number(e.target.value))
    }, [update])

    const handleLongBreakChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        update('pomodoroLong', Number(e.target.value))
    }, [update])

    const handleCyclesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        update('pomodoroCycles', Number(e.target.value))
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
                    <div className="range-control">
                        <input
                            type="range"
                            min="1"
                            max="120"
                            value={settings.pomodoroWork ?? 25}
                            onChange={handleWorkChange}
                            className="slider"
                        />
                        <span className="range-value">{settings.pomodoroWork ?? 25}m</span>
                    </div>
                </SettingRow>
                <SettingRow label={t('shortBreakMin')}>
                    <div className="range-control">
                        <input
                            type="range"
                            min="1"
                            max="30"
                            value={settings.pomodoroShort ?? 5}
                            onChange={handleShortBreakChange}
                            className="slider"
                        />
                        <span className="range-value">{settings.pomodoroShort ?? 5}m</span>
                    </div>
                </SettingRow>
                <SettingRow label={t('longBreakMin')}>
                    <div className="range-control">
                        <input
                            type="range"
                            min="1"
                            max="60"
                            value={settings.pomodoroLong ?? 15}
                            onChange={handleLongBreakChange}
                            className="slider"
                        />
                        <span className="range-value">{settings.pomodoroLong ?? 15}m</span>
                    </div>
                </SettingRow>
                <SettingRow label={t('longBreakAfter')}>
                    <div className="range-control">
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={settings.pomodoroCycles ?? 4}
                            onChange={handleCyclesChange}
                            className="slider"
                        />
                        <span className="range-value">{settings.pomodoroCycles ?? 4}</span>
                    </div>
                </SettingRow>
            </>)}
        </div>
    )
}

export default memo(PomodoroSettings)
