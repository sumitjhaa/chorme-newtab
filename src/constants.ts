// @ts-nocheck
export const API_SOURCES = {
  WALLHAVEN: 'wallhaven',
  UNSPLASH: 'unsplash',
  PIXABAY: 'pixabay',
  PICSUM: 'picsum',
  CATBOX: 'catbox',
}

export const STORAGE_KEYS = {
  CURRENT_WALLPAPER: 'currentWallpaper',
  WALLPAPER_SOURCE: 'wallpaperSource',
  SEARCH_ENGINE: 'searchEngine',
  WALLPAPER_CACHE: 'wallpaperCache',
}

export const SEARCH_ENGINES = {
  GOOGLE: { name: 'Google', url: 'https://www.google.com/search?q=' },
  DUCKDUCKGO: { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=' },
  BING: { name: 'Bing', url: 'https://www.bing.com/search?q=' },
  YAHOO: { name: 'Yahoo', url: 'https://search.yahoo.com/search?p=' },
  BRAVE: { name: 'Brave', url: 'https://search.brave.com/search?q=' },
  STARTPAGE: { name: 'Startpage', url: 'https://www.startpage.com/do/search?q=' },
  QWANT: { name: 'Qwant', url: 'https://www.qwant.com/?q=' },
  ECOSIA: { name: 'Ecosia', url: 'https://www.ecosia.org/search?q=' },
  SWISSCOWS: { name: 'Swisscows', url: 'https://swisscows.com/web?query=' },
  MOJEEK: { name: 'Mojeek', url: 'https://www.mojeek.com/search?q=' },
}

export const DEFAULT_REFRESH_INTERVAL = 30 * 60 * 1000

export const BACKGROUND_TYPES = [
  { value: 'images', label: 'Images' },
  { value: 'videos', label: 'Videos' },
  { value: 'local', label: 'Local Files' },
  { value: 'url', label: 'URLs' },
  { value: 'solid', label: 'Solid Color' },
]

export const FREQUENCIES = [
  { value: 'every_tab', label: 'Every Tab' },
  { value: 'every_hour', label: 'Every Hour' },
  { value: 'every_day', label: 'Every Day' },
  { value: 'daylight', label: 'Daylight' },
  { value: 'locked', label: 'Locked' },
]

export const TEXTURES = [
  'Grain', 'Vector grain', 'Diagonal dots', 'Vertical dots',
  'Topographic', 'Aztec', 'Checkerboard', 'Isometric',
  'Circuit board', 'Tic-tac-toe', 'Endless clouds', 'Waves',
  'Honeycomb', 'Grid', 'Vertical lines', 'Horizontal lines',
  'Diagonal lines', 'Vertical stripes', 'Horizontal stripes',
  'Diagonal stripes', 'None',
]
