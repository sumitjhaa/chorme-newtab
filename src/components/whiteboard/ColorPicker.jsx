import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { PRESET_COLORS } from './tools.js'

export default function ColorPicker({ color, onSelect }) {
  const [open, setOpen] = useState(false)
  const [custom, setCustom] = useState(color)
  const btnRef = useRef(null)
  const panelRef = useRef(null)
  const [pos, setPos] = useState({ top: 0, left: 0 })

  useEffect(() => {
    if (!open || !btnRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    setPos({ top: rect.bottom + 4, left: rect.left })
  }, [open])

  useEffect(() => {
    if (!open) return
    function handleClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target) && btnRef.current && !btnRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <>
      <button
        ref={btnRef}
        className="wb-color-swatch"
        style={{ background: color }}
        onClick={() => setOpen(!open)}
        title="Pick color"
      />
      {open && createPortal(
        <div
          ref={panelRef}
          className="wb-color-popover"
          style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 100000 }}
        >
          <div className="wb-color-grid">
            {PRESET_COLORS.map(c => (
              <button
                key={c}
                className={`wb-color-option ${c === color ? 'active' : ''}`}
                style={{ background: c }}
                onClick={() => { onSelect(c); setOpen(false) }}
              />
            ))}
          </div>
          <div className="wb-color-custom">
            <input
              type="color"
              value={custom}
              onChange={(e) => { setCustom(e.target.value); onSelect(e.target.value) }}
            />
            <span className="wb-color-hex">{custom}</span>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
