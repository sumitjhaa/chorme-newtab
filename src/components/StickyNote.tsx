import { useState, useEffect, useRef, memo, useCallback } from 'react'
import { useTranslation } from '../hooks/useTranslation'
import { useStorageSync } from '../hooks/useStorageSync'
import { useSettings } from '../hooks/useSettings'

const COLORS = [
    { name: 'Pink',    bg: 'rgba(250, 227, 227, 0.65)' },
    { name: 'Yellow',  bg: 'rgba(255, 248, 198, 0.65)' },
    { name: 'Green',   bg: 'rgba(212, 237, 218, 0.65)' },
    { name: 'Blue',    bg: 'rgba(214, 234, 248, 0.65)' },
    { name: 'Purple',  bg: 'rgba(232, 218, 239, 0.65)' },
    { name: 'Orange',  bg: 'rgba(253, 235, 208, 0.65)' },
]

interface StickyNoteData {
    id: string
    html: string
    colorIdx: number
}

function genId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function migrateNotes(raw: unknown): StickyNoteData[] {
    try {
        const data = typeof raw === 'string' ? JSON.parse(raw || 'null') : raw
        if (Array.isArray(data)) {
            return data.map((n: any) => ({
                id: n.id || genId(),
                html: n.html || n.text || '',
                colorIdx: n.colorIdx ?? 0,
            }))
        }
        if (data && typeof data === 'object') {
            return [{ id: genId(), html: data.html || data.text || '', colorIdx: data.colorIdx ?? 0 }]
        }
        return []
    } catch { return [] }
}

function complementTape(rgba: string): string {
    const m = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
    if (!m) return 'rgba(180,180,180,0.35)'
    const r = 255 - +m[1], g = 255 - +m[2], b = 255 - +m[3]
    return `rgba(${r},${g},${b},0.35)`
}

function isSafeUrl(url: string): boolean {
    try {
        const parsed = new URL(url, 'https://dummy.com')
        return parsed.protocol === 'https:' || parsed.protocol === 'http:' || parsed.protocol === 'mailto:'
    } catch {
        return url.startsWith('/') || url.startsWith('#')
    }
}

function parseMd(md: string): string {
    if (!md) return ''
    let html = md
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')

    html = html.replace(/^```([\s\S]*?)```/gm, '<pre><code>$1</code></pre>')
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
    html = html.replace(/~~(.+?)~~/g, '<del>$1</del>')
    html = html.replace(/`(.+?)`/g, '<code>$1</code>')
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, (_, text, href) => {
        if (!isSafeUrl(href)) return text
        return `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`
    })

    const lines = html.split('\n')
    const processed: string[] = []
    let inList = false
    let listType = ''
    let inBlockquote = false
    let inCodeBlock = false

    for (const line of lines) {
        if (line.startsWith('<pre><code>')) {
            inCodeBlock = true
            processed.push(line)
            continue
        }
        if (line.includes('</code></pre>')) {
            inCodeBlock = false
            processed.push(line)
            continue
        }
        if (inCodeBlock) {
            processed.push(line)
            continue
        }

        const bqMatch = line.match(/^&gt;\s?(.*)$/)
        if (bqMatch) {
            if (!inBlockquote) { processed.push('<blockquote>'); inBlockquote = true }
            processed.push(bqMatch[1] || '<br/>')
            continue
        } else if (inBlockquote) {
            processed.push('</blockquote>')
            inBlockquote = false
        }

        const taskMatch = line.match(/^[-*] \[([ x])\] (.+)$/)
        if (taskMatch) {
            if (!inList) { processed.push('<ul class="task-list">'); inList = true; listType = 'ul' }
            const checked = taskMatch[1] === 'x' ? ' checked' : ''
            processed.push(`<li class="task-item"><input type="checkbox"${checked} disabled/> ${taskMatch[2]}</li>`)
            continue
        }

        const ulMatch = line.match(/^[-*] (.+)$/)
        if (ulMatch) {
            if (!inList || listType !== 'ul') {
                if (inList) processed.push(`</${listType}>`)
                processed.push('<ul>'); inList = true; listType = 'ul'
            }
            processed.push(`<li>${ulMatch[1]}</li>`)
            continue
        }

        const olMatch = line.match(/^\d+\.\s+(.+)$/)
        if (olMatch) {
            if (!inList || listType !== 'ol') {
                if (inList) processed.push(`</${listType}>`)
                processed.push('<ol>'); inList = true; listType = 'ol'
            }
            processed.push(`<li>${olMatch[1]}</li>`)
            continue
        }

        if (inList) { processed.push(`</${listType}>`); inList = false }
        if (line.trim() === '') processed.push('<br/>')
        else processed.push(line)
    }
    if (inList) processed.push(`</${listType}>`)
    if (inBlockquote) processed.push('</blockquote>')
    return processed.join('\n')
}

