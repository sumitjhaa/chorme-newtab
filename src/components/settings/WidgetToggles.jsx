import { useState, useEffect } from 'react'
import { useSettings } from '../../hooks/useSettings.js'
import { useTranslation } from '../../hooks/useTranslation.js'
import ToggleSwitch from '../ToggleSwitch.jsx'

function loadNotes() {
  try {
    const data = localStorage.getItem('newtab_sticky')
    return data ? JSON.parse(data) : []
  } catch { return [] }
}

function loadLists() {
  try {
    const data = localStorage.getItem('newtab_lists')
    return data ? JSON.parse(data) : []
  } catch { return [] }
}

export default function WidgetToggles() {
  const { settings, update } = useSettings()
  const { t } = useTranslation()
  const [notes, setNotes] = useState(loadNotes)
  const [lists, setLists] = useState(loadLists)

  useEffect(() => {
    function readNotes() {
      try {
        const data = JSON.parse(localStorage.getItem('newtab_sticky') || '[]')
        if (Array.isArray(data)) setNotes(data)
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
        if (Array.isArray(data)) setLists(data)
      } catch {}
    }
    window.addEventListener('lists-update', readLists)
    const interval = setInterval(readLists, 500)
    return () => {
      window.removeEventListener('lists-update', readLists)
      clearInterval(interval)
    }
  }, [])

  function handleAddNote() {
    if (notes.length >= 10) return
    if (notes.some(n => !n.html.replace(/<[^>]+>/g, '').trim())) return
    const updated = [...notes, { html: '', colorIdx: notes.length % 6 }]
    setNotes(updated)
    localStorage.setItem('newtab_sticky', JSON.stringify(updated))
    window.dispatchEvent(new Event('sticky-update'))
    if (!settings.showStickyNote) update('showStickyNote', true)
  }

  const hasEmptyNote = notes.some(n => !n.html.replace(/<[^>]+>/g, '').trim())

  function handleAddList() {
    if (lists.length >= 10) return
    if (lists.some(l => !l.title && l.items.length === 0)) return
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
    const updated = [...lists, { id, title: '', items: [] }]
    setLists(updated)
    localStorage.setItem('newtab_lists', JSON.stringify(updated))
    window.dispatchEvent(new Event('lists-update'))
    if (!settings.showList) update('showList', true)
  }

  const hasEmptyList = lists.some(l => !l.title && l.items.length === 0)

  return (
    <div className="settings-groups">
      <div className="settings-group-inline">
        <span className="settings-group-inline-title">{t('calendar')}</span>
        <ToggleSwitch
          checked={settings.showCalendarWidget}
          onChange={() => update('showCalendarWidget', !settings.showCalendarWidget)}
        />
      </div>
      <div className="settings-group-inline">
        <span className="settings-group-inline-title">{t('whiteboard')}</span>
        <ToggleSwitch
          checked={settings.showWhiteboard}
          onChange={() => update('showWhiteboard', !settings.showWhiteboard)}
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
