const PIXABAY_API = 'https://pixabay.com/api/'

export async function fetchRandomPixabay() {
  const response = await fetch(
    `${PIXABAY_API}?image_type=photo&orientation=horizontal&min_width=1920&per_page=200`
  )

  if (!response.ok) throw new Error('Pixabay API failed')

  const data = await response.json()
  if (!data.hits || data.hits.length === 0) {
    throw new Error('No wallpapers found')
  }

  const randomIndex = Math.floor(Math.random() * data.hits.length)
  const wallpaper = data.hits[randomIndex]

  return {
    url: wallpaper.largeImageURL,
    thumb: wallpaper.webformatURL,
    source: 'pixabay',
    id: wallpaper.id,
    resolution: `${wallpaper.imageWidth}x${wallpaper.imageHeight}`,
    author: wallpaper.user,
  }
}
