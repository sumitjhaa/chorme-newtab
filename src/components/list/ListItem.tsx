/**
  * @fileoverview Individual todo list item component with auto-fetched titles.
  */

import { useState, useRef, useEffect, useCallback, memo } from 'react'
import type { TodoItem } from '../../types/list'

/** In-memory cache for fetched page titles (avoids refetching same URL). */
const titleCache = new Map<string, string>()

function getFaviconUrl(url: string): string | null {
    try {
        const u = new URL(url)
        return `https://www.google.com/s2/favicons?domain=${u.hostname}&sz=32`
    } catch { return null }
}

function getHostname(url: string): string {
    try {
        return new URL(url).hostname.replace('www.', '')
    } catch { return url }
}

async function fetchPageTitle(url: string): Promise<string> {
    const cached = titleCache.get(url)
    if (cached !== undefined) return cached
    try {
        const response: unknown = await chrome.runtime.sendMessage({ type: 'FETCH_TITLE', url })
        const title = (response as { title?: string })?.title || ''
        titleCache.set(url, title)
        return title
    } catch {
        titleCache.set(url, '')
        return ''
    }
}

/** Props for the ListItem component */
interface ListItemProps {
    /** Todo item data */
    item: TodoItem
    /** Callback when item is updated */
    onChange: (updated: TodoItem) => void
    /** Callback when item is deleted */
    onDelete: () => void
    /** Callback to add a new item below */
    onAddBelow: () => void
}

/**
  * Individual todo list item with edit/delete functionality.
  * Auto-fetches page titles and supports custom naming.
  */
export default memo(function ListItem({ item, onChange, onDelete, onAddBelow }: ListItemProps) {
    const [editing, setEditing] = useState(!item.url)
    const [fetchedTitle, setFetchedTitle] = useState(item.fetchedTitle || '')
    const urlRef = useRef<HTMLInputElement>(null)
    const titleRef = useRef<HTMLDivElement>(null)

    // Auto-fetch page title when URL is set but no title exists
    useEffect(() => {
        if (item.url && !item.customTitle && !item.fetchedTitle) {
            fetchPageTitle(item.url).then(title => {
                if (title) {
                    setFetchedTitle(title)
                    onChange({ ...item, fetchedTitle: title })
                }
            })
        }
    }, [item.url, item.customTitle, item.fetchedTitle])

    // Focus management + pre-fill contentEditable with current title
    useEffect(() => {
        if (!editing) return
        if (!item.url && urlRef.current) {
            urlRef.current.focus()
        } else if (item.url && titleRef.current) {
            titleRef.current.textContent = item.customTitle || fetchedTitle || getHostname(item.url)
            titleRef.current.focus()
            const range = document.createRange()
            range.selectNodeContents(titleRef.current)
            const sel = window.getSelection()
            if (sel) {
                sel.removeAllRanges()
                sel.addRange(range)
            }
        }
    }, [editing])

    const displayTitle = item.customTitle || fetchedTitle || getHostname(item.url)

    const handleUrlKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            let url = urlRef.current?.value.trim() || ''
            if (url && !/^https?:\/\//i.test(url)) url = 'https://' + url
            if (url) {
                onChange({ ...item, url, customTitle: '', fetchedTitle: '' })
            }
            setEditing(false)
        }
        if (e.key === 'Escape') {
            if (!item.url) onDelete()
            else setEditing(false)
        }
    }, [item, onChange, onDelete])

    const handleTitleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            const newTitle = titleRef.current?.textContent?.trim() || ''
            onChange({ ...item, customTitle: newTitle })
            setEditing(false)
            onAddBelow()
        }
        if (e.key === 'Escape') {
            setEditing(false)
        }
    }, [item, onChange, onAddBelow])

    const handleUrlBlur = useCallback(() => {
        if (!urlRef.current) return
        let url = urlRef.current.value.trim()
        if (url && !/^https?:\/\//i.test(url)) url = 'https://' + url
        if (url) {
            onChange({ ...item, url, customTitle: '', fetchedTitle: '' })
        }
        setEditing(false)
    }, [item, onChange])

    const handleTitleBlur = useCallback(() => {
        if (!titleRef.current) return
        const newTitle = titleRef.current.textContent?.trim() || ''
        onChange({ ...item, customTitle: newTitle })
        setEditing(false)
    }, [item, onChange])

    const favicon = item.url ? getFaviconUrl(item.url) : null

    return (
        <div className="list-item">
            <div className="list-item-icon">
                {favicon ? (
                    <img src={favicon} alt="" width="16" height="16" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
                        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                )}
            </div>

            {editing && !item.url ? (
                <input
                    ref={urlRef}
                    className="list-item-input"
                    type="text"
                    placeholder="Paste or type URL..."
                    defaultValue={item.url || ''}
                    onKeyDown={handleUrlKeyDown}
                    onBlur={handleUrlBlur}
                    spellCheck={false}
                />
            ) : editing && item.url ? (
                <div
                    ref={titleRef}
                    className="list-item-input"
                    contentEditable
                    suppressContentEditableWarning
                    spellCheck={false}
                    onKeyDown={handleTitleKeyDown}
                    onBlur={handleTitleBlur}
                />
            ) : (
                <a
                    className="list-item-link"
                    href={item.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => { if (!item.url) { e.preventDefault(); setEditing(true) } }}
                    onDoubleClick={() => setEditing(true)}
                >
                    <span className="list-item-title">{displayTitle}</span>
                    {item.url && <span className="list-item-url">{getHostname(item.url)}</span>}
                </a>
            )}

            <button className="list-item-delete" onClick={onDelete} title="Remove">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>
    )
})
