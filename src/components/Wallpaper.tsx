/**
 * @fileoverview Wallpaper display component with loading state.
 */

import { useState, useCallback } from 'react'
import type { WallpaperImage } from '../types/wallpaper'

interface WallpaperProps {
    wallpaper: WallpaperImage | null
    isLoading: boolean
}

function Wallpaper({ wallpaper, isLoading }: WallpaperProps) {
    const [imgLoaded, setImgLoaded] = useState(false)

    const handleImgLoad = useCallback(() => setImgLoaded(true), [])

    return (
        <div className="wallpaper-container">
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

            <div className="wallpaper-overlay" />
        </div>
    )
}

export default Wallpaper
