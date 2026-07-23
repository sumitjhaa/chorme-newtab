import { useCallback, memo } from 'react'
import { useSettings } from '../../hooks/useSettings'
import { useTranslation } from '../../hooks/useTranslation'
import { TEXTURES, FREQUENCIES } from '../../constants'
import { TEXTURE_CONFIGS } from '../../helpers/textures/config'
import { SettingRow } from '../ui/SettingRow'
import { SettingSelect } from '../ui/SettingSelect'
import { SettingRange } from '../ui/SettingRange'
import { SettingColor } from '../ui/SettingColor'
import WallpaperBrowser from './WallpaperBrowser'
import type { WallhavenWallpaper } from '../../helpers/wallhaven'

const TEXTURE_LABELS: Record<string, string> = {
    'Grain': 'grain', 'Vector grain': 'vectorGrain',
    'Grid': 'grid', 'Vertical lines': 'verticalLines',
    'Horizontal lines': 'horizontalLines', 'Diagonal lines': 'diagonalLines',
    'Vertical stripes': 'verticalStripes', 'Horizontal stripes': 'horizontalStripes',
    'Diagonal stripes': 'diagonalStripes', 'Diagonal dots': 'diagonalDots',
    'Vertical dots': 'verticalDots', 'Topographic': 'topographic',
    'Honeycomb': 'honeycomb', 'Isometric': 'isometric',
    'Circuit board': 'circuitBoard', 'Checkerboard': 'checkerboard',
    'None': 'none',
}

function BackgroundSettings() {
    const { settings, update } = useSettings()
    const { t } = useTranslation()

    const texConfig = TEXTURE_CONFIGS[settings.bgTexture]
    const showTex = settings.bgTexture !== 'None' && texConfig

    const updateTextureDefaults = useCallback((name: string) => {
        const cfg = TEXTURE_CONFIGS[name]
        if (!cfg) return
        update('bgTextureOpacity', cfg.opacity.default)
        update('bgTextureSize', cfg.size.default)
        if (cfg.hasColor) update('bgTextureColor', '#ffffff')
    }, [update])

    const handleWallpaperSelect = useCallback((wp: WallhavenWallpaper) => {
        update('bgType', 'images')
        window.dispatchEvent(new CustomEvent('set-wallpaper', {
            detail: {
                id: wp.id,
                url: wp.path,
                thumbnail: wp.thumbs.large,
                width: parseInt(wp.resolution.split('x')[0]),
                height: parseInt(wp.resolution.split('x')[1]),
            },
        }))
    }, [update])

    const texOpts = TEXTURES.map(tex => ({ value: tex, label: t(TEXTURE_LABELS[tex]) }))

    return (
        <div className="settings-groups">
            <div className="settings-group">
                <div className="settings-group-title">{t('general')}</div>

                <SettingRange label={t('blur')} value={settings.bgBlur} min={0} max={50} unit="px"
                    onChange={(v) => update('bgBlur', v)} />

                <SettingRange label={t('brightness')} value={settings.bgBrightness} min={10} max={200} unit="%"
                    onChange={(v) => update('bgBrightness', v)} />

                <SettingRange label={t('fadeInTime')} value={settings.bgFadeTime} min={0} max={5000} step={250}
                    format={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}s` : `${v}ms`}
                    onChange={(v) => update('bgFadeTime', v)} />

                <SettingRow label={t('frequency')}>
                    <SettingSelect value={settings.bgFrequency}
                        options={FREQUENCIES.map(f => ({ ...f, label: t(f.label.toLowerCase().replace(/\s/g, '')) }))}
                        onChange={(v) => update('bgFrequency', v)} />
                </SettingRow>

                <SettingRow label={t('texture')}>
                    <SettingSelect value={settings.bgTexture} options={texOpts}
                        onChange={(v) => { update('bgTexture', v); updateTextureDefaults(v) }} />
                </SettingRow>

                {showTex && (
                    <>
                        <SettingRange label={t('textureOpacity')} value={settings.bgTextureOpacity}
                            min={texConfig.opacity.min} max={texConfig.opacity.max} step={texConfig.opacity.step}
                            onChange={(v) => update('bgTextureOpacity', v)} />

                        <SettingRange label={t('textureSize')} value={settings.bgTextureSize} unit="px"
                            min={texConfig.size.min} max={texConfig.size.max} step={texConfig.size.step}
                            onChange={(v) => update('bgTextureSize', v)} />

                        {texConfig.hasColor && (
                            <SettingColor label={t('textureColor')} value={settings.bgTextureColor}
                                onChange={(v) => update('bgTextureColor', v)} />
                        )}
                    </>
                )}
            </div>

            <div className="settings-group settings-group-scroll">
                <div className="settings-group-title">Wallpaper Search</div>
                <WallpaperBrowser onSelect={handleWallpaperSelect} />
            </div>
        </div>
    )
}

export default memo(BackgroundSettings)
