/**
 * @fileoverview Greeting widget settings panel.
 */

import { useCallback, memo } from 'react'
import { useSettings } from '../../hooks/useSettings'
import { useTranslation } from '../../hooks/useTranslation'
import { SettingRow } from '../ui/SettingRow'
import { SettingInput } from '../ui/SettingInput'
import { ToggleSwitch } from '../ui/ToggleSwitch'

/**
 * Greeting widget settings with enable toggle and name input.
 */
function GreetingSettings() {
    const { settings, update } = useSettings()
    const { t } = useTranslation()

    const toggleEnableGreeting = useCallback(() => {
        update('enableGreeting', !settings.enableGreeting)
    }, [settings.enableGreeting, update])

    const handleGreetingNameChange = useCallback((val: string) => {
        update('greetingName', val)
    }, [update])

    return (
        <div className="settings-group">
            <div className="settings-group-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>{t('greeting')}</span>
                <ToggleSwitch
                    checked={settings.enableGreeting}
                    onChange={toggleEnableGreeting}
                />
            </div>

            {settings.enableGreeting && (
                <SettingRow label={t('greetingName')}>
                    <SettingInput
                        type="text"
                        value={settings.greetingName}
                        onChange={handleGreetingNameChange}
                        placeholder={t('yourName')}
                    />
                </SettingRow>
            )}
        </div>
    )
}

export default memo(GreetingSettings)
