/**
 * @fileoverview Pomodoro timer settings panel.
 */

import { useCallback, memo } from 'react'
import { useSettings } from '../../hooks/useSettings'
import { useTranslation } from '../../hooks/useTranslation'
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
        update('pomodoroWork', Math.min(120, Math.max(1, Number(e.target.value) || 1)))
    }, [update])

    const handleShortBreakChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        update('pomodoroShort', Math.min(30, Math.max(1, Number(e.target.value) || 1)))
    }, [update])

    const handleLongBreakChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        update('pomodoroLong', Math.min(60, Math.max(1, Number(e.target.value) || 1)))
    }, [update])

    const handleCyclesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        update('pomodoroCycles', Math.min(10, Math.max(1, Number(e.target.value) || 1)))
    }, [update])

    return (
        <div className="settings-group">
            <div className="settings-group-title settings-group-title-row">
                <span>{t('pomodoro')}</span>
                <ToggleSwitch
                    checked={settings.showPomodoroWidget}
                    onChange={toggleShowPomodoroWidget}
                />
            </div>
            {settings.showPomodoroWidget && (
                <div className="pomodoro-grid">
                    <div className="pomodoro-field">
                        <label className="setting-label">{t('workMin')}</label>
                        <input
                            type="number"
                            min={1}
                            max={120}
                            step={1}
                            value={settings.pomodoroWork ?? 25}
                            onChange={handleWorkChange}
                            className="setting-input"
                        />
                    </div>
                    <div className="pomodoro-field">
                        <label className="setting-label">{t('shortBreakMin')}</label>
                        <input
                            type="number"
                            min={1}
                            max={30}
                            step={1}
                            value={settings.pomodoroShort ?? 5}
                            onChange={handleShortBreakChange}
                            className="setting-input"
                        />
                    </div>
                    <div className="pomodoro-field">
                        <label className="setting-label">{t('longBreakMin')}</label>
                        <input
                            type="number"
                            min={1}
                            max={60}
                            step={1}
                            value={settings.pomodoroLong ?? 15}
                            onChange={handleLongBreakChange}
                            className="setting-input"
                        />
                    </div>
                    <div className="pomodoro-field">
                        <label className="setting-label">{t('longBreakAfter')}</label>
                        <input
                            type="number"
                            min={1}
                            max={10}
                            step={1}
                            value={settings.pomodoroCycles ?? 4}
                            onChange={handleCyclesChange}
                            className="setting-input"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default memo(PomodoroSettings)
