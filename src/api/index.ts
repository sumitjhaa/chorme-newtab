/**
 * @fileoverview API utilities for fetching wallpapers from various sources.
 */

import { API_SOURCES } from '../constants'
import type { WallpaperSource } from '../types'
import type { WallpaperImage } from '../types/wallpaper'

/**
 * Fetch a random wallpaper from the specified source via the background script.
 * @param source - Wallpaper source provider (default: wallhaven)
 * @returns Wallpaper image data
 * @throws Error on timeout or fetch failure
 */
export async function fetchRandomWallpaper(source: WallpaperSource = API_SOURCES.WALLHAVEN): Promise<WallpaperImage> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Request timed out'))
    }, 15000)

    chrome.runtime.sendMessage(
      { type: 'FETCH_WALLPAPER', source },
      ((response: { wallpaper?: WallpaperImage; error?: string } | null) => {
        clearTimeout(timeout)

        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message))
          return
        }

        if (response?.error) {
          reject(new Error(response.error))
          return
        }

        resolve(response!.wallpaper!)
      }) as (response: unknown) => void
    )
  })
}

/**
 * Get list of available wallpaper sources.
 * @returns Array of source identifiers
 */
export function getAvailableSources() {
  return [
    API_SOURCES.WALLHAVEN,
    API_SOURCES.PIXABAY,
    API_SOURCES.PICSUM,
    API_SOURCES.CATBOX,
  ]
}
