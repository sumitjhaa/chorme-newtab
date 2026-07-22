/**
 * @fileoverview Type definitions for wallpaper functionality.
 */

import type { WallpaperSource } from './index'

/** A wallpaper image with metadata */
export interface WallpaperImage {
  /** Full resolution image URL */
  url: string
  /** Thumbnail image URL */
  thumbnail: string
  /** Image source provider */
  source: WallpaperSource
  /** Author name (optional) */
  author?: string
  /** Author profile URL (optional) */
  authorUrl?: string
  /** Image width in pixels */
  width?: number
  /** Image height in pixels */
  height?: number
}

/** Cached collection of wallpaper images */
export interface WallpaperCache {
  /** Array of cached images */
  images: WallpaperImage[]
  /** Cache timestamp */
  timestamp: number
  /** Source provider */
  source: WallpaperSource
}

/** Current wallpaper state */
export interface WallpaperState {
  /** Currently displayed wallpaper */
  current: WallpaperImage | null
  /** Whether loading a new wallpaper */
  loading: boolean
  /** Error message if loading failed */
  error: string | null
}
