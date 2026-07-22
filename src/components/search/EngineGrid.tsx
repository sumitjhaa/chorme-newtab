/**
 * @fileoverview Search engine selection grid component.
 */

import { forwardRef, memo } from 'react'
import type { SearchEngineKey } from '../../types'
import { SEARCH_ENGINES } from '../../constants'

/** Map of search engine keys to their icon paths */
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

/** Props for the EngineGrid component */
interface EngineGridProps {
  /** Currently active search engine */
  activeEngine: SearchEngineKey
  /** Callback when an engine is selected */
  onSelect: (name: SearchEngineKey) => void
  /** Dropdown position */
  position: { top: number; left: number; width: number }
}

/**
 * Grid of search engine icons for selection.
 * 
 * @example <EngineGrid activeEngine="GOOGLE" onSelect={setEngine} position={pos} />
 */
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

export default memo(EngineGrid)
