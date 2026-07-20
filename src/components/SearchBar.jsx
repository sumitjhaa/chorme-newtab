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

function loadEngine() {
  try {
    const data = JSON.parse(localStorage.getItem('newtab_settings') || '{}')
    return data.searchEngine || 'GOOGLE'
  } catch {
    return 'GOOGLE'
  }
}

function saveEngine(name) {
  try {
    const data = JSON.parse(localStorage.getItem('newtab_settings') || '{}')
    data.searchEngine = name
    localStorage.setItem('newtab_settings', JSON.stringify(data))
  } catch {}
}

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [engine, setEngine] = useState(loadEngine)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    if (!query.trim()) return
    const selectedEngine = SEARCH_ENGINES[engine]
    const url = `${selectedEngine.url}${encodeURIComponent(query.trim())}`
    try {
      const sites = JSON.parse(localStorage.getItem('newtab_recent_sites') || '[]')
      const entry = { url, title: query.trim() }
      const filtered = sites.filter((s) => s.url !== url)
      filtered.unshift(entry)
      localStorage.setItem('newtab_recent_sites', JSON.stringify(filtered.slice(0, 8)))
    } catch {}
    window.location.href = url
  }, [query, engine])

  const handleEngineSelect = useCallback((name) => {
    setEngine(name)
    saveEngine(name)
    setIsOpen(false)
  }, [])

  const iconSrc = ENGINE_ICONS[engine]

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-input-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Search the web..."
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

      {isOpen && (
        <div className="engine-grid" ref={dropdownRef}>
          {Object.keys(SEARCH_ENGINES).map((name) => (
            <button
              key={name}
              type="button"
              className={`engine-grid-item ${engine === name ? 'active' : ''}`}
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
