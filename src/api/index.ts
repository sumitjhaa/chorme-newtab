// @ts-nocheck
import { API_SOURCES } from '../constants'

export async function fetchRandomWallpaper(source = API_SOURCES.WALLHAVEN) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Request timed out'))
    }, 15000)

    chrome.runtime.sendMessage(
      { type: 'FETCH_WALLPAPER', source },
      (response) => {
        clearTimeout(timeout)

        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message))
          return
        }

        if (response?.error) {
          reject(new Error(response.error))
          return
        }

        resolve(response.wallpaper)
      }
    )
  })
}

export function getAvailableSources() {
  return [
    API_SOURCES.WALLHAVEN,
    API_SOURCES.PIXABAY,
    API_SOURCES.PICSUM,
    API_SOURCES.CATBOX,
  ]
}
