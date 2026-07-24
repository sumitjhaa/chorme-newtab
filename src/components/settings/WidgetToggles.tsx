/**
  * @fileoverview Widget visibility toggles panel.
  */

import { useState, useEffect, useCallback, memo } from 'react'
import { useSettings } from '../../hooks/useSettings'
import { useTranslation } from '../../hooks/useTranslation'
import { useLists } from '../../hooks/useLists'
import { ToggleSwitch } from '../ui/ToggleSwitch'

/** Sticky note item type */
interface StickyNoteItem {
    id: string
    html: string
    colorIdx: number
}

/**
  * Load sticky notes from localStorage.
  * @returns Array of sticky note items
  */
function loadNotes(): StickyNoteItem[] {
    try {
        const data = localStorage.getItem('newtab_sticky')
        return data ? JSON.parse(data) : []
    } catch { return [] }
}

/**
  * Widget visibility toggles with add controls for notes and lists.
  *
  * @example <WidgetToggles />
  */
function WidgetToggles() {
    const { settings, update } = useSettings()
    const { t } = useTranslation()
    const { addList } = useLists()
    const [notes, setNotes] = useState<StickyNoteItem[]>(loadNotes)

    useEffect(() => {
        function readNotes() {
            try {
                const data = JSON.parse(localStorage.getItem('newtab_sticky') || '[]')
                if (Array.isArray(data)) setNotes(data as StickyNoteItem[])
            } catch {}
        }
        window.addEventListener('sticky-update', readNotes)
        return () => {
            window.removeEventListener('sticky-update', readNotes)
        }
    }, [])

    const handleAddNote = useCallback(() => {
        if (notes.length >= 10) return
        if (notes.some((n: StickyNoteItem) => !n.html.replace(/<[^>]+>/g, '').trim())) return
        const updated = [...notes, { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8), html: '', colorIdx: notes.length % 6 }]
        setNotes(updated)
        localStorage.setItem('newtab_sticky', JSON.stringify(updated))
        window.dispatchEvent(new Event('sticky-update'))
        if (!settings.showStickyNote) update('showStickyNote', true)
    }, [notes, settings.showStickyNote, update])

    const handleAddList = useCallback(() => {
        if (settings.listIds.length >= 10) return
        const id = addList()
        update('listIds', [...settings.listIds, id])
        if (!settings.showList) update('showList', true)
    }, [settings.listIds, settings.showList, addList, update])

    const toggleCalendarWidget = useCallback(() => {
        update('showCalendarWidget', !settings.showCalendarWidget)
    }, [settings.showCalendarWidget, update])

    const toggleWhiteboard = useCallback(() => {
        update('showWhiteboard', !settings.showWhiteboard)
    }, [settings.showWhiteboard, update])

    const hasEmptyNote = notes.some((n: StickyNoteItem) => !n.html.replace(/<[^>]+>/g, '').trim())

    return (
        <div className="settings-groups">
            <div className="settings-group-inline">
                <span className="settings-group-inline-title">{t('calendar')}</span>
                <ToggleSwitch
                    checked={settings.showCalendarWidget}
                    onChange={toggleCalendarWidget}
                />
            </div>
            <div className="settings-group-inline">
                <span className="settings-group-inline-title">{t('whiteboard')}</span>
                <ToggleSwitch
                    checked={settings.showWhiteboard}
                    onChange={toggleWhiteboard}
                />
            </div>
            <div className="settings-group-inline">
                <span className="settings-group-inline-title">{t('stickyNote')}</span>
                <div className="widget-inline-controls">
                    <span className="setting-dashed-btn-count">{notes.length}/10</span>
                    <button className="sticky-add-btn" onClick={handleAddNote} title="Add note" disabled={notes.length >= 10 || hasEmptyNote}>
                        <span className="sticky-add-label">Add</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div className="settings-group-inline">
                <span className="settings-group-inline-title">{t('lists')}</span>
                <div className="widget-inline-controls">
                    <span className="setting-dashed-btn-count">{settings.listIds.length}/10</span>
                    <button className="sticky-add-btn" onClick={handleAddList} title="Add list" disabled={settings.listIds.length >= 10}>
                        <span className="sticky-add-label">Add</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default memo(WidgetToggles)
