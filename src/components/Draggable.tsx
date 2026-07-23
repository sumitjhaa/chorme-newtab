/**
  * @fileoverview Draggable wrapper component for widget reordering.
  */

import { useState, useCallback, useRef, useEffect, useMemo, memo, type ReactNode } from 'react'

/** Props for the Draggable component */
interface DraggableProps {
    /** Unique widget identifier */
    id: string
    /** Current column index */
    col: number
    /** Callback when widget is dropped */
    onDrop: (id: string, col: number, order: number) => void
    /** Total number of columns */
    numColumns: number
    /** Maximum column index this widget can be placed in */
    maxCol?: number
    /** Number of columns this widget spans (default: 1) */
    span?: number
    /** Widget content */
    children: ReactNode
}

/**
  * Draggable wrapper that enables drag-and-drop reordering of widgets.
  * Supports both mouse and touch interactions.
  * 
  * @param props - DraggableProps
  * @returns Draggable widget container
  */
export default memo(function Draggable({ id, col, onDrop, numColumns, maxCol, span = 1, children }: DraggableProps) {
    const [dragging, setDragging] = useState(false)
    const [dragPos, setDragPos] = useState({ x: 0, y: 0 })
    const [ghostHeight, setGhostHeight] = useState(0)
    const elRef = useRef<HTMLDivElement>(null)
    const handleRef = useRef<HTMLButtonElement>(null)
    const offset = useRef({ x: 0, y: 0 })
    const onDropRef = useRef(onDrop)
    onDropRef.current = onDrop
    const indicatorRef = useRef<HTMLDivElement | null>(null)

    const removeIndicator = useCallback(() => {
        if (indicatorRef.current) {
            indicatorRef.current.remove()
            indicatorRef.current = null
        }
    }, [])

    const updateIndicator = useCallback((clientX: number, clientY: number) => {
        const columns = document.querySelectorAll('.kanban-column')
        removeIndicator()

        let targetColEl: Element | null = null
        let targetColIndex = -1
        let insertBefore: Element | null = null

        for (let idx = 0; idx < columns.length; idx++) {
            const colEl = columns[idx]
            const rect = colEl.getBoundingClientRect()
            if (clientX >= rect.left && clientX <= rect.right) {
                targetColEl = colEl
                targetColIndex = idx
                const inner = colEl.querySelector('.kanban-column-inner')
                if (!inner) continue
                const kids = Array.from(inner.children).filter(
                    c => !c.classList.contains('is-dragging') && !c.classList.contains('drop-indicator')
                )
                insertBefore = null
                for (let j = 0; j < kids.length; j++) {
                    const childRect = kids[j].getBoundingClientRect()
                    const midY = childRect.top + childRect.height / 2
                    if (clientY < midY) {
                        insertBefore = kids[j]
                        break
                    }
                }
            }
        }

        if (targetColEl) {
            if (span > 1 && targetColIndex >= 0) {
                const startCol = Math.min(targetColIndex, numColumns - span)
                const board = document.querySelector('.kanban-board')
                const firstCol = columns[startCol]
                const lastCol = columns[Math.min(startCol + span - 1, numColumns - 1)]
                if (firstCol && lastCol && board) {
                    const firstRect = firstCol.getBoundingClientRect()
                    const lastRect = lastCol.getBoundingClientRect()
                    const indicator = document.createElement('div')
                    indicator.className = 'drop-indicator'
                    indicator.style.height = ghostHeight + 'px'
                    indicator.style.position = 'fixed'
                    indicator.style.left = firstRect.left + 'px'
                    indicator.style.top = firstRect.top + 'px'
                    indicator.style.width = (lastRect.right - firstRect.left) + 'px'
                    indicator.style.zIndex = '9998'
                    board.appendChild(indicator)
                    indicatorRef.current = indicator
                }
            } else {
                const colEl = targetColEl
                const inner = colEl.querySelector('.kanban-column-inner')
                if (inner) {
                    const indicator = document.createElement('div')
                    indicator.className = 'drop-indicator'
                    indicator.style.height = ghostHeight + 'px'
                    if (insertBefore) {
                        inner.insertBefore(indicator, insertBefore)
                    } else {
                        inner.appendChild(indicator)
                    }
                    indicatorRef.current = indicator
                }
            }
        }
    }, [ghostHeight, removeIndicator, span, numColumns])

    const handleGrabStart = useCallback((clientX: number, clientY: number, handleEl: HTMLElement | null) => {
        const rect = elRef.current?.getBoundingClientRect()
        if (!rect) return

        if (handleEl) {
            const hr = handleEl.getBoundingClientRect()
            const hcX = hr.left + hr.width / 2
            const hcY = hr.top + hr.height / 2
            offset.current = {
                x: hcX - rect.left,
                y: hcY - rect.top,
            }
            setDragPos({ x: clientX - (hcX - rect.left), y: clientY - (hcY - rect.top) })
        } else {
            offset.current = { x: clientX - rect.left, y: clientY - rect.top }
            setDragPos({ x: rect.left, y: rect.top })
        }

        setGhostHeight(rect.height)
        setDragging(true)
    }, [])

    const handleGrabMouseDown = useCallback((e: React.MouseEvent) => {
        if (e.button !== 0) return
        e.preventDefault()
        e.stopPropagation()
        handleGrabStart(e.clientX, e.clientY, handleRef.current)
    }, [handleGrabStart])

    const handleGrabTouchStart = useCallback((e: React.TouchEvent) => {
        e.stopPropagation()
        const touch = e.touches[0]
        handleGrabStart(touch.clientX, touch.clientY, handleRef.current)
    }, [handleGrabStart])

    useEffect(() => {
        if (!dragging) return

        const handleMove = (e: MouseEvent | TouchEvent) => {
            const clientX = 'clientX' in e ? e.clientX : e.touches?.[0]?.clientX
            const clientY = 'clientY' in e ? e.clientY : e.touches?.[0]?.clientY
            if (clientX == null || clientY == null) return
            setDragPos({ x: clientX - offset.current.x, y: clientY - offset.current.y })
            updateIndicator(clientX, clientY)
        }

        const handleUp = (e: MouseEvent | TouchEvent) => {
            const clientX = 'clientX' in e ? e.clientX : e.changedTouches?.[0]?.clientX
            const clientY = 'clientY' in e ? e.clientY : e.changedTouches?.[0]?.clientY
            removeIndicator()
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
                    targetCol = span > 1 ? Math.min(i, numColumns - span) : i
                    const inner = colEl.querySelector('.kanban-column-inner')
                    if (!inner) return
                    const kids = Array.from(inner.children).filter(
                        c => !c.classList.contains('is-dragging') && !c.classList.contains('drop-indicator')
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

            onDropRef.current(id, Math.min(targetCol, maxCol ?? numColumns - 1), targetOrder)
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
            removeIndicator()
        }
    }, [dragging, id, col, updateIndicator, removeIndicator])

    const floatingStyle = useMemo(() => ({
        position: 'fixed' as const,
        left: dragPos.x,
        top: dragPos.y,
        width: elRef.current?.offsetWidth,
        zIndex: 9999,
        pointerEvents: 'none' as const,
    }), [dragPos.x, dragPos.y])

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
                style={dragging ? floatingStyle : undefined}
            >
                <button
                    ref={handleRef}
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
})
