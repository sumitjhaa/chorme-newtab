/**
 * @fileoverview Widget visibility toggles panel.
 */

import { useState, useEffect, useCallback, memo } from 'react'
import { useSettings } from '../../hooks/useSettings'
import { useTranslation } from '../../hooks/useTranslation'
import { ToggleSwitch } from '../ui/ToggleSwitch'

/** Sticky note item type */
interface StickyNoteItem {
  /** HTML content */
  html: string
  /** Color index */
  colorIdx: number
}

/** List item type */
interface ListItem {
  /** List ID */
  id: string
  /** List title */
  title: string
  /** List items */
  items: unknown[]
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
 * Load todo lists from localStorage.
 * @returns Array of list items
 */
function loadLists(): ListItem[] {
  try {
    const data = localStorage.getItem('newtab_lists')
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
  const [notes, setNotes] = useState<StickyNoteItem[]>(loadNotes)
  const [lists, setLists] = useState<ListItem[]>(loadLists)

  useEffect(() => {
    function readNotes() {
      try {
        const data = JSON.parse(localStorage.getItem('newtab_sticky') || '[]')
        if (Array.isArray(data)) setNotes(data as StickyNoteItem[])
      } catch {}
    }
    window.addEventListener('sticky-update', readNotes)
    const interval = setInterval(readNotes, 500)
    return () => {
      window.removeEventListener('sticky-update', readNotes)
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    function readLists() {
      try {
        const data = JSON.parse(localStorage.getItem('newtab_lists') || '[]')
        if (Array.isArray(data)) setLists(data as ListItem[])
      } catch {}
    }
    window.addEventListener('lists-update', readLists)
    const interval = setInterval(readLists, 500)
    return () => {
      window.removeEventListener('lists-update', readLists)
      clearInterval(interval)
    }
  }, [])

  const handleAddNote = useCallback(() => {
    if (notes.length >= 10) return
    if (notes.some((n: StickyNoteItem) => !n.html.replace(/<[^>]+>/g, '').trim())) return
    const updated = [...notes, { html: '', colorIdx: notes.length % 6 }]
    setNotes(updated)
    localStorage.setItem('newtab_sticky', JSON.stringify(updated))
    window.dispatchEvent(new Event('sticky-update'))
    if (!settings.showStickyNote) update('showStickyNote', true)
  }, [notes, settings.showStickyNote, update])

  const handleAddList = useCallback(() => {
    if (lists.length >= 10) return
    if (lists.some((l: ListItem) => !l.title && l.items.length === 0)) return
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
    const updated = [...lists, { id, title: '', items: [] }]
    setLists(updated)
    localStorage.setItem('newtab_lists', JSON.stringify(updated))
    window.dispatchEvent(new Event('lists-update'))
    if (!settings.showList) update('showList', true)
  }, [lists, settings.showList, update])

  const toggleCalendarWidget = useCallback(() => {
    update('showCalendarWidget', !settings.showCalendarWidget)
  }, [settings.showCalendarWidget, update])

  const toggleWhiteboard = useCallback(() => {
    update('showWhiteboard', !settings.showWhiteboard)
  }, [settings.showWhiteboard, update])

  const hasEmptyNote = notes.some((n: StickyNoteItem) => !n.html.replace(/<[^>]+>/g, '').trim())
  const hasEmptyList = lists.some((l: ListItem) => !l.title && l.items.length === 0)

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="setting-dashed-btn-count">{notes.length}/10</span>
          <button className="sticky-add-btn" onClick={handleAddNote} title="Add note" disabled={notes.length >= 10 || hasEmptyNote}>
            <span style={{ fontSize: '12px' }}>Add</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
      <div className="settings-group-inline">
        <span className="settings-group-inline-title">{t('lists')}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="setting-dashed-btn-count">{lists.length}/10</span>
          <button className="sticky-add-btn" onClick={handleAddList} title="Add list" disabled={lists.length >= 10 || hasEmptyList}>
            <span style={{ fontSize: '12px' }}>Add</span>
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
