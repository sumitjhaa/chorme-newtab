/**
  * @fileoverview Clock widget settings panel.
  */

import { useCallback, useMemo, memo } from 'react'
import { useSettings } from '../../hooks/useSettings'
import { useTranslation } from '../../hooks/useTranslation'
import { SettingRow } from '../ui/SettingRow'
import { SettingSelect } from '../ui/SettingSelect'
import { ToggleSwitch } from '../ui/ToggleSwitch'

/** Date format options */
const DATE_FORMAT_OPTIONS = [
    { value: 'DD/MM/YYYY', labelKey: 'dayMonthYear' },
    { value: 'MM/DD/YYYY', labelKey: 'monthDayYear' },
    { value: 'YYYY-MM-DD', labelKey: 'yearMonthDay' },
]

/** Display options */
const SHOW_OPTIONS = [
    { value: 'both', labelKey: 'clockAndDate' },
    { value: 'clock', labelKey: 'clockOnly' },
    { value: 'date', labelKey: 'dateOnly' },
]

/**
  * Get supported timezones from Intl API.
  * @returns Array of timezone strings
  */
function getSupportedTimeZones(): string[] {
    try {
        if (typeof Intl !== 'undefined' && 'supportedValuesOf' in Intl) {
            return (Intl as unknown as { supportedValuesOf(type: string): string[] }).supportedValuesOf('timeZone')
        }
    } catch {}
    return []
}

/** Cached list of supported timezones */
const SUPPORTED_TIMEZONES = getSupportedTimeZones()

/**
  * Clock widget settings with format, timezone, and world clock controls.
  * 
  * @example <ClockSettings />
  */
