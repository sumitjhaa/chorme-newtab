/**
  * @fileoverview Chrome extension background script for wallpaper fetching and suggestions.
  */

const API_ENDPOINTS: Record<string, string> = {
    wallhaven: 'https://wallhaven.cc/api/v1/search',
}

/** Wallpaper API response format */
interface WallpaperResponse {
    /** Full resolution image URL */
    url: string
    /** Thumbnail URL */
    thumb: string
    /** Source provider */
    source: string
    /** Image ID */
    id: string | number
    /** Image resolution */
    resolution: string
    /** Author name (optional) */
    author?: string
}

/**
  * Fetch random wallpaper from Wallhaven.
  * @returns Wallpaper response data
  */
async function fetchWallhaven(): Promise<WallpaperResponse> {
    const params = new URLSearchParams({
        categories: '010',
        sorting: 'random',
        purity: '100',
    })

    const response = await fetch(`${API_ENDPOINTS.wallhaven}?${params}`)
    
    if (!response.ok) {
        throw new Error(`Wallhaven failed: ${response.status}`)
    }

    const data = await response.json()
    if (!data.data || data.data.length === 0) {
        throw new Error('No wallpapers found')
    }

    const randomIndex = Math.floor(Math.random() * data.data.length)
    const wallpaper = data.data[randomIndex]

    return {
        url: wallpaper.path,
        thumb: wallpaper.thumbs.large,
        source: 'wallhaven',
        id: wallpaper.id,
        resolution: wallpaper.resolution,
    }
}

/**
  * Fetch random wallpaper from Picsum.
  * @returns Wallpaper response data
  */
async function fetchPicsum(): Promise<WallpaperResponse> {
    const response = await fetch('https://picsum.photos/1920/1080/random', {
        redirect: 'follow',
    })

    if (!response.ok) {
        throw new Error(`Picsum failed: ${response.status}`)
    }

    const url = response.url

    return {
        url: url,
        thumb: url,
        source: 'picsum',
        id: Date.now(),
        resolution: '1920x1080',
    }
}

/** Map of source names to fetcher functions */
const fetchers: Record<string, () => Promise<WallpaperResponse>> = {
    wallhaven: fetchWallhaven,
    picsum: fetchPicsum,
}

/**
  * Handle messages from content scripts.
  * Supports FETCH_WALLPAPER and FETCH_SUGGESTIONS message types.
  */
chrome.runtime.onMessage.addListener((message: unknown, _sender: unknown, sendResponse: (response: unknown) => void) => {
    const msg = message as { type: string; source?: string; query?: string }
    if (msg.type === 'FETCH_WALLPAPER') {
        const source = msg.source || 'wallhaven'
        const fetcher = fetchers[source]

        if (!fetcher) {
            sendResponse({ error: `Unknown source: ${source}` })
            return true
        }

        fetcher()
            .then((wallpaper) => {
                sendResponse({ wallpaper })
            })
            .catch((error: Error) => {
                sendResponse({ error: error.message })
            })

        return true
    }

    if (msg.type === 'FETCH_SUGGESTIONS') {
        fetch(`https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(msg.query || '')}`)
            .then(res => res.json())
            .then((data: unknown) => {
                const arr = data as [string, string[]]
                sendResponse({ suggestions: arr[1] || [] })
            })
            .catch(() => sendResponse({ suggestions: [] }))
        return true
    }
})
