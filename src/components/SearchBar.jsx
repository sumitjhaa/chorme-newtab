import { useState, useCallback, useRef, useEffect } from 'react'
import { SEARCH_ENGINES } from '../constants.js'

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

function loadSearchSettings() {
  try {
    const data = JSON.parse(localStorage.getItem('newtab_settings') || '{}')
    return {
      searchEngine: data.searchEngine || 'GOOGLE',
      searchPlaceholder: data.searchPlaceholder || 'Search the web...',
      searchWidth: data.searchWidth !== undefined ? data.searchWidth : 500,
      searchBgOpacity: data.searchBgOpacity !== undefined ? data.searchBgOpacity : 0,
      searchBlur: data.searchBlur !== undefined ? data.searchBlur : 20,
      openInNewTab: data.openInNewTab !== undefined ? data.openInNewTab : true,
      showSuggestions: data.showSuggestions !== undefined ? data.showSuggestions : true,
    }
  } catch {
    return {
      searchEngine: 'GOOGLE', searchPlaceholder: 'Search the web...', searchWidth: 500,
      searchBgOpacity: 0, searchBlur: 20, openInNewTab: true, showSuggestions: true,
    }
  }
}

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [settings, setSettings] = useState(loadSearchSettings)
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const dropdownRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    function handleStorage() { setSettings(loadSearchSettings()) }
    window.addEventListener('storage', handleStorage)
    const id = setInterval(handleStorage, 500)
    return () => { window.removeEventListener('storage', handleStorage); clearInterval(id) }
  }, [])

  useEffect(() => {
    if (!settings.showSuggestions || !query.trim()) { setSuggestions([]); return }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(query.trim())}`)
        const data = await res.json()
        setSuggestions(data[1] || [])
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
    try {
      const data = JSON.parse(localStorage.getItem('newtab_settings') || '{}')
      data.searchEngine = name
      localStorage.setItem('newtab_settings', JSON.stringify(data))
      setSettings((p) => ({ ...p, searchEngine: name }))
    } catch {}
    setIsOpen(false)
  }, [])

  const iconSrc = ENGINE_ICONS[settings.searchEngine]
  const bgOpacity = settings.searchBgOpacity / 100
  const bgAlpha = bgOpacity * 0.45

  return (
    <form className="search-bar" onSubmit={handleSubmit} style={{ maxWidth: `${settings.searchWidth}px` }}>
      <div className="search-input-wrapper" style={{
        backdropFilter: `blur(${settings.searchBlur}px)`,
        WebkitBackdropFilter: `blur(${settings.searchBlur}px)`,
        background: `rgba(255,255,255,${bgAlpha})`,
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
          onClick={() => setIsOpen(!isOpen)}
        >
          <img src={iconSrc} alt="" />
        </button>
      </div>

      {suggestions.length > 0 && (
        <div className="suggestions-dropdown" ref={dropdownRef}>
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
        <div className="engine-grid" ref={dropdownRef}>
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