function ClockSettings() {
    const { settings, update } = useSettings()
    const { t } = useTranslation()

    const timeZoneOptions = useMemo(() => [
        { value: 'local', label: t('local') },
        ...SUPPORTED_TIMEZONES.map((tz: string) => {
            const parts = tz.split('/')
            const label = parts.length > 1 ? parts[parts.length - 1].replace(/_/g, ' ') : tz
            return { value: tz, label }
        })
    ], [t])

    const worldClockTimezoneOptions = useMemo(() =>
        SUPPORTED_TIMEZONES.map((tzOption: string) => {
            const parts = tzOption.split('/')
            const label = parts.length > 1 ? parts[parts.length - 1].replace(/_/g, ' ') : tzOption
            return { value: tzOption, label }
        }),
        []
    )

    const dateFormatOptions = useMemo(() =>
        DATE_FORMAT_OPTIONS.map(o => ({ value: o.value, label: t(o.labelKey) })),
        [t]
    )

    const showOptions = useMemo(() =>
        SHOW_OPTIONS.map(o => ({ value: o.value, label: t(o.labelKey) })),
        [t]
    )

    const toggleShowClockWidget = useCallback(() => {
        update('showClockWidget', !settings.showClockWidget)
    }, [settings.showClockWidget, update])

    const toggleClockFormat = useCallback(() => {
        update('clockFormat', settings.clockFormat === '12h' ? '24h' : '12h')
    }, [settings.clockFormat, update])

    const toggleShowAmPm = useCallback(() => {
        update('showAmPm', !settings.showAmPm)
    }, [settings.showAmPm, update])

    const toggleShowSeconds = useCallback(() => {
        update('showSeconds', !settings.showSeconds)
    }, [settings.showSeconds, update])

    const toggleAnalogClock = useCallback(() => {
        update('analogClock', !settings.analogClock)
    }, [settings.analogClock, update])

    const toggleWorldClocks = useCallback(() => {
        if ((settings.worldClockTimezones || []).length > 0) {
            update('worldClockTimezones', [])
        } else {
            update('worldClockTimezones', ['America/New_York', 'Europe/London', 'Asia/Tokyo'])
        }
    }, [settings.worldClockTimezones, update])

    const handleClockSizeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        update('clockSize', Number(e.target.value))
    }, [update])

    const handleTimeZoneChange = useCallback((val: string) => {
        update('timeZone', val)
    }, [update])

    const handleDateFormatChange = useCallback((val: string) => {
        update('dateFormat', val)
    }, [update])

    const handleShowChange = useCallback((val: string) => {
        update('showClockDate', val)
    }, [update])

    const handleWorldClockChange = useCallback((i: number, val: string) => {
        const list = [...settings.worldClockTimezones]
        list[i] = val
        update('worldClockTimezones', list)
    }, [settings.worldClockTimezones, update])

    const handleRemoveWorldClock = useCallback((i: number) => {
        const list = [...settings.worldClockTimezones]
        list.splice(i, 1)
        update('worldClockTimezones', list)
    }, [settings.worldClockTimezones, update])

    const handleAddWorldClock = useCallback(() => {
        const list = [...(settings.worldClockTimezones || [])]
        if (!list.includes('America/New_York')) list.push('America/New_York')
        else if (!list.includes('Europe/London')) list.push('Europe/London')
        else if (!list.includes('Asia/Tokyo')) list.push('Asia/Tokyo')
        else list.push(SUPPORTED_TIMEZONES[0])
        update('worldClockTimezones', list)
    }, [settings.worldClockTimezones, update])

    const worldClockTimezones = settings.worldClockTimezones || []
    const hasWorldClocks = worldClockTimezones.length > 0

    return (
        <div className="settings-group">
            <div className="settings-group-title">{t('date')}</div>
            <SettingRow label={t('showClock')}>
                <ToggleSwitch
                    checked={settings.showClockWidget}
                    onChange={toggleShowClockWidget}
                />
            </SettingRow>
            {settings.showClockWidget && (<>
                <SettingRow label={t('twelveHrFormat')}>
                    <ToggleSwitch
                        checked={settings.clockFormat === '12h'}
                        onChange={toggleClockFormat}
                    />
                </SettingRow>
                <SettingRow label={t('showAmPm')}>
                    <ToggleSwitch
                        checked={settings.showAmPm}
                        onChange={toggleShowAmPm}
                    />
                </SettingRow>
                <SettingRow label={t('showSeconds')}>
                    <ToggleSwitch
                        checked={settings.showSeconds}
                        onChange={toggleShowSeconds}
                    />
                </SettingRow>
                <SettingRow label={t('analogClock')}>
                    <ToggleSwitch
                        checked={settings.analogClock}
                        onChange={toggleAnalogClock}
                    />
                </SettingRow>
                <SettingRow label={t('worldClocks')}>
                    <ToggleSwitch
                        checked={hasWorldClocks}
                        onChange={toggleWorldClocks}
                    />
                </SettingRow>
                {hasWorldClocks && (
                    <>
                        {worldClockTimezones.map((tz: string, i: number) => (
                            <div key={tz} className="setting-row">
                                <SettingSelect
                                    value={tz}
                                    onChange={(val) => handleWorldClockChange(i, val)}
                                    options={worldClockTimezoneOptions}
                                />
                                <button
                                    className="wc-remove-btn"
                                    onClick={() => handleRemoveWorldClock(i)}
                                >✕</button>
                            </div>
                        ))}
                        <div className="setting-row">
                            <button
                                className="wc-add-btn"
                                onClick={handleAddWorldClock}
                            >{t('addWorldClock')}</button>
                        </div>
                    </>
                )}
                <SettingRow label={t('clockSize')}>
                    <div className="range-control">
                        <input
                            type="range"
                            min="50"
                            max="200"
                            step="5"
                            value={settings.clockSize}
                            onChange={handleClockSizeChange}
                            className="slider"
                        />
                        <span className="range-value">{settings.clockSize}%</span>
                    </div>
                </SettingRow>
                <SettingRow label={t('timeZone')}>
                    <SettingSelect
                        value={settings.timeZone}
                        onChange={handleTimeZoneChange}
                        options={timeZoneOptions}
                    />
                </SettingRow>
                <SettingRow label={t('dateFormat')}>
                    <SettingSelect
                        value={settings.dateFormat}
                        onChange={handleDateFormatChange}
                        options={dateFormatOptions}
                    />
                </SettingRow>
                <SettingRow label={t('show')}>
                    <SettingSelect
                        value={settings.showClockDate}
                        onChange={handleShowChange}
                        options={showOptions}
                    />
                </SettingRow>
            </>)}
        </div>
    )
}

export default memo(ClockSettings)
