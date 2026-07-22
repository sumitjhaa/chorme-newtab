/**
  * @fileoverview Search bar widget with engine selection and suggestions.
  */

import { useState, useCallback, useRef, useEffect } from 'react'
import { SEARCH_ENGINES } from '../constants'
import { useSettings } from '../hooks/useSettings'
import { EngineGrid, ENGINE_ICONS, SuggestionsDropdown } from './search'
import type { SearchEngineKey } from '../types'

/**
  * Search bar widget with engine selection, suggestions, and keyboard navigation.
  * Spans two columns in the layout.
  * 
  * @example <SearchBar />
  */
export default function SearchBar() {
    const { settings, update } = useSettings()
    const [query, setQuery] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [suggestionPos, setSuggestionPos] = useState({ top: 0, left: 0, width: 0 })
    const [enginePos, setEnginePos] = useState({ top: 0, left: 0, width: 0 })
    const dropdownRef = useRef<HTMLDivElement>(null)
    const engineGridRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const formRef = useRef<HTMLFormElement>(null)

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
        function handleClickOutside(e: MouseEvent) {
            const inDropdown = dropdownRef.current?.contains(e.target as Node)
            const inEngine = engineGridRef.current?.contains(e.target as Node)
            if (!inDropdown && !inEngine) setIsOpen(false)
        }
        function handleReposition() { if (suggestions.length) updateSuggestionPos() }
        let raf: number
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
                const data = await new Promise<{ suggestions?: string[] } | null>((resolve) => {
                    chrome.runtime.sendMessage({ type: 'FETCH_SUGGESTIONS', query: query.trim() }, (response: unknown) => {
                        resolve(response as { suggestions?: string[] } | null)
                    })
                })
                setSuggestions(data?.suggestions || [])
            } catch { setSuggestions([]) }
        }, 200)
        return () => clearTimeout(timer)
    }, [query, settings.showSuggestions])

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault()
        if (!query.trim()) return
        const selectedEngine = SEARCH_ENGINES[settings.searchEngine as SearchEngineKey]
        const url = `${selectedEngine.url}${encodeURIComponent(query.trim())}`
        if (settings.openInNewTab) {
            window.open(url, '_blank')
        } else {
            window.location.href = url
        }
    }, [query, settings])

    const handleSuggestionClick = useCallback((s: string) => {
        setQuery(s)
        setSuggestions([])
        const selectedEngine = SEARCH_ENGINES[settings.searchEngine as SearchEngineKey]
        const url = `${selectedEngine.url}${encodeURIComponent(s)}`
        if (settings.openInNewTab) {
            window.open(url, '_blank')
        } else {
            window.location.href = url
        }
    }, [settings])

    const handleEngineSelect = useCallback((name: string) => {
        update('searchEngine', name)
        setIsOpen(false)
    }, [update])

    const iconSrc = ENGINE_ICONS[settings.searchEngine as SearchEngineKey]
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
                <SuggestionsDropdown
                    ref={dropdownRef}
                    suggestions={suggestions}
                    position={suggestionPos}
                    onSelect={handleSuggestionClick}
                />
            )}

            {isOpen && (
                <EngineGrid
                    ref={engineGridRef}
                    activeEngine={settings.searchEngine}
                    onSelect={handleEngineSelect}
                    position={enginePos}
                />
            )}
        </form>
    )
}
