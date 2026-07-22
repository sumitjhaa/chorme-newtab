// @ts-nocheck
import { forwardRef } from 'react'
import type { SearchEngineKey } from '../../types'
import { SEARCH_ENGINES } from '../../constants'

const ENGINE_ICONS: Record<SearchEngineKey, string> = {
  GOOGLE: 'icons/engines/google.png',
  DUCKDUCKGO: 'icons/engines/duckduckgo.png',
  BING: 'icons/engines/bing.png',
  YAHOO: 'icons/engines/yahoo.png',
  BRAVE: 'icons/engines/brave.png',
  STARTPAGE: 'icons/engines/startpage.png',
  QWANT: 'icons/engines/qwant.png',
  ECOSIA: 'icons/engines/ecosia.png',
  SWISSCOWS: 'icons/engines/swisscows.png',
  MOJEEK: 'icons/engines/mojeek.png',
}

export { ENGINE_ICONS }

interface EngineGridProps {
  activeEngine: SearchEngineKey
  onSelect: (name: SearchEngineKey) => void
  position: { top: number; left: number; width: number }
}

const EngineGrid = forwardRef<HTMLDivElement, EngineGridProps>(
  ({ activeEngine, onSelect, position }, ref) => {
    return (
      <div ref={ref} className="engine-grid" style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        width: position.width,
      }}>
        {Object.keys(SEARCH_ENGINES).map((name) => (
          <button
            key={name}
            type="button"
            className={`engine-grid-item ${activeEngine === name ? 'active' : ''}`}
            onClick={() => onSelect(name as SearchEngineKey)}
            title={SEARCH_ENGINES[name as SearchEngineKey].name}
          >
            <img src={ENGINE_ICONS[name as SearchEngineKey]} alt="" />
          </button>
        ))}
      </div>
    )
  }
)

EngineGrid.displayName = 'EngineGrid'

export default EngineGrid
