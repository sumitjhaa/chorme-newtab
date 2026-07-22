/**
 * @fileoverview Search suggestions dropdown component.
 */

import { forwardRef, memo } from 'react'

/** Props for the SuggestionsDropdown component */
interface SuggestionsDropdownProps {
  /** List of suggestion strings */
  suggestions: string[]
  /** Dropdown position */
  position: { top: number; left: number; width: number }
  /** Callback when a suggestion is selected */
  onSelect: (suggestion: string) => void
}

/**
 * Dropdown list of search suggestions.
 * 
 * @example <SuggestionsDropdown suggestions={["query"]} position={pos} onSelect={setQuery} />
 */
const SuggestionsDropdown = forwardRef<HTMLDivElement, SuggestionsDropdownProps>(
  ({ suggestions, position, onSelect }, ref) => {
    return (
      <div className="suggestions-dropdown" ref={ref} style={{
        top: position.top,
        left: position.left,
        width: position.width,
      }}>
        {suggestions.map((s, i) => (
          <button
            key={i}
            type="button"
            className="suggestion-item"
            onClick={() => onSelect(s)}
          >
            {s}
          </button>
        ))}
      </div>
    )
  }
)

SuggestionsDropdown.displayName = 'SuggestionsDropdown'

export default memo(SuggestionsDropdown)
