// @ts-nocheck
import type { WallpaperSource } from './index'

export interface WallpaperImage {
  url: string
  thumbnail: string
  source: WallpaperSource
  author?: string
  authorUrl?: string
  width?: number
  height?: number
}

export interface WallpaperCache {
  images: WallpaperImage[]
  timestamp: number
  source: WallpaperSource
}

export interface WallpaperState {
  current: WallpaperImage | null
  loading: boolean
  error: string | null
}
