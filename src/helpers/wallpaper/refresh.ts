import type { BgFrequency } from '../../types'

export function getRefreshInterval(frequency: BgFrequency): number | null {
    switch (frequency) {
        case 'every_tab': return null
        case 'every_hour': return 60 * 60 * 1000
        case 'every_day': return 24 * 60 * 60 * 1000
        case 'daylight': return 12 * 60 * 60 * 1000
        case 'locked': return null
        default: return null
    }
}
