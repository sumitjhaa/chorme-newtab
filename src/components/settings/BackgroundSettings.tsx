import { useCallback, memo } from 'react'
import { useSettings } from '../../hooks/useSettings'
import { useTranslation } from '../../hooks/useTranslation'
import { FREQUENCIES } from '../../constants'
import { SettingRow } from '../ui/SettingRow'
import { SettingSelect } from '../ui/SettingSelect'
import { SettingRange } from '../ui/SettingRange'
import WallpaperBrowser from './WallpaperBrowser'
import type { WallhavenWallpaper } from '../../helpers/wallhaven'

function BackgroundSettings() {
    const { settings, update } = useSettings()
    const { t } = useTranslation()

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

    return (
        <div className="settings-groups">
            <div className="settings-group">
                <div className="settings-group-title">{t('general')}</div>

                <SettingRange label={t('blur')} value={settings.bgBlur} min={0} max={50} unit="px"
                    onChange={(v) => update('bgBlur', v)} />

                <SettingRange label={t('brightness')} value={settings.bgBrightness} min={10} max={200} unit="%"
                    onChange={(v) => update('bgBrightness', v)} />

                <SettingRow label={t('frequency')}>
                    <SettingSelect value={settings.bgFrequency}
                        options={FREQUENCIES.map(f => ({ ...f, label: t(f.label.toLowerCase().replace(/\s/g, '')) }))}
                        onChange={(v) => update('bgFrequency', v)} />
                </SettingRow>
            </div>

            <div className="settings-group settings-group-scroll">
                <div className="settings-group-title">Wallpaper Search</div>
                <WallpaperBrowser onSelect={handleWallpaperSelect} />
            </div>
        </div>
    )
}

export default memo(BackgroundSettings)
