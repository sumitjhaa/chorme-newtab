// @ts-nocheck
import { useState, useEffect, useRef } from 'react'
import { useTranslation } from '../../hooks/useTranslation'
import { COLORS, complementTape } from './colors'
import { parseMd } from './markdown'

export default function StickyNoteCard({ note, index, onChange, onDelete }) {
  const { t } = useTranslation()
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!editing || !ref.current) return
    ref.current.innerText = note.html.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '')
    ref.current.focus()
    const range = document.createRange()
    range.selectNodeContents(ref.current)
    range.collapse(false)
    const sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange(range)
  }, [editing])

  function handleBlur() {
    if (ref.current) onChange(index, { ...note, html: parseMd(ref.current.innerText) })
    setEditing(false)
  }

  function handleDelete() {
    const empty = !note.html.replace(/<[^>]+>/g, '').trim()
    if (empty || confirmDelete) onDelete(index)
    else setConfirmDelete(true)
  }

  const bg = COLORS[note.colorIdx]?.bg || COLORS[0].bg

  return (
    <div className="sticky-note" style={{ background: bg }}>
      <div className="sticky-tape" style={{ background: complementTape(bg) }} />
      <div className="sticky-fold" />

      <div className="sticky-controls">
        <button className="sticky-ctrl-btn" onClick={() => onChange(index, { ...note, colorIdx: (note.colorIdx + 1) % COLORS.length })} title="Change color">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
          </svg>
        </button>
        <button
          className={`sticky-ctrl-btn sticky-ctrl-delete ${confirmDelete ? 'confirm' : ''}`}
          onClick={handleDelete}
          onMouseLeave={() => setConfirmDelete(false)}
          title={confirmDelete ? 'Click to confirm' : 'Delete note'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      </div>

      {editing ? (
        <div ref={ref} className="sticky-text sticky-editor" contentEditable suppressContentEditableWarning spellCheck={false} onBlur={handleBlur} onKeyDown={(e) => e.key === 'Escape' && ref.current?.blur()} />
      ) : (
        <div className="sticky-text sticky-preview" onDoubleClick={() => setEditing(true)} dangerouslySetInnerHTML={{ __html: note.html || `<span class="sticky-placeholder">${t('writeSomething')}</span>` }} />
      )}
    </div>
  )
}
