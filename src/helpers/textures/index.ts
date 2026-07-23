export { TEXTURE_CONFIGS, type TextureConfig, type TextureRange } from './config'
export { isSVGTexture, generateSVGTexture } from './svg'
import { isSVGTexture, generateSVGTexture } from './svg'

export function getTextureBackgroundImage(name: string, opacity: number, size: number): string {
    return isSVGTexture(name) ? generateSVGTexture(name, opacity, size) : ''
}
