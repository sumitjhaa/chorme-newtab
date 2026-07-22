/**
 * @fileoverview Wallpaper management utilities for loading, saving, and applying wallpapers.
 */

import type { WallpaperImage } from '../types/wallpaper'
import type { WallpaperSource } from '../types'
import { getFromStorage, setToStorage } from '../utils/storage'
import { extractDominantColor } from '../lib/canvas'

const WALLPAPER_KEY = 'currentWallpaper'
const SOURCE_KEY = 'wallpaperSource'

/** Load the current wallpaper from storage */
export async function loadCurrentWallpaper(): Promise<WallpaperImage | null> {
  return getFromStorage<WallpaperImage>(WALLPAPER_KEY, null)
}

/** Save the current wallpaper to storage */
export async function saveCurrentWallpaper(wallpaper: WallpaperImage): Promise<void> {
  await setToStorage(WALLPAPER_KEY, wallpaper)
}

/** Load the saved wallpaper source from storage */
export async function loadWallpaperSource(): Promise<WallpaperSource | null> {
  return getFromStorage<WallpaperSource>(SOURCE_KEY, null)
}

/** Save the wallpaper source to storage */
export async function saveWallpaperSource(source: WallpaperSource): Promise<void> {
  await setToStorage(SOURCE_KEY, source)
}

/** Apply wallpaper color overlay CSS variables from an image URL */
export function applyWallpaperColors(imgUrl: string): void {
  extractDominantColor(imgUrl).then(({ r, g, b }) => {
    document.documentElement.style.setProperty('--wallpaper-color', `rgba(${r}, ${g}, ${b}, 0.45)`)
    document.documentElement.style.setProperty('--wallpaper-color-light', `rgba(${r}, ${g}, ${b}, 0.25)`)
  })
}
