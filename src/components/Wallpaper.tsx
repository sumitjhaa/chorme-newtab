/**
  * @fileoverview Wallpaper display component with loading state.
  */

import { memo } from 'react'
import type { WallpaperImage } from '../types/wallpaper'

/** Props for the Wallpaper component */
interface WallpaperProps {
    /** Current wallpaper image data */
    wallpaper: WallpaperImage | null
    /** Whether wallpaper is loading */
    isLoading: boolean
}

/**
  * Full-screen wallpaper display with loading overlay.
  * 
  * @param props - WallpaperProps
  * @example <Wallpaper wallpaper={wp} isLoading={false} />
  */
function Wallpaper({ wallpaper, isLoading }: WallpaperProps) {
    return (
        <div className="wallpaper-container" style={{ filter: 'var(--wallpaper-filter, none)' }}>
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
                        className={`wallpaper-img${isLoading ? ' loading' : ''}`}
                        width={wallpaper.width}
                        height={wallpaper.height}
                        decoding="async"
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

export default memo(Wallpaper)
