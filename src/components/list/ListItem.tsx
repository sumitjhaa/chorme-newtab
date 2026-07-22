/**
  * @fileoverview Individual todo list item component.
  */

import { useState, useRef, useEffect } from 'react'
import type { TodoItem } from '../../types/list'

/**
  * Get favicon URL for a given URL.
  * @param url - Website URL
  * @returns Favicon URL or null
  */
function getFaviconUrl(url: string): string | null {
    try {
        const u = new URL(url)
        return `https://www.google.com/s2/favicons?domain=${u.hostname}&sz=32`
    } catch { return null }
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
  * 
  * @param props - ListItemProps
  * @example <ListItem item={item} onChange={set} onDelete={del} onAddBelow={add} />
  */
export default function ListItem({ item, onChange, onDelete, onAddBelow }: ListItemProps) {
    const [editing, setEditing] = useState(!item.url)
    const urlRef = useRef<HTMLInputElement>(null)
    const titleRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!editing) return
        if (!item.url && urlRef.current) {
            urlRef.current.focus()
        } else if (item.url && titleRef.current) {
            titleRef.current.focus()
        }
    }, [editing])

    function handleUrlKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter') {
            e.preventDefault()
            let url = urlRef.current?.value.trim() || ''
            if (url && !/^https?:\/\//i.test(url)) url = 'https://' + url
            onChange({ ...item, url, title: item.title || new URL(url).hostname.replace('www.', '') })
            setEditing(false)
        }
        if (e.key === 'Escape') {
            if (!item.url) onDelete()
            else setEditing(false)
        }
    }

    function handleTitleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter') {
            e.preventDefault()
            onChange({ ...item, title: titleRef.current?.textContent?.trim() || '' })
            setEditing(false)
            onAddBelow()
        }
        if (e.key === 'Escape') {
            setEditing(false)
        }
    }

    function handleUrlBlur() {
        if (!urlRef.current) return
        let url = urlRef.current.value.trim()
        if (url && !/^https?:\/\//i.test(url)) url = 'https://' + url
        if (url) {
            onChange({ ...item, url, title: item.title || new URL(url).hostname.replace('www.', '') })
        }
        setEditing(false)
    }

    function handleTitleBlur() {
        if (!titleRef.current) return
        onChange({ ...item, title: titleRef.current.textContent?.trim() || '' })
        setEditing(false)
    }

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
                    <span className="list-item-title">{item.title || 'Untitled'}</span>
                    {item.url && <span className="list-item-url">{new URL(item.url).hostname.replace('www.', '')}</span>}
                </a>
            )}

            <button className="list-item-delete" onClick={onDelete} title="Remove">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>
    )
}
