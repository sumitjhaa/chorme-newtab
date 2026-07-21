import { memo } from 'react'
import { useTools } from './hooks/useTools.js'
import { useCanvas } from './hooks/useCanvas.js'
import Toolbar from './Toolbar.jsx'
import './whiteboard.css'

function Whiteboard({ onDelete }) {
  const { activeTool, color, tool, lineWidth, selectTool, selectColor, selectLineWidth } = useTools()
  const {
    canvasRef,
    containerRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleClear,
    handleSave,
  } = useCanvas(tool, color)

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
      />
      <div className="wb-canvas-container" ref={containerRef}>
        <canvas
          ref={canvasRef}
          className="wb-canvas"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        />
      </div>
    </div>
  )
}

export default memo(Whiteboard)
