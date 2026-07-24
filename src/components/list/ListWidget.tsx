/**
  * @fileoverview Single flat list widget — URLs only, no nesting.
  */

import { useState, useRef, useEffect, memo } from 'react'
import ListItem from './ListItem'
import type { TodoList, TodoItem } from '../../types/list'
import { generateId } from '../../lib'
import { showToast } from '../../lib/toast'

/** Props for the ListWidget component */
interface ListWidgetProps {
    /** The single todo list */
    list: TodoList
    /** Callback when list is updated */
    onUpdate: (updated: TodoList) => void
    /** Callback to remove this list widget from the board entirely */
    onRemoveWidget: () => void
}

/**
  * Flat list of URLs. One list, no groups, no nesting.
  */
const ListWidget = memo(function ListWidget({ list, onUpdate, onRemoveWidget }: ListWidgetProps) {
    const [editingTitle, setEditingTitle] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const titleRef = useRef<HTMLDivElement>(null)
    const confirmTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Cleanup confirm timer on unmount
    useEffect(() => {
        return () => { if (confirmTimer.current) clearTimeout(confirmTimer.current) }
    }, [])

    useEffect(() => {
        if (editingTitle && titleRef.current) {
            titleRef.current.focus()
            const range = document.createRange()
            range.selectNodeContents(titleRef.current)
            const sel = window.getSelection()
            if (sel) {
                sel.removeAllRanges()
                sel.addRange(range)
            }
        }
    }, [editingTitle])

    function handleTitleBlur() {
        if (!titleRef.current) return
        const t = titleRef.current.textContent?.trim() || ''
        onUpdate({ ...list, title: t, updatedAt: Date.now() })
        setEditingTitle(false)
    }

    function handleTitleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter') { e.preventDefault(); titleRef.current?.blur() }
        if (e.key === 'Escape') { setEditingTitle(false) }
    }

    function updateItem(id: string, item: TodoItem) {
        // Duplicate URL check: only when URL is being set for the first time
        const existing = list.items.find(it => it.id === id)
        if (item.url && (!existing || !existing.url)) {
            const normalized = item.url.trim().toLowerCase()
            const isDuplicate = list.items.some(it => it.id !== id && it.url && it.url.trim().toLowerCase() === normalized)
            if (isDuplicate) {
                showToast('Link already present', 'warning')
                // Remove the empty placeholder item that was created
                onUpdate({ ...list, items: list.items.filter(it => it.id !== id), updatedAt: Date.now() })
                return
            }
        }
        const items = list.items.map(it => it.id === id ? item : it)
        onUpdate({ ...list, items, updatedAt: Date.now() })
    }

    function removeItem(id: string) {
        onUpdate({ ...list, items: list.items.filter(it => it.id !== id), updatedAt: Date.now() })
    }

    function handleAddWithDuplicateCheck() {
        if (list.items.length >= 50) return
        const newItem = {
            id: generateId(),
            url: '',
            customTitle: '',
            fetchedTitle: '',
            completed: false,
            createdAt: Date.now(),
        }
        // Check for duplicate empty-placeholder items (already adding)
        const hasEmpty = list.items.some(it => !it.url)
        if (hasEmpty) return
        onUpdate({
            ...list,
            items: [...list.items, newItem],
            updatedAt: Date.now(),
        })
    }

    function openAllLinks() {
        const urls = list.items.filter(it => it.url).map(it => it.url!)
        if (urls.length === 0) return
        if (!window.confirm(`Open ${urls.length} ${urls.length === 1 ? 'link' : 'links'}?`)) return
        // Open first in same tab, rest in new tabs to avoid popup blocker
        if (urls.length === 1) {
            window.open(urls[0], '_blank')
            return
        }
        const w = window.open(urls[0], '_blank')
        if (w) {
            for (let i = 1; i < urls.length; i++) {
                window.open(urls[i], '_blank')
            }
        } else {
            // Popup blocked — fallback to navigating current tab
            window.location.href = urls[0]
        }
    }

    function handleDelete() {
        if (confirmDelete) {
            if (confirmTimer.current) clearTimeout(confirmTimer.current)
            setConfirmDelete(false)
            onRemoveWidget()
            return
        }
        setConfirmDelete(true)
        confirmTimer.current = setTimeout(() => {
            setConfirmDelete(false)
            confirmTimer.current = null
        }, 3000)
    }

    const hasEmptyUrl = list.items.some(it => !it.url)

    return (
        <div className="list-widget">
            <div className="list-header">
                {editingTitle ? (
                    <div
                        ref={titleRef}
                        className="list-title list-title-edit"
                        contentEditable
                        suppressContentEditableWarning
                        spellCheck={false}
                        onBlur={handleTitleBlur}
                        onKeyDown={handleTitleKeyDown}
                    />
                ) : (
                    <div
                        className="list-title"
                        onDoubleClick={() => setEditingTitle(true)}
                    >
                        {list.title || <span className="list-title-placeholder">Lists</span>}
                    </div>
                )}
                <div className="list-header-actions">
                    {list.items.length > 0 && (
                        <button className="list-action-btn" onClick={openAllLinks} title="Open all links">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                            </svg>
                        </button>
                    )}
                    <button
                        className={`list-action-btn list-delete-btn${confirmDelete ? ' confirm' : ''}`}
                        onClick={handleDelete}
                        title={confirmDelete ? 'Click again to delete' : 'Delete list'}
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                    </button>
                </div>
            </div>
            {list.items.length > 0 && (
                <div className="list-items">
                    {list.items.map(item => (
                        <ListItem
                            key={item.id}
                            item={item}
                            onChange={(updated) => updateItem(item.id, updated)}
                            onDelete={() => removeItem(item.id)}
                            onAddBelow={handleAddWithDuplicateCheck}
                        />
                    ))}
                </div>
            )}
            <div className="list-footer">
                <button className="list-add-item" onClick={handleAddWithDuplicateCheck} disabled={hasEmptyUrl} title="Add URL">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    <span>Add URL</span>
                </button>
            </div>
        </div>
    )
})

export default ListWidget
