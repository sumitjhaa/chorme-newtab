/**
 * @fileoverview Hook for whiteboard canvas drawing operations.
 */

import { useRef, useCallback, useEffect } from 'react'
import { drawSegment, drawDot, clearCanvas, saveCanvasImage, loadCanvasImage } from '../components/whiteboard/canvas'
import { isShapeTool } from '../components/whiteboard/tools'
import type { ToolDef } from '../components/whiteboard/tools'

/** 2D point coordinates */
interface Point {
  /** X coordinate */
  x: number
  /** Y coordinate */
  y: number
}

/** Simplified pointer event type */
interface PointerEventLike {
  /** Client X position */
  clientX: number
  /** Client Y position */
  clientY: number
  /** Prevent default */
  preventDefault(): void
  /** Touch events */
  touches?: { clientX: number; clientY: number }[]
}

/**
 * Get CSS-relative pointer position.
 * @param canvas - Canvas element
 * @param e - Pointer event
 * @returns CSS coordinates
 */
function getCssPointerPos(canvas: HTMLCanvasElement, e: PointerEventLike): Point {
  const rect = canvas.getBoundingClientRect()
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const clientY = e.touches ? e.touches[0].clientY : e.clientY
  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  }
}

/**
 * Hook for whiteboard canvas drawing operations.
 * 
 * @param tool - Current tool definition
 * @param color - Current drawing color
 * @returns Canvas refs and event handlers
 */
export function useCanvas(tool: ToolDef, color: string) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const drawing = useRef(false)
  const originPos = useRef<Point | null>(null)
  const offscreenRef = useRef<HTMLCanvasElement | null>(null)

  const getCtx = useCallback(() => {
    return canvasRef.current?.getContext('2d') || null
  }, [])

  const ensureOffscreen = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return null
    if (!offscreenRef.current || offscreenRef.current.width !== canvas.width || offscreenRef.current.height !== canvas.height) {
      const c = document.createElement('canvas')
      c.width = canvas.width
      c.height = canvas.height
      offscreenRef.current = c
    }
    return offscreenRef.current
  }, [])

  const handlePointerDown = useCallback((e: PointerEventLike) => {
    e.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = getCtx()
    if (!ctx) return
    drawing.current = true
    const pos = getCssPointerPos(canvas, e)
    originPos.current = pos
    if (isShapeTool(tool.id)) {
      const off = ensureOffscreen()
      if (off) {
        const offCtx = off.getContext('2d')!
        offCtx.clearRect(0, 0, off.width, off.height)
        offCtx.save()
        offCtx.setTransform(1, 0, 0, 1, 0, 0)
        offCtx.drawImage(canvas, 0, 0)
        offCtx.restore()
      }
    } else {
      drawDot(ctx, pos, tool, color)
    }
  }, [tool, color, getCtx, ensureOffscreen])

  const handlePointerMove = useCallback((e: PointerEventLike) => {
    if (!drawing.current) return
    e.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = getCtx()
    if (!ctx) return
    const pos = getCssPointerPos(canvas, e)
    if (isShapeTool(tool.id)) {
      const off = ensureOffscreen()
      if (off && originPos.current) {
        const offCtx = off.getContext('2d')!
        offCtx.clearRect(0, 0, off.width, off.height)
        offCtx.save()
        offCtx.setTransform(1, 0, 0, 1, 0, 0)
        offCtx.drawImage(canvas, 0, 0)
        offCtx.restore()
        drawShapeOnCtx(offCtx, originPos.current, pos, tool, color)
      }
    } else {
      if (originPos.current) {
        drawSegment(ctx, originPos.current, pos, tool, color)
      }
      originPos.current = pos
    }
  }, [tool, color, getCtx, ensureOffscreen])

  const handlePointerUp = useCallback(() => {
    if (drawing.current) {
      const canvas = canvasRef.current
      const ctx = getCtx()
      if (isShapeTool(tool.id) && ctx && canvas && offscreenRef.current) {
        const dpr = window.devicePixelRatio || 1
        const cssW = canvas.width / dpr
        const cssH = canvas.height / dpr
        ctx.save()
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(offscreenRef.current, 0, 0, offscreenRef.current.width, offscreenRef.current.height, 0, 0, cssW, cssH)
        ctx.restore()
      }
      drawing.current = false
      originPos.current = null
      if (offscreenRef.current) {
        offscreenRef.current.getContext('2d')?.clearRect(0, 0, offscreenRef.current.width, offscreenRef.current.height)
      }
      if (canvas) saveCanvasImage(canvas)
    }
  }, [getCtx, tool.id])

  const handleClear = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = getCtx()
    if (ctx && canvas) {
      clearCanvas(ctx, canvas)
      saveCanvasImage(canvas)
    }
  }, [getCtx])

  const handleSave = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'whiteboard.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }, [])

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = window.devicePixelRatio || 1
    const w = container.clientWidth
    const h = container.clientHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = w + 'px'
    canvas.style.height = h + 'px'
    ctx.scale(dpr, dpr)
    loadCanvasImage(ctx, canvas)
  }, [])

  useEffect(() => {
    return () => {
      if (canvasRef.current) saveCanvasImage(canvasRef.current)
    }
  }, [])

  return {
    canvasRef,
    containerRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleClear,
    handleSave,
  }
}

function drawShapeOnCtx(ctx: CanvasRenderingContext2D, from: Point, to: Point, tool: ToolDef, color: string): void {
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = tool.lineWidth
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  switch (tool.id) {
    case 'line':
      ctx.beginPath()
      ctx.moveTo(from.x, from.y)
      ctx.lineTo(to.x, to.y)
      ctx.stroke()
      break
    case 'rect':
      ctx.beginPath()
      ctx.rect(from.x, from.y, to.x - from.x, to.y - from.y)
      ctx.stroke()
      break
    case 'circle': {
      const rx = Math.abs(to.x - from.x) / 2
      const ry = Math.abs(to.y - from.y) / 2
      const cx = (from.x + to.x) / 2
      const cy = (from.y + to.y) / 2
      if (rx > 0 && ry > 0) {
        ctx.beginPath()
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
        ctx.stroke()
      }
      break
    }
    case 'arrow': {
      const dx = to.x - from.x
      const dy = to.y - from.y
      if (dx === 0 && dy === 0) break
      const angle = Math.atan2(dy, dx)
      const headLen = Math.max(tool.lineWidth * 5, 16)
      ctx.beginPath()
      ctx.moveTo(from.x, from.y)
      ctx.lineTo(to.x, to.y)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(to.x, to.y)
      ctx.lineTo(to.x - headLen * Math.cos(angle - Math.PI / 6), to.y - headLen * Math.sin(angle - Math.PI / 6))
      ctx.moveTo(to.x, to.y)
      ctx.lineTo(to.x - headLen * Math.cos(angle + Math.PI / 6), to.y - headLen * Math.sin(angle + Math.PI / 6))
      ctx.stroke()
      break
    }
  }
}
