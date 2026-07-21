import { useState, useRef, useEffect } from 'react'
import ListItem from './ListItem.jsx'
import './list.css'

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

function ListGroup({ list, index, onChange, onDelete }) {
  const [editingTitle, setEditingTitle] = useState(false)
  const titleRef = useRef(null)

  useEffect(() => {
    if (editingTitle && titleRef.current) {
      titleRef.current.focus()
      const range = document.createRange()
      range.selectNodeContents(titleRef.current)
      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(range)
    }
  }, [editingTitle])

  function handleTitleBlur() {
    if (!titleRef.current) return
    const t = titleRef.current.textContent.trim()
    onChange({ ...list, title: t })
    setEditingTitle(false)
  }

  function handleTitleKeyDown(e) {
    if (e.key === 'Enter') { e.preventDefault(); titleRef.current?.blur() }
    if (e.key === 'Escape') { setEditingTitle(false) }
  }

  function addItem() {
    if (list.items.length >= 50) return
    onChange({ ...list, items: [...list.items, { id: generateId(), url: '', title: '' }] })
  }

  function updateItem(i, item) {
    const items = list.items.map((it, idx) => idx === i ? item : it)
    onChange({ ...list, items })
  }

  function removeItem(i) {
    onChange({ ...list, items: list.items.filter((_, idx) => idx !== i) })
  }

  const hasEmptyItem = list.items.some(it => !it.url)

  return (
    <div className="list-group">
      <div className="list-group-header">
        <span className="list-group-num">{index + 1}</span>
        {editingTitle ? (
          <div
            ref={titleRef}
            className="list-group-title list-group-title-edit"
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
          />
        ) : (
          <div className="list-group-title" onDoubleClick={() => setEditingTitle(true)}>
            {list.title || <span className="list-group-placeholder">Untitled list</span>}
          </div>
        )}
        <button className="list-item-delete" onClick={() => list.items.forEach(it => { if (it.url) window.open(it.url, '_blank') })} title="Open all links" style={{ opacity: list.items.length ? undefined : 0 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </button>
        <button className="list-item-delete" onClick={onDelete} title="Delete list">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      </div>
      <div className="list-items">
        {list.items.map((item, i) => (
          <ListItem
            key={item.id}
            item={item}
            onChange={(updated) => updateItem(i, updated)}
            onDelete={() => removeItem(i)}
            onAddBelow={addItem}
          />
        ))}
      </div>
      <button className="list-add-item" onClick={addItem} disabled={hasEmptyItem} title="Add URL">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        <span>Add URL</span>
      </button>
    </div>
  )
}

export default function ListWidget({ lists, onUpdate, onRemove }) {
  return (
    <div className="list-widget">
      {lists.map((list, i) => (
        <ListGroup
          key={list.id}
          list={list}
          index={i}
          onChange={(updated) => onUpdate(i, updated)}
          onDelete={() => onRemove(i)}
        />
      ))}
    </div>
  )
}