function wordCount(text: string): number {
    const plain = text.replace(/<[^>]+>/g, '').trim()
    return plain ? plain.split(/\s+/).length : 0
}

const StickyNoteEditor = memo(function StickyNoteEditor({ note, onChange, onDelete }: {
    note: StickyNoteData
    onChange: (id: string, updated: StickyNoteData) => void
    onDelete: (id: string) => void
}) {
    const { t } = useTranslation()
    const [editing, setEditing] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const confirmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const editorRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        return () => { if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current) }
    }, [])

    useEffect(() => {
        if (editing && editorRef.current) {
            const plain = note.html.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '')
            editorRef.current.innerText = plain
            editorRef.current.focus()
            const range = document.createRange()
            range.selectNodeContents(editorRef.current)
            range.collapse(false)
            const sel = window.getSelection()
            if (sel) {
                sel.removeAllRanges()
                sel.addRange(range)
            }
        }
    }, [editing])

    function handleBlur() {
        if (editorRef.current) {
            const raw = editorRef.current.innerText
            onChange(note.id, { ...note, html: parseMd(raw) })
        }
        setEditing(false)
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Escape') editorRef.current?.blur()
    }

    function cycleColor() {
        onChange(note.id, { ...note, colorIdx: (note.colorIdx + 1) % COLORS.length })
    }

    function handleDelete() {
        const plain = note.html.replace(/<[^>]+>/g, '').trim()
        if (!plain) {
            onDelete(note.id)
        } else if (confirmDelete) {
            if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current)
            onDelete(note.id)
        } else {
            setConfirmDelete(true)
            confirmTimerRef.current = setTimeout(() => setConfirmDelete(false), 3000)
        }
    }

    const wc = wordCount(note.html)

    return (
        <div className="sticky-note" style={{ background: COLORS[note.colorIdx].bg }}>
            <div className="sticky-tape" style={{ background: complementTape(COLORS[note.colorIdx].bg) }} />
            <div className="sticky-fold" />

            <div className="sticky-controls">
                <button className="sticky-ctrl-btn" onClick={cycleColor} title={t('color')}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                    </svg>
                </button>
                <button
                    className={`sticky-ctrl-btn sticky-ctrl-delete ${confirmDelete ? 'confirm' : ''}`}
                    onClick={handleDelete}
                    title={confirmDelete ? t('confirmDelete') : t('delete')}
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

            <div className="sticky-footer">
                <span className="sticky-word-count">{wc > 0 ? `${wc} word${wc !== 1 ? 's' : ''}` : ''}</span>
            </div>
        </div>
    )
})

function StickyNote() {
    const { settings, update } = useSettings()
    const { t } = useTranslation()
    const { data: notes, setData: setNotes } = useStorageSync<StickyNoteData[]>('newtab_sticky', 'sticky-update', migrateNotes)

    const maxNotes = 10
    const hasEmpty = notes.some(n => !n.html.replace(/<[^>]+>/g, '').trim())

    useEffect(() => {
        if (notes.length === 0 && settings.showStickyNote) {
            update('showStickyNote', false)
        }
    }, [notes.length, settings.showStickyNote, update])

    const handleChange = useCallback((id: string, updated: StickyNoteData) => {
        setNotes(prev => prev.map(n => n.id === id ? updated : n))
    }, [setNotes])

    const handleDelete = useCallback((id: string) => {
        setNotes(prev => prev.filter(n => n.id !== id))
    }, [setNotes])

    const handleAdd = useCallback(() => {
        if (notes.length >= maxNotes || hasEmpty) return
        const newNote: StickyNoteData = { id: genId(), html: '', colorIdx: notes.length % COLORS.length }
        setNotes(prev => [...prev, newNote])
        if (!settings.showStickyNote) update('showStickyNote', true)
    }, [notes, hasEmpty, settings.showStickyNote, update, setNotes])

    return (
        <div className="sticky-notes-container">
            {notes.map((note) => (
                <StickyNoteEditor
                    key={note.id}
                    note={note}
                    onChange={handleChange}
                    onDelete={handleDelete}
                />
            ))}
            {notes.length < maxNotes && !hasEmpty && (
                <button className="sticky-add-inline" onClick={handleAdd} title={t('addNote')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                </button>
            )}
        </div>
    )
}

export default memo(StickyNote)
