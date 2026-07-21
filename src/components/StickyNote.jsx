import { useState, useEffect, useRef, memo, useCallback } from 'react'
import { useTranslation } from '../hooks/useTranslation.js'

const COLORS = [
  { name: 'Pink',    bg: 'rgba(250, 227, 227, 0.65)' },
  { name: 'Yellow',  bg: 'rgba(255, 248, 198, 0.65)' },
  { name: 'Green',   bg: 'rgba(212, 237, 218, 0.65)' },
  { name: 'Blue',    bg: 'rgba(214, 234, 248, 0.65)' },
  { name: 'Purple',  bg: 'rgba(232, 218, 239, 0.65)' },
  { name: 'Orange',  bg: 'rgba(253, 235, 208, 0.65)' },
]

function complementTape(rgba) {
  const m = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (!m) return 'rgba(180,180,180,0.35)'
  const r = 255 - +m[1], g = 255 - +m[2], b = 255 - +m[3]
  return `rgba(${r},${g},${b},0.35)`
}

function parseMd(md) {
  if (!md) return ''
  let html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  html = html.replace(/~~(.+?)~~/g, '<del>$1</del>')
  html = html.replace(/`(.+?)`/g, '<code>$1</code>')
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
  const lines = html.split('\n')
  let inList = false
  const processed = []
  for (const line of lines) {
    if (/^[-*] (.+)$/.test(line)) {
      if (!inList) { processed.push('<ul>'); inList = true }
      processed.push(`<li>${line.replace(/^[-*] (.+)$/, '$1')}</li>`)
    } else {
      if (inList) { processed.push('</ul>'); inList = false }
      if (line.trim() === '') processed.push('<br/>')
      else processed.push(line)
    }
  }
  if (inList) processed.push('</ul>')
  return processed.join('\n')
}

function loadNotes() {
  try {
    const data = JSON.parse(localStorage.getItem('newtab_sticky') || 'null')
    if (Array.isArray(data)) return data
    if (data && typeof data === 'object') return [{ html: data.html || data.text || '', colorIdx: data.colorIdx ?? 0 }]
    return []
  } catch { return [] }
}

function saveNotes(notes) {
  localStorage.setItem('newtab_sticky', JSON.stringify(notes))
  window.dispatchEvent(new Event('sticky-update'))
}

function StickyNoteEditor({ note, index, onChange, onDelete }) {
  const { t } = useTranslation()
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const editorRef = useRef(null)

  useEffect(() => {
    if (editing && editorRef.current) {
      const plain = note.html.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '')
      editorRef.current.innerText = plain
      editorRef.current.focus()
      const range = document.createRange()
      range.selectNodeContents(editorRef.current)
      range.collapse(false)
      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(range)
    }
  }, [editing])

  function handleBlur() {
    if (editorRef.current) {
      const raw = editorRef.current.innerText
      onChange(index, { ...note, html: parseMd(raw) })
    }
    setEditing(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') editorRef.current?.blur()
  }

  function cycleColor() {
    onChange(index, { ...note, colorIdx: (note.colorIdx + 1) % COLORS.length })
  }

  function handleDelete() {
    if (!note.html.replace(/<[^>]+>/g, '').trim()) {
      onDelete(index)
    } else if (confirmDelete) {
      onDelete(index)
    } else {
      setConfirmDelete(true)
    }
  }

  return (
    <div className="sticky-note" style={{ background: COLORS[note.colorIdx].bg }}>
      <div className="sticky-tape" style={{ background: complementTape(COLORS[note.colorIdx].bg) }} />
      <div className="sticky-fold" />

      <div className="sticky-controls">
        <button className="sticky-ctrl-btn" onClick={cycleColor} title="Change color">
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
        <div
          ref={editorRef}
          className="sticky-text sticky-editor"
          contentEditable
          suppressContentEditableWarning
          spellCheck={false}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <div
          className="sticky-text sticky-preview"
          onDoubleClick={() => setEditing(true)}
          dangerouslySetInnerHTML={{ __html: note.html || `<span class="sticky-placeholder">${t('writeSomething')}</span>` }}
        />
      )}
    </div>
  )
}

function StickyNote() {
  const [notes, setNotes] = useState(loadNotes)
  const mountedRef = useRef(false)

  useEffect(() => {
    setNotes(prev => {
      const saved = loadNotes()
      if (saved.length > 0 && prev.length === 0) return saved
      return prev
    })
    function onStickyUpdate() {
      setNotes(loadNotes())
    }
    window.addEventListener('sticky-update', onStickyUpdate)
    mountedRef.current = true
    return () => window.removeEventListener('sticky-update', onStickyUpdate)
  }, [])

  useEffect(() => {
    if (!mountedRef.current) return
    saveNotes(notes)
  }, [notes])

  useEffect(() => {
    if (notes.length === 0) {
      try {
        const data = JSON.parse(localStorage.getItem('newtab_settings') || '{}')
        if (data.showStickyNote) {
          data.showStickyNote = false
          localStorage.setItem('newtab_settings', JSON.stringify(data))
          try { chrome.storage.local.set({ showStickyNote: false }) } catch {}
          window.dispatchEvent(new Event('storage'))
        }
      } catch {}
    }
  }, [notes.length])

  const handleChange = useCallback((i, updated) => {
    setNotes(prev => prev.map((n, idx) => idx === i ? updated : n))
  }, [])

  const handleDelete = useCallback((i) => {
    setNotes(prev => prev.filter((_, idx) => idx !== i))
  }, [])

  return (
    <div className="sticky-notes-container">
      {notes.map((note, i) => (
        <StickyNoteEditor
          key={i}
          note={note}
          index={i}
          onChange={handleChange}
          onDelete={handleDelete}
        />
      ))}
    </div>
  )
}

export default memo(StickyNote)
