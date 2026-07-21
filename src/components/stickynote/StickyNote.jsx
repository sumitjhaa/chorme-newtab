import { memo } from 'react'
import { useNotes } from './hooks/useNotes.js'
import StickyNoteCard from './StickyNoteCard.jsx'

function StickyNote() {
  const { notes, update, remove } = useNotes()

  return (
    <div className="sticky-notes-container">
      {notes.map((note, i) => (
        <StickyNoteCard key={i} note={note} index={i} onChange={update} onDelete={remove} />
      ))}
    </div>
  )
}

export default memo(StickyNote)
