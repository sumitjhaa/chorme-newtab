import { useState, useCallback, useRef, useEffect } from 'react'

function loadPosition(id, defaultPos) {
  try {
    const data = JSON.parse(localStorage.getItem('newtab_positions') || '{}')
    return data[id] || defaultPos
  } catch {
    return defaultPos
  }
}

function savePosition(id, pos) {
  try {
    const data = JSON.parse(localStorage.getItem('newtab_positions') || '{}')
    data[id] = pos
    localStorage.setItem('newtab_positions', JSON.stringify(data))
  } catch {}
}

export default function Draggable({ id, defaultPosition, children }) {
  const [pos, setPos] = useState(() => loadPosition(id, defaultPosition))
  const [dragging, setDragging] = useState(false)
  const elRef = useRef(null)
  const offset = useRef({ x: 0, y: 0 })
  const posRef = useRef(pos)

  posRef.current = pos

  const handleGrabMouseDown = useCallback((e) => {
    if (e.button !== 0) return
    e.preventDefault()
    e.stopPropagation()
    const rect = elRef.current.getBoundingClientRect()
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
    setDragging(true)
  }, [])

  const handleGrabTouchStart = useCallback((e) => {
    e.stopPropagation()
    const touch = e.touches[0]
    const rect = elRef.current.getBoundingClientRect()
    offset.current = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    }
    setDragging(true)
  }, [])

  useEffect(() => {
    if (!dragging) return

    const getParent = () => elRef.current.parentElement

    const handleMove = (e) => {
      const parent = getParent()
      if (!parent) return
      const parentRect = parent.getBoundingClientRect()
      const elRect = elRef.current.getBoundingClientRect()
      let nx = ((e.clientX - parentRect.left - offset.current.x) / parentRect.width) * 100
      let ny = ((e.clientY - parentRect.top - offset.current.y) / parentRect.height) * 100
      const elW = (elRect.width / parentRect.width) * 100
      const elH = (elRect.height / parentRect.height) * 100
      nx = Math.max(0, Math.min(100 - elW, nx))
      ny = Math.max(0, Math.min(100 - elH, ny))
      setPos({ x: Math.round(nx * 10) / 10, y: Math.round(ny * 10) / 10 })
    }

    const handleTouchMove = (e) => {
      const touch = e.touches[0]
      const parent = getParent()
      if (!parent) return
      const parentRect = parent.getBoundingClientRect()
      const elRect = elRef.current.getBoundingClientRect()
      let nx = ((touch.clientX - parentRect.left - offset.current.x) / parentRect.width) * 100
      let ny = ((touch.clientY - parentRect.top - offset.current.y) / parentRect.height) * 100
      const elW = (elRect.width / parentRect.width) * 100
      const elH = (elRect.height / parentRect.height) * 100
      nx = Math.max(0, Math.min(100 - elW, nx))
      ny = Math.max(0, Math.min(100 - elH, ny))
      setPos({ x: Math.round(nx * 10) / 10, y: Math.round(ny * 10) / 10 })
    }

    const handleUp = () => {
      setDragging(false)
      savePosition(id, posRef.current)
    }

    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleUp)
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleUp)

    return () => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleUp)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleUp)
    }
  }, [dragging, id])

  return (
    <div
      ref={elRef}
      className={`draggable${dragging ? ' dragging' : ''}`}
      style={{
        position: 'absolute',
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        zIndex: dragging ? 1000 : 1,
        userSelect: dragging ? 'none' : 'auto',
      }}
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
  )
}
