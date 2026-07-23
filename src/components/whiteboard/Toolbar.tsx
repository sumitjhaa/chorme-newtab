/**
  * @fileoverview Whiteboard toolbar with tool selection and actions.
  */

import React, { useState, useEffect, useRef, memo } from 'react'
import { TOOLS } from './tools'
import ColorPicker from './ColorPicker'

/** SVG icons for each tool */
const TOOL_ICONS: Record<string, React.ReactElement> = {
    pencil: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
        </svg>
    ),
    marker: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/>
        </svg>
    ),
    whitebrush: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z"/>
            <path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7"/>
            <path d="M14.5 17.5 4.5 15"/>
        </svg>
    ),
    line: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="19" x2="19" y2="5"/>
        </svg>
    ),
    rect: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
        </svg>
    ),
    circle: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9"/>
        </svg>
    ),
    arrow: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="19" x2="19" y2="5"/>
            <polyline points="10 5 19 5 19 14"/>
        </svg>
    ),
    eraser: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/>
            <path d="M22 21H7"/><path d="m5 11 9 9"/>
        </svg>
    ),
}

/** Props for the Toolbar component */
interface ToolbarProps {
    activeTool: string
    color: string
    lineWidth: number
    onSelectTool: (id: string) => void
    onSelectColor: (color: string) => void
    onSelectLineWidth: (width: number) => void
    onClear: () => void
    onDelete: () => void
    onSave: () => void
    onUndo: () => void
    onRedo: () => void
}

/**
  * Whiteboard toolbar with tool selection, color picker, and actions.
  * 
  * @param props - ToolbarProps
  * @example <Toolbar activeTool="pencil" color="#000" lineWidth={2} onSelectTool={setTool} onSelectColor={setColor} onSelectLineWidth={setWidth} onClear={clear} onDelete={del} onSave={save} />
  */
export default memo(function Toolbar({ activeTool, color, lineWidth, onSelectTool, onSelectColor, onSelectLineWidth, onClear, onDelete, onSave, onUndo, onRedo }: ToolbarProps) {
    const isEraser = activeTool === 'eraser'
    const minSize = isEraser ? 8 : 1
    const maxSize = isEraser ? 40 : 20
    const [confirmClear, setConfirmClear] = useState(false)
    const confirmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => { return () => { if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current) } }, [])

    function handleClear() {
        if (confirmClear) {
            if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current)
            setConfirmClear(false)
            onClear()
        } else {
            setConfirmClear(true)
            confirmTimerRef.current = setTimeout(() => setConfirmClear(false), 3000)
        }
    }

    return (
        <div className="wb-toolbar">
            <div className="wb-toolbar-row">
                {TOOLS.filter(t => t.id !== 'eraser').map(t => (
                    <button
                        key={t.id}
                        className={`wb-tool-btn ${activeTool === t.id ? 'active' : ''}`}
                        onClick={() => onSelectTool(t.id)}
                        title={t.label}
                    >
                        {TOOL_ICONS[t.icon]}
                    </button>
                ))}
            </div>
            <div className="wb-toolbar-row">
                <div className="wb-stroke-size">
                    <input
                        type="range"
                        min={minSize}
                        max={maxSize}
                        value={lineWidth}
                        onChange={(e) => onSelectLineWidth(+e.target.value)}
                        className="wb-stroke-slider"
                        title={`${lineWidth}px`}
                    />
                </div>
                <div className="wb-separator" />
                <ColorPicker color={color} onSelect={onSelectColor} />
                <div className="wb-toolbar-spacer" />
                <button className="wb-action-btn" onClick={onUndo} title="Undo (Ctrl+Z)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>
                    </svg>
                </button>
                <button className="wb-action-btn" onClick={onRedo} title="Redo (Ctrl+Shift+Z)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/>
                    </svg>
                </button>
                <button
                    className={`wb-tool-btn ${activeTool === 'eraser' ? 'active' : ''}`}
                    onClick={() => onSelectTool('eraser')}
                    title="Eraser"
                >
                    {TOOL_ICONS.eraser}
                </button>
                <button className="wb-action-btn" onClick={onSave} title="Save as PNG">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                </button>
                <button className={`wb-action-btn${confirmClear ? ' wb-confirm-clear' : ''}`} onClick={handleClear} title={confirmClear ? 'Click to confirm clear' : 'Clear board'}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z"/>
                        <line x1="18" y1="9" x2="12" y2="15"/><line x1="12" y1="9" x2="18" y2="15"/>
                    </svg>
                </button>
                <button className="wb-action-btn wb-delete-btn" onClick={onDelete} title="Remove whiteboard">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                </button>
            </div>
        </div>
    )
})
