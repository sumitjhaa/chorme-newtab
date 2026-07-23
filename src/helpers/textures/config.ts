export interface TextureRange {
    min: number
    max: number
    step: number
    default: number
}

export interface TextureConfig {
    opacity: TextureRange
    size: TextureRange
    hasColor: boolean
}

export const TEXTURE_CONFIGS: Record<string, TextureConfig> = {
    'Grain': {
        opacity: { min: 0.02, max: 0.4, step: 0.01, default: 0.12 },
        size: { min: 100, max: 400, step: 5, default: 200 },
        hasColor: false,
    },
    'Vector grain': {
        opacity: { min: 0.05, max: 0.5, step: 0.01, default: 0.15 },
        size: { min: 100, max: 600, step: 5, default: 350 },
        hasColor: false,
    },
    'Grid': {
        opacity: { min: 0.05, max: 0.6, step: 0.05, default: 0.15 },
        size: { min: 8, max: 100, step: 1, default: 30 },
        hasColor: true,
    },
    'Vertical lines': {
        opacity: { min: 0.05, max: 0.6, step: 0.05, default: 0.12 },
        size: { min: 8, max: 100, step: 1, default: 24 },
        hasColor: true,
    },
    'Horizontal lines': {
        opacity: { min: 0.05, max: 0.6, step: 0.05, default: 0.12 },
        size: { min: 8, max: 100, step: 1, default: 24 },
        hasColor: true,
    },
    'Diagonal lines': {
        opacity: { min: 0.05, max: 0.6, step: 0.05, default: 0.1 },
        size: { min: 8, max: 100, step: 1, default: 16 },
        hasColor: true,
    },
    'Vertical stripes': {
        opacity: { min: 0.05, max: 0.6, step: 0.05, default: 0.12 },
        size: { min: 8, max: 100, step: 1, default: 20 },
        hasColor: true,
    },
    'Horizontal stripes': {
        opacity: { min: 0.05, max: 0.6, step: 0.05, default: 0.12 },
        size: { min: 8, max: 100, step: 1, default: 20 },
        hasColor: true,
    },
    'Diagonal stripes': {
        opacity: { min: 0.05, max: 0.6, step: 0.05, default: 0.12 },
        size: { min: 8, max: 100, step: 1, default: 20 },
        hasColor: true,
    },
    'Diagonal dots': {
        opacity: { min: 0.05, max: 0.6, step: 0.05, default: 0.2 },
        size: { min: 8, max: 80, step: 1, default: 24 },
        hasColor: true,
    },
    'Vertical dots': {
        opacity: { min: 0.05, max: 0.6, step: 0.05, default: 0.2 },
        size: { min: 8, max: 80, step: 1, default: 24 },
        hasColor: true,
    },
    'Topographic': {
        opacity: { min: 0.05, max: 0.6, step: 0.05, default: 0.18 },
        size: { min: 200, max: 800, step: 10, default: 400 },
        hasColor: true,
    },
    'Honeycomb': {
        opacity: { min: 0.05, max: 0.6, step: 0.05, default: 0.15 },
        size: { min: 20, max: 200, step: 5, default: 60 },
        hasColor: true,
    },
    'Isometric': {
        opacity: { min: 0.05, max: 0.6, step: 0.05, default: 0.12 },
        size: { min: 10, max: 80, step: 1, default: 24 },
        hasColor: true,
    },
    'Circuit board': {
        opacity: { min: 0.05, max: 0.6, step: 0.05, default: 0.1 },
        size: { min: 20, max: 200, step: 1, default: 40 },
        hasColor: true,
    },
    'Checkerboard': {
        opacity: { min: 0.05, max: 0.6, step: 0.05, default: 0.1 },
        size: { min: 8, max: 80, step: 1, default: 24 },
        hasColor: true,
    },
    'None': {
        opacity: { min: 0, max: 0, step: 0, default: 0 },
        size: { min: 0, max: 0, step: 0, default: 0 },
        hasColor: false,
    },
}
