/**
 * @fileoverview Wallpaper display component with loading state.
 */

import { useState, useCallback, useEffect } from 'react'
import type { WallpaperImage } from '../types/wallpaper'

interface WallpaperProps {
    wallpaper: WallpaperImage | null
    isLoading: boolean
}

function Wallpaper({ wallpaper, isLoading }: WallpaperProps) {
    const [imgLoaded, setImgLoaded] = useState(false)
    const [imgError, setImgError] = useState(false)

    useEffect(() => {
        setImgLoaded(false)
        setImgError(false)
    }, [wallpaper?.url])

    const handleImgLoad = useCallback(() => setImgLoaded(true), [])

    return (
        <div className="wallpaper-container">
            {isLoading && (
                <div className="loading-overlay">
                    <div className="spinner" />
                </div>
            )}

            {wallpaper?.url && !imgError ? (
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
                        onError={() => setImgError(true)}
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
