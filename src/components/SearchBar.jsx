import { useState, useCallback, useRef, useEffect } from 'react'
import { SEARCH_ENGINES } from '../constants.js'
import { useSettings } from '../hooks/useSettings.js'

const ENGINE_ICONS = {
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

export default function SearchBar() {
  const { settings, update } = useSettings()
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [suggestionPos, setSuggestionPos] = useState({ top: 0, left: 0, width: 0 })
  const [enginePos, setEnginePos] = useState({ top: 0, left: 0 })
  const dropdownRef = useRef(null)
  const engineGridRef = useRef(null)
  const inputRef = useRef(null)
  const formRef = useRef(null)

  function updateSuggestionPos() {
    if (formRef.current) {
      const rect = formRef.current.getBoundingClientRect()
      setSuggestionPos({ top: rect.bottom + 4, left: rect.left, width: rect.width })
    }
  }

  function updateEnginePos() {
    const btn = formRef.current?.querySelector('.search-engine-icon')
    if (btn) {
      const rect = btn.getBoundingClientRect()
      setEnginePos({ top: rect.top - 4, left: rect.right - 260, width: 260 })
    }
  }

  useEffect(() => {
    function handleClickOutside(e) {
      const inDropdown = dropdownRef.current?.contains(e.target)
      const inEngine = engineGridRef.current?.contains(e.target)
      if (!inDropdown && !inEngine) setIsOpen(false)
    }
    function handleReposition() { if (suggestions.length) updateSuggestionPos() }
    let raf
    function trackPosition() { if (suggestions.length) { updateSuggestionPos(); raf = requestAnimationFrame(trackPosition) } }
    if (suggestions.length) raf = requestAnimationFrame(trackPosition)
    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('resize', handleReposition)
    window.addEventListener('scroll', handleReposition)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('resize', handleReposition)
      window.removeEventListener('scroll', handleReposition)
    }
  }, [suggestions.length])

  useEffect(() => {
    if (!settings.showSuggestions || !query.trim()) { setSuggestions([]); return }
    updateSuggestionPos()
    const timer = setTimeout(async () => {
      try {
        const data = await chrome.runtime.sendMessage({ type: 'FETCH_SUGGESTIONS', query: query.trim() })
        setSuggestions(data?.suggestions || [])
      } catch { setSuggestions([]) }
    }, 200)
    return () => clearTimeout(timer)
  }, [query, settings.showSuggestions])

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    if (!query.trim()) return
    const selectedEngine = SEARCH_ENGINES[settings.searchEngine]
    const url = `${selectedEngine.url}${encodeURIComponent(query.trim())}`
    if (settings.openInNewTab) {
      window.open(url, '_blank')
    } else {
      window.location.href = url
    }
  }, [query, settings])

  const handleSuggestionClick = useCallback((s) => {
    setQuery(s)
    setSuggestions([])
    const selectedEngine = SEARCH_ENGINES[settings.searchEngine]
    const url = `${selectedEngine.url}${encodeURIComponent(s)}`
    if (settings.openInNewTab) {
      window.open(url, '_blank')
    } else {
      window.location.href = url
    }
  }, [settings])

  const handleEngineSelect = useCallback((name) => {
    update('searchEngine', name)
    setIsOpen(false)
  }, [update])

  const iconSrc = ENGINE_ICONS[settings.searchEngine]
  return (
    <form ref={formRef} className="search-bar" onSubmit={handleSubmit} style={{ width: '100%' }}>
      <div className="search-input-wrapper" style={{
        backdropFilter: `blur(${settings.searchBlur}px)`,
        WebkitBackdropFilter: `blur(${settings.searchBlur}px)`,
      }}>
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder={settings.searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />

        <button
          type="button"
          className="search-engine-icon"
          onClick={() => { setIsOpen(!isOpen); if (!isOpen) updateEnginePos() }}
        >
          <img src={iconSrc} alt="" />
        </button>
      </div>

      {suggestions.length > 0 && (
        <div className="suggestions-dropdown" ref={dropdownRef} style={{
          top: suggestionPos.top,
          left: suggestionPos.left,
          width: suggestionPos.width,
        }}>
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              className="suggestion-item"
              onClick={() => handleSuggestionClick(s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {isOpen && (
        <div className="engine-grid" ref={engineGridRef} style={{
          position: 'fixed',
          top: enginePos.top,
          left: enginePos.left,
          width: enginePos.width,
        }}>
          {Object.keys(SEARCH_ENGINES).map((name) => (
            <button
              key={name}
              type="button"
              className={`engine-grid-item ${settings.searchEngine === name ? 'active' : ''}`}
              onClick={() => handleEngineSelect(name)}
              title={SEARCH_ENGINES[name].name}
            >
              <img src={ENGINE_ICONS[name]} alt="" />
            </button>
          ))}
        </div>
      )}
    </form>
  )
}
