import { memo } from 'react'
import { API_SOURCES } from '../constants.js'

const SOURCE_LABELS = {
  [API_SOURCES.WALLHAVEN]: 'Wallhaven',
  [API_SOURCES.PICSUM]: 'Picsum',
  [API_SOURCES.PIXABAY]: 'Pixabay',
  [API_SOURCES.CATBOX]: 'Catbox',
}

function Controls({ source, sources, onSourceChange, onRefresh, isLoading, error }) {
  return (
    <div className="controls">
      {error && <div className="error-message">{error}</div>}

      <div className="control-buttons">
        <button
          className="control-btn"
          onClick={onRefresh}
          disabled={isLoading}
          title="Refresh wallpaper"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 16h5v5" />
          </svg>
        </button>

        <select
          className="source-select"
          value={source}
          onChange={(e) => onSourceChange(e.target.value)}
        >
          {sources.map((src) => (
            <option key={src} value={src}>
              {SOURCE_LABELS[src] || src}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default memo(Controls)
