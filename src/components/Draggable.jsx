import { useState, useCallback, useRef, useEffect } from 'react'

export default function Draggable({ id, col, onDrop, numColumns, children }) {
  const [dragging, setDragging] = useState(false)
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 })
  const [ghostHeight, setGhostHeight] = useState(0)
  const elRef = useRef(null)
  const offset = useRef({ x: 0, y: 0 })
  const onDropRef = useRef(onDrop)
  onDropRef.current = onDrop

  const handleGrabStart = useCallback((clientX, clientY) => {
    const rect = elRef.current.getBoundingClientRect()
    offset.current = { x: clientX - rect.left, y: clientY - rect.top }
    setGhostHeight(rect.height)
    setDragPos({ x: clientX - offset.current.x, y: clientY - offset.current.y })
    setDragging(true)
  }, [])

  const handleGrabMouseDown = useCallback((e) => {
    if (e.button !== 0) return
    e.preventDefault()
    e.stopPropagation()
    handleGrabStart(e.clientX, e.clientY)
  }, [handleGrabStart])

  const handleGrabTouchStart = useCallback((e) => {
    e.stopPropagation()
    const touch = e.touches[0]
    handleGrabStart(touch.clientX, touch.clientY)
  }, [handleGrabStart])

  useEffect(() => {
    if (!dragging) return

    const handleMove = (e) => {
      const clientX = e.clientX ?? e.touches?.[0]?.clientX
      const clientY = e.clientY ?? e.touches?.[0]?.clientY
      if (clientX == null || clientY == null) return
      setDragPos({ x: clientX - offset.current.x, y: clientY - offset.current.y })
    }

    const handleUp = (e) => {
      const clientX = e.clientX ?? e.changedTouches?.[0]?.clientX
      const clientY = e.clientY ?? e.changedTouches?.[0]?.clientY
      if (clientX == null || clientY == null) {
        setDragging(false)
        return
      }

      const columns = document.querySelectorAll('.kanban-column')
      let targetCol = col
      let targetOrder = 0

      columns.forEach((colEl, i) => {
        const rect = colEl.getBoundingClientRect()
        if (clientX >= rect.left && clientX <= rect.right) {
          targetCol = i
          const inner = colEl.querySelector('.kanban-column-inner')
          if (!inner) return
          const kids = Array.from(inner.children).filter(
            c => !c.classList.contains('is-dragging')
          )
          targetOrder = kids.length
          for (let j = 0; j < kids.length; j++) {
            const childRect = kids[j].getBoundingClientRect()
            const midY = childRect.top + childRect.height / 2
            if (clientY < midY) {
              targetOrder = j
              break
            }
          }
        }
      })

      onDropRef.current(id, targetCol, targetOrder)
      setDragging(false)
    }

    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleUp)
    document.addEventListener('touchmove', handleMove, { passive: false })
    document.addEventListener('touchend', handleUp)

    return () => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleUp)
      document.removeEventListener('touchmove', handleMove)
      document.removeEventListener('touchend', handleUp)
    }
  }, [dragging, id, col])

  return (
    <div
      ref={elRef}
      className={`draggable${dragging ? ' is-dragging' : ''}`}
    >
      {dragging && (
        <div className="drag-ghost" style={{ height: ghostHeight }} />
      )}

      <div
        className={`drag-content${dragging ? ' floating' : ''}`}
        style={dragging ? {
          position: 'fixed',
          left: dragPos.x,
          top: dragPos.y,
          width: elRef.current?.offsetWidth,
          zIndex: 9999,
          pointerEvents: 'none',
        } : undefined}
      >
        <button
          className="drag-handle"
          onMouseDown={handleGrabMouseDown}
          onTouchStart={handleGrabTouchStart}
          aria-label="Drag to move"
        >
          <svg width="16" height="16" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 2a2 2 0 10.001 4.001A2 2 0 007 2zm0 6a2 2 0 10.001 4.001A2 2 0 007 8zm0 6a2 2 0 10.001 4.001A2 2 0 007 14zm6-8a2 2 0 10-.001-4.001A2 2 0 0013 6zm0 2a2 2 0 10.001 4.001A2 2 0 0013 8zm0 6a2 2 0 10.001 4.001A2 2 0 0013 14z" fill="currentColor"/>
          </svg>
        </button>
        {children}
      </div>
    </div>
  )
}
