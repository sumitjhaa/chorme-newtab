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
                <img
                    className="wallpaper-image"
                    src={wallpaper.url}
                    alt="Wallpaper"
                    loading="eager"
                />
            ) : (
                <div className="default-background" />
            )}

            <div className="wallpaper-overlay" />
        </div>
    )
}

export default memo(Wallpaper)
