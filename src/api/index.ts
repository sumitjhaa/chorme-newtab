import { API_SOURCES } from '../constants'
import type { WallpaperImage } from '../types/wallpaper'

export async function fetchRandomWallpaper(): Promise<WallpaperImage> {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Request timed out')), 15000)

        chrome.runtime.sendMessage(
            { type: 'FETCH_WALLPAPER', source: API_SOURCES.WALLHAVEN },
            ((response: { wallpaper?: WallpaperImage; error?: string } | null) => {
                clearTimeout(timeout)
                if (chrome.runtime.lastError) return reject(new Error(chrome.runtime.lastError.message))
                if (!response) return reject(new Error('No response from background'))
                if (response.error) return reject(new Error(response.error))
                if (!response.wallpaper) return reject(new Error('No wallpaper in response'))
                resolve(response.wallpaper)
            }) as (response: unknown) => void
        )
    })
}
