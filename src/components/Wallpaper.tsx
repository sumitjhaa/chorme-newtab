/**
 * @fileoverview Wallpaper display component with loading state.
 */

import { useState, useCallback, useMemo } from 'react'
import { useSettings } from '../hooks/useSettings'
import { buildWallpaperFilter } from '../helpers/wallpaper/filter'
import { getTextureBackgroundImage, isSVGTexture } from '../helpers/textures'
import type { WallpaperImage } from '../types/wallpaper'

interface WallpaperProps {
    wallpaper: WallpaperImage | null
    isLoading: boolean
}

function Wallpaper({ wallpaper, isLoading }: WallpaperProps) {
    const [imgLoaded, setImgLoaded] = useState(false)
    const { settings } = useSettings()

    const handleImgLoad = useCallback(() => setImgLoaded(true), [])

    const filterStyle = useMemo(
        () => ({ filter: buildWallpaperFilter(settings.bgBlur, settings.bgBrightness) }),
        [settings.bgBlur, settings.bgBrightness],
    )

    const textureStyle = useMemo(() => {
        const { bgTexture, bgTextureOpacity, bgTextureSize, bgTextureColor } = settings
        if (bgTexture === 'None') return undefined

        const style: React.CSSProperties = {
            '--texture-opacity': bgTextureOpacity,
            '--texture-size': `${bgTextureSize}px`,
            '--texture-color': bgTextureColor,
        } as React.CSSProperties

        if (isSVGTexture(bgTexture)) {
            style.backgroundImage = getTextureBackgroundImage(bgTexture, bgTextureOpacity, bgTextureSize)
        }

        return style
    }, [settings.bgTexture, settings.bgTextureOpacity, settings.bgTextureSize, settings.bgTextureColor])

    return (
        <div className="wallpaper-container" style={filterStyle}>
            {isLoading && (
                <div className="loading-overlay">
                    <div className="spinner" />
                </div>
            )}

            {wallpaper?.url ? (
                <picture>
                    {wallpaper.thumbnail && (
                        <source srcSet={wallpaper.thumbnail} media="(max-width: 1024px)" />
                    )}
                    <img
                        src={wallpaper.url}
                        alt=""
                        className={`wallpaper-img${isLoading ? ' loading' : ''}${imgLoaded ? ' loaded' : ''}`}
                        width={wallpaper.width}
                        height={wallpaper.height}
                        decoding="async"
                        onLoad={handleImgLoad}
                        onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                        }}
                    />
                </picture>
            ) : (
                <div className="default-background" />
            )}

            <div
                className="wallpaper-texture"
                data-texture={settings.bgTexture !== 'None' ? settings.bgTexture : undefined}
                style={textureStyle}
            />
            <div className="wallpaper-overlay" />
        </div>
    )
}

export default Wallpaper
