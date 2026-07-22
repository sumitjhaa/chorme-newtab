// @ts-nocheck
import { forwardRef } from 'react'

interface SuggestionsDropdownProps {
  suggestions: string[]
  position: { top: number; left: number; width: number }
  onSelect: (suggestion: string) => void
}

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

export default SuggestionsDropdown
