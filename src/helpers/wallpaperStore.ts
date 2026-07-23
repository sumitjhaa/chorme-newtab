import type { WallhavenWallpaper } from './wallhaven'

let searchPool: WallhavenWallpaper[] = []

export function setSearchPool(results: WallhavenWallpaper[]) {
    searchPool = results
}

export function clearSearchPool() {
    searchPool = []
}

export function getRandomFromSearch(): WallhavenWallpaper | null {
    if (!searchPool.length) return null
    return searchPool[Math.floor(Math.random() * searchPool.length)]
}
