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

  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return
    if (e.target.closest('button, input, select, textarea, a, [role="button"]')) return
    e.preventDefault()
    const rect = elRef.current.getBoundingClientRect()
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
    setDragging(true)
  }, [])

  const handleTouchStart = useCallback((e) => {
    if (e.target.closest('button, input, select, textarea, a, [role="button"]')) return
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
      const nx = ((e.clientX - parentRect.left - offset.current.x) / parentRect.width) * 100
      const ny = ((e.clientY - parentRect.top - offset.current.y) / parentRect.height) * 100
      setPos({ x: Math.round(nx * 10) / 10, y: Math.round(ny * 10) / 10 })
    }

    const handleTouchMove = (e) => {
      const touch = e.touches[0]
      const parent = getParent()
      if (!parent) return
      const parentRect = parent.getBoundingClientRect()
      const nx = ((touch.clientX - parentRect.left - offset.current.x) / parentRect.width) * 100
      const ny = ((touch.clientY - parentRect.top - offset.current.y) / parentRect.height) * 100
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
        transform: 'translate(-50%, -50%)',
        cursor: dragging ? 'grabbing' : 'grab',
        zIndex: dragging ? 1000 : 1,
        userSelect: dragging ? 'none' : 'auto',
        touchAction: 'none',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {children}
    </div>
  )
}
