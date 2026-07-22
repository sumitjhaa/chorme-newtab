/**
 * @fileoverview Canvas drawing utilities for the whiteboard.
 */

import { isShapeTool, type ToolDef } from './tools'

/** localStorage key for whiteboard image */
const IMAGE_KEY = 'newtab_whiteboard_image'

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
  /** Touch events */
  touches?: { clientX: number; clientY: number }[]
}

/**
 * Save canvas image to localStorage.
 * @param canvas - Canvas element to save
 */
export function saveCanvasImage(canvas: HTMLCanvasElement): void {
  try {
    localStorage.setItem(IMAGE_KEY, canvas.toDataURL('image/png'))
  } catch {}
}

/**
 * Load saved canvas image from localStorage.
 * @param ctx - Canvas 2D context
 * @param canvas - Canvas element
 * @returns Whether an image was loaded
 */
export function loadCanvasImage(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): boolean {
  try {
    const data = localStorage.getItem(IMAGE_KEY)
    if (!data) return false
    const img = new Image()
    img.src = data
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    }
    return true
  } catch { return false }
}

/**
 * Clear saved canvas image from localStorage.
 */
export function clearCanvasImage(): void {
  try { localStorage.removeItem(IMAGE_KEY) } catch {}
}

/**
 * Get pointer position relative to canvas.
 * @param canvas - Canvas element
 * @param e - Pointer event
 * @returns Canvas coordinates
 */
export function getPointerPos(canvas: HTMLCanvasElement, e: PointerEventLike): Point {
  const rect = canvas.getBoundingClientRect()
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const clientY = e.touches ? e.touches[0].clientY : e.clientY
  return {
    x: (clientX - rect.left) * (canvas.width / rect.width),
    y: (clientY - rect.top) * (canvas.height / rect.height),
  }
}

/**
 * Draw a line segment on the canvas.
 * @param ctx - Canvas 2D context
 * @param from - Start point
 * @param to - End point
 * @param tool - Tool definition
 * @param color - Stroke color
 */
export function drawSegment(ctx: CanvasRenderingContext2D, from: Point, to: Point, tool: ToolDef, color: string): void {
  ctx.save()
  ctx.globalAlpha = tool.opacity
  ctx.globalCompositeOperation = tool.compositeOp as GlobalCompositeOperation
  ctx.strokeStyle = tool.id === 'whitebrush' ? '#ffffff' : color
  ctx.lineWidth = tool.lineWidth
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(from.x, from.y)
  ctx.lineTo(to.x, to.y)
  ctx.stroke()
  ctx.restore()
}

/**
 * Draw a dot at a point on the canvas.
 * @param ctx - Canvas 2D context
 * @param point - Position
 * @param tool - Tool definition
 * @param color - Fill color
 */
export function drawDot(ctx: CanvasRenderingContext2D, point: Point, tool: ToolDef, color: string): void {
  ctx.save()
  ctx.globalAlpha = tool.opacity
  ctx.globalCompositeOperation = tool.compositeOp as GlobalCompositeOperation
  ctx.fillStyle = tool.id === 'whitebrush' ? '#ffffff' : color
  ctx.beginPath()
  ctx.arc(point.x, point.y, tool.lineWidth / 2, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

/**
 * Draw a shape preview during drag.
 * @param ctx - Canvas 2D context
 * @param savedImageData - Saved canvas state to restore
 * @param from - Start point
 * @param to - Current point
 * @param tool - Tool definition
 * @param color - Stroke color
 */
export function drawShapePreview(ctx: CanvasRenderingContext2D, savedImageData: ImageData, from: Point, to: Point, tool: ToolDef, color: string): void {
  ctx.putImageData(savedImageData, 0, 0)
  drawShape(ctx, from, to, tool, color)
}

/**
 * Draw a shape (line, rectangle, circle, arrow) on the canvas.
 * @param ctx - Canvas 2D context
 * @param from - Start point
 * @param to - End point
 * @param tool - Tool definition
 * @param color - Stroke/fill color
 */
export function drawShape(ctx: CanvasRenderingContext2D, from: Point, to: Point, tool: ToolDef, color: string): void {
  ctx.save()
  ctx.globalAlpha = tool.opacity
  ctx.globalCompositeOperation = tool.compositeOp as GlobalCompositeOperation
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
      ctx.beginPath()
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
      ctx.stroke()
      break
    }
    case 'arrow': {
      const angle = Math.atan2(to.y - from.y, to.x - from.x)
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
  ctx.restore()
}

/**
 * Clear the entire canvas.
 * @param ctx - Canvas 2D context
 * @param canvas - Canvas element
 */
export function clearCanvas(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

/**
 * Resize canvas to fit container while preserving content.
 * @param ctx - Canvas 2D context
 * @param canvas - Canvas element
 * @param container - Container element
 */
export function resizeCanvas(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, container: HTMLElement): void {
  const dpr = window.devicePixelRatio || 1
  const w = container.clientWidth
  const h = container.clientHeight
  if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = w + 'px'
    canvas.style.height = h + 'px'
    ctx.putImageData(imageData, 0, 0)
  }
}
