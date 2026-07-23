export function buildWallpaperFilter(blur: number, brightness: number): string {
    const parts: string[] = []
    if (blur > 0) {
        parts.push(`blur(${blur}px)`)
        parts.push('scale(1.05)')
    }
    if (brightness !== 100) parts.push(`brightness(${brightness}%)`)
    return parts.length ? parts.join(' ') : 'none'
}
