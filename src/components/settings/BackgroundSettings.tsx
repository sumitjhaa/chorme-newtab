/**
  * @fileoverview Background and wallpaper settings panel.
  */

import { useCallback, useMemo, memo } from 'react'
import { useSettings } from '../../hooks/useSettings'
import { useTranslation } from '../../hooks/useTranslation'
import { API_SOURCES, TEXTURES } from '../../constants'
import { SettingRow } from '../ui/SettingRow'
import { SettingSelect } from '../ui/SettingSelect'
import { SettingInput } from '../ui/SettingInput'

/** Texture key to translation key mapping */
const TEXTURE_KEYS: Record<string, string> = {
    'Grain': 'grain',
    'Vector grain': 'vectorGrain',
    'Diagonal dots': 'diagonalDots',
    'Vertical dots': 'verticalDots',
    'Topographic': 'topographic',
    'Aztec': 'aztec',
    'Checkerboard': 'checkerboard',
    'Isometric': 'isometric',
    'Circuit board': 'circuitBoard',
    'Tic-tac-toe': 'ticTacToe',
    'Endless clouds': 'endlessClouds',
    'Waves': 'waves',
    'Honeycomb': 'honeycomb',
    'Grid': 'grid',
    'Vertical lines': 'verticalLines',
    'Horizontal lines': 'horizontalLines',
    'Diagonal lines': 'diagonalLines',
    'Vertical stripes': 'verticalStripes',
    'Horizontal stripes': 'horizontalStripes',
    'Diagonal stripes': 'diagonalStripes',
    'None': 'none',
}

/** API source display labels */
const SOURCE_LABELS: Record<string, string> = {
    [API_SOURCES.UNSPLASH]: 'Unsplash',
    [API_SOURCES.WALLHAVEN]: 'Wallhaven',
    [API_SOURCES.PIXABAY]: 'Pixabay',
    [API_SOURCES.PICSUM]: 'Picsum',
    [API_SOURCES.CATBOX]: 'Catbox',
}

/** Available image providers */
const IMAGE_PROVIDERS = [API_SOURCES.UNSPLASH, API_SOURCES.WALLHAVEN, API_SOURCES.PIXABAY, API_SOURCES.PICSUM, API_SOURCES.CATBOX]

/**
  * Background settings with provider, frequency, texture, blur, and brightness controls.
  * 
  * @example <BackgroundSettings />
  */
function BackgroundSettings() {
    const { settings, update } = useSettings()
    const { t } = useTranslation()

    const bgTypes = useMemo(() => [
        { value: 'images', label: t('images') },
        { value: 'videos', label: t('videos') },
        { value: 'local', label: t('localFiles') },
        { value: 'url', label: t('urls') },
        { value: 'solid', label: t('solidColor') },
    ], [t])

    const freqOptions = useMemo(() => [
        { value: 'every_tab', label: t('everyTab') },
        { value: 'every_hour', label: t('everyHour') },
        { value: 'every_day', label: t('everyDay') },
        { value: 'daylight', label: t('daylight') },
        { value: 'locked', label: t('locked') },
    ], [t])

    const texOptions = useMemo(() =>
        TEXTURES.map(tex => ({ value: tex, label: t(TEXTURE_KEYS[tex]) })),
        [t]
    )

    const providerOptions = useMemo(() =>
        IMAGE_PROVIDERS.map((p) => ({ value: p, label: SOURCE_LABELS[p] || p })),
        []
    )

    const handleBgTypeChange = useCallback((val: string) => {
        update('bgType', val)
    }, [update])

    const handleBgProviderChange = useCallback((val: string) => {
        update('bgProvider', val)
    }, [update])

    const handleBgCollectionChange = useCallback((val: string) => {
        update('bgCollection', val)
    }, [update])

    const handleBgFrequencyChange = useCallback((val: string) => {
        update('bgFrequency', val)
    }, [update])

    const handleBgTextureChange = useCallback((val: string) => {
        update('bgTexture', val)
    }, [update])

    const handleBgBlurChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        update('bgBlur', Number(e.target.value))
    }, [update])

    const handleBgBrightnessChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        update('bgBrightness', Number(e.target.value))
    }, [update])

    const handleBgFadeTimeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        update('bgFadeTime', Number(e.target.value))
    }, [update])

    const showCollection = settings.bgProvider === API_SOURCES.WALLHAVEN || settings.bgProvider === API_SOURCES.UNSPLASH

    return (
        <div className="settings-group">
            <div className="settings-group-title">{t('general')}</div>

            <SettingRow label={t('backgroundType')}>
                <SettingSelect
                    value={settings.bgType}
                    onChange={handleBgTypeChange}
                    options={bgTypes}
                />
            </SettingRow>

            <SettingRow label={t('provider')}>
                <SettingSelect
                    value={settings.bgProvider}
                    onChange={handleBgProviderChange}
                    options={providerOptions}
                />
            </SettingRow>

            {showCollection && (
                <SettingRow label={t('collection')}>
                    <SettingInput
                        type="text"
                        value={settings.bgCollection}
                        onChange={handleBgCollectionChange}
                        placeholder={t('collectionId')}
                    />
                </SettingRow>
            )}

            <SettingRow label={t('frequency')}>
                <SettingSelect
                    value={settings.bgFrequency}
                    onChange={handleBgFrequencyChange}
                    options={freqOptions}
                />
            </SettingRow>

            <SettingRow label={t('texture')}>
                <SettingSelect
                    value={settings.bgTexture}
                    onChange={handleBgTextureChange}
                    options={texOptions}
                />
            </SettingRow>

            <SettingRow label={t('blur')}>
                <div className="range-control">
                    <input
                        type="range"
                        min="0"
                        max="50"
                        value={settings.bgBlur}
                        onChange={handleBgBlurChange}
                        className="slider"
                    />
                    <span className="range-value">{settings.bgBlur}px</span>
                </div>
            </SettingRow>

            <SettingRow label={t('brightness')}>
                <div className="range-control">
                    <input
                        type="range"
                        min="10"
                        max="200"
                        value={settings.bgBrightness}
                        onChange={handleBgBrightnessChange}
                        className="slider"
                    />
                    <span className="range-value">{settings.bgBrightness}%</span>
                </div>
            </SettingRow>

            <SettingRow label={t('fadeInTime')}>
                <div className="range-control">
                    <input
                        type="range"
                        min="100"
                        max="3000"
                        step="100"
                        value={settings.bgFadeTime}
                        onChange={handleBgFadeTimeChange}
                        className="slider"
                    />
                    <span className="range-value">{settings.bgFadeTime}ms</span>
                </div>
            </SettingRow>
        </div>
    )
}

export default memo(BackgroundSettings)
