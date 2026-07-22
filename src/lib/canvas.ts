/**
  * @fileoverview Canvas utilities for image processing and color extraction.
  */

/**
  * Extract the dominant color from an image URL by sampling pixels on a canvas.
  * Returns an `{ r, g, b }` object representing the averaged color.
  */
export function extractDominantColor(imgUrl: string): Promise<{ r: number; g: number; b: number }> {
    return new Promise((resolve) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            if (!ctx) {
                resolve({ r: 0, g: 0, b: 0 })
                return
            }
            const size = 50
            canvas.width = size
            canvas.height = size
            ctx.drawImage(img, 0, 0, size, size)
            const data = ctx.getImageData(0, 0, size, size).data

            let r = 0
            let g = 0
            let b = 0
            let count = 0
            for (let i = 0; i < data.length; i += 16) {
                r += data[i]
                g += data[i + 1]
                b += data[i + 2]
                count++
            }
            r = Math.round(r / count)
            g = Math.round(g / count)
            b = Math.round(b / count)

            resolve({ r, g, b })
        }
        img.onerror = () => resolve({ r: 0, g: 0, b: 0 })
        img.src = imgUrl
    })
}
