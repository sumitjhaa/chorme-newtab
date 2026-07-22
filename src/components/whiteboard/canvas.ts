// @ts-nocheck
import { isShapeTool } from './tools'

const IMAGE_KEY = 'newtab_whiteboard_image'

export function saveCanvasImage(canvas) {
  try {
    localStorage.setItem(IMAGE_KEY, canvas.toDataURL('image/png'))
  } catch {}
}

export function loadCanvasImage(ctx, canvas) {
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

export function clearCanvasImage() {
  try { localStorage.removeItem(IMAGE_KEY) } catch {}
}

export function getPointerPos(canvas, e) {
  const rect = canvas.getBoundingClientRect()
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const clientY = e.touches ? e.touches[0].clientY : e.clientY
  return {
    x: (clientX - rect.left) * (canvas.width / rect.width),
    y: (clientY - rect.top) * (canvas.height / rect.height),
  }
}

export function drawSegment(ctx, from, to, tool, color) {
  ctx.save()
  ctx.globalAlpha = tool.opacity
  ctx.globalCompositeOperation = tool.compositeOp
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

export function drawDot(ctx, point, tool, color) {
  ctx.save()
  ctx.globalAlpha = tool.opacity
  ctx.globalCompositeOperation = tool.compositeOp
  ctx.fillStyle = tool.id === 'whitebrush' ? '#ffffff' : color
  ctx.beginPath()
  ctx.arc(point.x, point.y, tool.lineWidth / 2, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

export function drawShapePreview(ctx, savedImageData, from, to, tool, color) {
  ctx.putImageData(savedImageData, 0, 0)
  drawShape(ctx, from, to, tool, color)
}

export function drawShape(ctx, from, to, tool, color) {
  ctx.save()
  ctx.globalAlpha = tool.opacity
  ctx.globalCompositeOperation = tool.compositeOp
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

export function clearCanvas(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

export function resizeCanvas(ctx, canvas, container) {
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
