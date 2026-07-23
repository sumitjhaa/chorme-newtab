/**
  * @fileoverview Whiteboard drawing widget component.
  */

import { useEffect, memo } from 'react'
import { useTools } from '../../hooks/useTools'
import { useCanvas } from '../../hooks/useCanvas'
import { TOOLS } from './tools'
import Toolbar from './Toolbar'
import './whiteboard.css'

/** Props for the Whiteboard component */
interface WhiteboardProps {
    /** Callback to remove the whiteboard widget */
    onDelete: () => void
}

/**
  * Whiteboard widget with drawing tools and canvas.
  * 
  * @param props - WhiteboardProps
  * @example <Whiteboard onDelete={() => {}} />
  */
function Whiteboard({ onDelete }: WhiteboardProps) {
    const { activeTool, color, tool, lineWidth, selectTool, selectColor, selectLineWidth } = useTools()
    const {
        canvasRef,
        containerRef,
        handlePointerDown,
        handlePointerMove,
        handlePointerUp,
        handleClear,
        handleSave,
        handleUndo,
        handleRedo,
    } = useCanvas(tool, color)

    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); handleUndo() }
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) { e.preventDefault(); handleRedo() }
            if ((e.ctrlKey || e.metaKey) && e.key === 'y') { e.preventDefault(); handleRedo() }
            if (!e.ctrlKey && !e.metaKey && !e.altKey) {
                if (e.key === 'e') { selectTool('eraser'); return }
                const num = parseInt(e.key)
                if (num >= 1 && num <= TOOLS.length) { selectTool(TOOLS[num - 1].id) }
            }
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [handleUndo, handleRedo, selectTool])

    return (
        <div className="wb-widget">
            <Toolbar
                activeTool={activeTool}
                color={color}
                lineWidth={lineWidth}
                onSelectTool={selectTool}
                onSelectColor={selectColor}
                onSelectLineWidth={selectLineWidth}
                onClear={handleClear}
                onDelete={onDelete}
                onSave={handleSave}
                onUndo={handleUndo}
                onRedo={handleRedo}
            />
            <div className="wb-canvas-container" ref={containerRef}>
                <canvas
                    ref={canvasRef}
                    className="wb-canvas"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                />
            </div>
        </div>
    )
}

export default memo(Whiteboard)
