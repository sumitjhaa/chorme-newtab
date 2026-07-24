/**
  * @fileoverview Weather widget settings panel.
  */

import { useCallback, memo } from 'react'
import { useSettings } from '../../hooks/useSettings'
import { useTranslation } from '../../hooks/useTranslation'
import { SettingRow } from '../ui/SettingRow'
import { SettingSelect } from '../ui/SettingSelect'
import { SettingInput } from '../ui/SettingInput'
import { SegmentedControl } from '../ui/SegmentedControl'
import { ToggleSwitch } from '../ui/ToggleSwitch'
import type { GeolocationMode, TempUnit, ForecastMode, TempDisplay, WeatherShow } from '../../types'

/**
  * Weather widget settings with geolocation and display options.
  * 
  * @example <WeatherSettings />
  */
function WeatherSettings() {
    const { settings, update } = useSettings()
    const { t } = useTranslation()

    const toggleShowWeatherWidget = useCallback(() => {
        update('showWeatherWidget', !settings.showWeatherWidget)
    }, [settings.showWeatherWidget, update])

    const handleGeolocationChange = useCallback((val: string) => {
        update('geolocation', val as GeolocationMode)
    }, [update])

    const handleManualLocationChange = useCallback((val: string) => {
        update('manualLocation', val)
    }, [update])

    const handleTempUnitChange = useCallback((val: string) => {
        update('tempUnit', val as TempUnit)
    }, [update])

    const handleForecastChange = useCallback((val: string) => {
        update('forecast', val as ForecastMode)
    }, [update])

    const handleTempDisplayChange = useCallback((val: string) => {
        update('tempDisplay', val as TempDisplay)
    }, [update])

    const handleWeatherShowChange = useCallback((val: string) => {
        update('weatherShow', val as WeatherShow)
    }, [update])

    return (
        <div className="settings-group">
            <div className="settings-group-title">{t('weather')}</div>
            <SettingRow label={t('showWeather')}>
                <ToggleSwitch
                    checked={settings.showWeatherWidget}
                    onChange={toggleShowWeatherWidget}
                />
            </SettingRow>

            {settings.showWeatherWidget && (
                <>
                    <SettingRow label={t('geolocation')}>
                        <SettingSelect
                            value={settings.geolocation}
                            onChange={handleGeolocationChange}
                            options={[
                                { value: 'approximate', label: t('approximate') },
                                { value: 'manual', label: t('manual') },
                                { value: 'disabled', label: t('disabled') },
                            ]}
                        />
                    </SettingRow>

                    {settings.geolocation === 'manual' && (
                        <SettingRow label={t('location')}>
                            <SettingInput
                                type="text"
                                value={settings.manualLocation}
                                onChange={handleManualLocationChange}
                                placeholder={t('cityOrCoords')}
                            />
                        </SettingRow>
                    )}

                    <SettingRow label={t('tempUnit')}>
                        <SegmentedControl
                            options={[
                                { value: 'celsius', label: '°C' },
                                { value: 'fahrenheit', label: '°F' },
                            ]}
                            value={settings.tempUnit}
                            onChange={handleTempUnitChange}
                        />
                    </SettingRow>

                    <SettingRow label={t('forecast')}>
                        <SettingSelect
                            value={settings.forecast}
                            onChange={handleForecastChange}
                            options={[
                                { value: 'automatic', label: t('automatic') },
                                { value: 'hourly', label: t('hourly') },
                                { value: 'daily', label: t('daily') },
                            ]}
                        />
                    </SettingRow>

                    <SettingRow label={t('temperature')}>
                        <SettingSelect
                            value={settings.tempDisplay}
                            onChange={handleTempDisplayChange}
                            options={[
                                { value: 'actual', label: t('actual') },
                                { value: 'feels_like', label: t('feelsLike') },
                                { value: 'both', label: t('both') },
                            ]}
                        />
                    </SettingRow>

                    <SettingRow label={t('show')}>
                        <SettingSelect
                            value={settings.weatherShow}
                            onChange={handleWeatherShowChange}
                            options={[
                                { value: 'description_icon', label: t('descAndIcon') },
                                { value: 'description', label: t('description') },
                                { value: 'icon', label: t('icon') },
                                { value: 'none', label: t('nothing') },
                            ]}
                        />
                    </SettingRow>
                </>
            )}
        </div>
    )
}

export default memo(WeatherSettings)
