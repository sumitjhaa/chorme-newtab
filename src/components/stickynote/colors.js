export const COLORS = [
  { name: 'Pink',    bg: 'rgba(250, 227, 227, 0.65)' },
  { name: 'Yellow',  bg: 'rgba(255, 248, 198, 0.65)' },
  { name: 'Green',   bg: 'rgba(212, 237, 218, 0.65)' },
  { name: 'Blue',    bg: 'rgba(214, 234, 248, 0.65)' },
  { name: 'Purple',  bg: 'rgba(232, 218, 239, 0.65)' },
  { name: 'Orange',  bg: 'rgba(253, 235, 208, 0.65)' },
]

export function complementTape(rgba) {
  const m = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (!m) return 'rgba(180,180,180,0.35)'
  return `rgba(${255 - +m[1]},${255 - +m[2]},${255 - +m[3]},0.35)`
}
