/**
  * @fileoverview Color picker component for the whiteboard.
  */

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { PRESET_COLORS } from './tools'

/** Props for the ColorPicker component */
interface ColorPickerProps {
    /** Currently selected color */
    color: string
    /** Callback when color is selected */
    onSelect: (color: string) => void
}

/**
  * Color picker with preset colors and custom color input.
  * 
  * @param props - ColorPickerProps
  * @example <ColorPicker color="#000" onSelect={setColor} />
  */
export default function ColorPicker({ color, onSelect }: ColorPickerProps) {
    const [open, setOpen] = useState(false)
    const [custom, setCustom] = useState(color)
    const btnRef = useRef<HTMLButtonElement>(null)
    const panelRef = useRef<HTMLDivElement>(null)
    const [pos, setPos] = useState({ top: 0, left: 0 })

    useEffect(() => {
        if (!open || !btnRef.current) return
        const rect = btnRef.current.getBoundingClientRect()
        setPos({ top: rect.bottom + 4, left: rect.left })
    }, [open])

    useEffect(() => {
        if (!open) return
        function handleClick(e: MouseEvent) {
            if (panelRef.current && !panelRef.current.contains(e.target as Node) && btnRef.current && !btnRef.current.contains(e.target as Node)) {
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
