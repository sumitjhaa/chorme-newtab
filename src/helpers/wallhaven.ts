const API_URL = 'https://wallhaven.cc/api/v1/search'

export interface WallhavenSearchParams {
    q?: string
    categories?: string
    purity?: string
    sorting?: string
    order?: string
    topRange?: string
    atleast?: string
    resolutions?: string
    ratios?: string
    color?: string
    page?: number
    seed?: string
}

export interface WallhavenWallpaper {
    id: string
    url: string
    path: string
    resolution: string
    ratio: string
    purity: string
    category: string
    thumbs: { small: string; large: string; original: string }
    views: number
    favorites: number
    colors: string[]
    file_type: string
    created_at: string
}

export interface WallhavenResponse {
    data: WallhavenWallpaper[]
    meta: {
        current_page: number
        last_page: number
        per_page: number
        total: number
        seed: string | null
    }
}

export const CATEGORIES = [
    { value: '100', label: 'General' },
    { value: '010', label: 'Anime' },
    { value: '001', label: 'People' },
    { value: '110', label: 'General + Anime' },
    { value: '101', label: 'General + People' },
    { value: '011', label: 'Anime + People' },
    { value: '111', label: 'All' },
]

export const PURITIES = [
    { value: '100', label: 'SFW' },
    { value: '010', label: 'Sketchy' },
    { value: '110', label: 'SFW + Sketchy' },
    { value: '111', label: 'All' },
]

export const SORTING_OPTIONS = [
    { value: 'date_added', label: 'Date Added' },
    { value: 'relevance', label: 'Relevance' },
    { value: 'random', label: 'Random' },
    { value: 'views', label: 'Views' },
    { value: 'favorites', label: 'Favorites' },
    { value: 'toplist', label: 'Toplist' },
    { value: 'hot', label: 'Hot' },
]

export const TOP_RANGES = [
    { value: '1d', label: 'Today' },
    { value: '3d', label: '3 Days' },
    { value: '1w', label: 'This Week' },
    { value: '1M', label: 'This Month' },
    { value: '3M', label: '3 Months' },
    { value: '6M', label: '6 Months' },
    { value: '1y', label: 'This Year' },
]

export const RATIOS = [
    { value: '16x9', label: '16:9' },
    { value: '16x10', label: '16:10' },
    { value: '21x9', label: '21:9' },
    { value: '32x9', label: '32:9' },
    { value: '48x9', label: '48:9' },
    { value: '4x3', label: '4:3' },
    { value: '5x4', label: '5:4' },
    { value: '3x2', label: '3:2' },
    { value: '9x16', label: '9:16' },
    { value: '10x16', label: '10:16' },
    { value: '9x18', label: '9:18' },
    { value: '1x1', label: '1:1' },
]

export const RESOLUTIONS = [
    { value: '1280x720', label: '1280 × 720' },
    { value: '1280x800', label: '1280 × 800' },
    { value: '1280x960', label: '1280 × 960' },
    { value: '1280x1024', label: '1280 × 1024' },
    { value: '1600x900', label: '1600 × 900' },
    { value: '1600x1000', label: '1600 × 1000' },
    { value: '1600x1200', label: '1600 × 1200' },
    { value: '1600x1280', label: '1600 × 1280' },
    { value: '1920x1080', label: '1920 × 1080' },
    { value: '1920x1200', label: '1920 × 1200' },
    { value: '1920x1440', label: '1920 × 1440' },
    { value: '1920x1536', label: '1920 × 1536' },
    { value: '2560x1080', label: '2560 × 1080' },
    { value: '2560x1440', label: '2560 × 1440' },
    { value: '2560x1600', label: '2560 × 1600' },
    { value: '2560x1920', label: '2560 × 1920' },
    { value: '2560x2048', label: '2560 × 2048' },
    { value: '3440x1440', label: '3440 × 1440' },
    { value: '3840x1600', label: '3840 × 1600' },
    { value: '3840x2160', label: '3840 × 2160' },
    { value: '3840x2400', label: '3840 × 2400' },
    { value: '3840x2880', label: '3840 × 2880' },
    { value: '3840x3072', label: '3840 × 3072' },
]

export const COLORS = [
    { value: '', label: 'Any' },
    { value: '660000', label: 'Red' },
    { value: '990000', label: 'Dark Red' },
    { value: 'cc0000', label: 'Bright Red' },
    { value: 'cc3333', label: 'Light Red' },
    { value: 'ea4c88', label: 'Pink' },
    { value: '993399', label: 'Purple' },
    { value: '663399', label: 'Deep Purple' },
    { value: '333399', label: 'Indigo' },
    { value: '0066cc', label: 'Blue' },
    { value: '0099cc', label: 'Light Blue' },
    { value: '66cccc', label: 'Teal' },
    { value: '77cc33', label: 'Green' },
    { value: '669900', label: 'Dark Green' },
    { value: '336600', label: 'Forest' },
    { value: '666600', label: 'Olive' },
    { value: '999900', label: 'Lime' },
    { value: 'cccc33', label: 'Yellow' },
    { value: 'ffff00', label: 'Bright Yellow' },
    { value: 'ffcc33', label: 'Gold' },
    { value: 'ff9900', label: 'Orange' },
    { value: 'ff6600', label: 'Deep Orange' },
    { value: 'cc6633', label: 'Brown' },
    { value: '996633', label: 'Light Brown' },
    { value: '663300', label: 'Dark Brown' },
    { value: '000000', label: 'Black' },
    { value: '999999', label: 'Gray' },
    { value: 'cccccc', label: 'Light Gray' },
    { value: 'ffffff', label: 'White' },
    { value: '424153', label: 'Dark Gray' },
]

export async function searchWallhaven(params: WallhavenSearchParams = {}): Promise<WallhavenResponse> {
    const searchParams = new URLSearchParams()
    if (params.q) searchParams.set('q', params.q)
    if (params.categories) searchParams.set('categories', params.categories)
    if (params.purity) searchParams.set('purity', params.purity)
    if (params.sorting) searchParams.set('sorting', params.sorting)
    if (params.order) searchParams.set('order', params.order)
    if (params.topRange && params.sorting === 'toplist') searchParams.set('topRange', params.topRange)
    if (params.atleast) searchParams.set('atleast', params.atleast)
    if (params.resolutions) searchParams.set('resolutions', params.resolutions)
    if (params.ratios) searchParams.set('ratios', params.ratios)
    if (params.color) searchParams.set('colors', params.color)
    if (params.page) searchParams.set('page', String(params.page))
    if (params.seed) searchParams.set('seed', params.seed)

    const res = await fetch(`${API_URL}?${searchParams}`)
    if (!res.ok) throw new Error(`Wallhaven API error: ${res.status}`)
    return res.json()
}
