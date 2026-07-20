const WALLHAVEN_API = 'https://wallhaven.cc/api/v1/search'

export async function fetchRandomWallhaven(category = '010') {
  const params = new URLSearchParams({
    categories: category,
    sorting: 'random',
    purity: '100',
  })

  const response = await fetch(`${WALLHAVEN_API}?${params}`)
  if (!response.ok) throw new Error('Wallhaven API failed')

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
