const SVG_TEXTURES = ['Grain', 'Vector grain']

export function isSVGTexture(name: string): boolean {
    return SVG_TEXTURES.includes(name)
}

export function generateSVGTexture(name: string, opacity: number, size: number): string {
    const baseFreq = (200 / Math.max(size, 1)).toFixed(2)
    const type = name === 'Grain' ? 'fractalNoise' : 'turbulence'
    const id = name === 'Grain' ? 'n' : 'g'
    const octaves = name === 'Grain' ? 4 : 2

    const svg = `<svg viewBox='0 0 ${size} ${size}' xmlns='http://www.w3.org/2000/svg'>`
        + `<filter id='${id}'><feTurbulence type='${type}' baseFrequency='${baseFreq}' numOctaves='${octaves}' stitchTiles='stitch'/></filter>`
        + `<rect width='100%25' height='100%25' filter='url(%23${id})' opacity='${opacity}'/>`
        + `</svg>`

    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}
