// @ts-nocheck
import { useState, useEffect, memo } from 'react'
import { useSettings } from '../hooks/useSettings'

function formatTime(date, s) {
  const is24h = s.clockFormat === '24h'
  const opts = { hour: '2-digit', minute: '2-digit', hour12: !is24h }
  if (s.showSeconds) opts.second = '2-digit'
  if (s.timeZone !== 'local') opts.timeZone = s.timeZone
  const str = date.toLocaleTimeString('en-US', opts)
  if (is24h || !s.showAmPm) return str.replace(/\s?(AM|PM|am|pm)$/i, '').trim()
  return str.replace(/\s?(AM|PM|am|pm)$/i, '').trim()
}

function getAmPm(date, s) {
  if (s.clockFormat === '24h' || !s.showAmPm) return ''
  const opts = { hour: 'numeric', hour12: true }
  if (s.timeZone !== 'local') opts.timeZone = s.timeZone
  const parts = new Intl.DateTimeFormat('en-US', opts).formatToParts(date)
  const daypart = parts.find((p) => p.type === 'dayPeriod')
  return daypart ? daypart.value.toUpperCase() : ''
}

function getSeconds(date, s) {
  if (!s.showSeconds) return ''
  const opts = { second: '2-digit' }
  if (s.timeZone !== 'local') opts.timeZone = s.timeZone
  return date.toLocaleTimeString('en-US', opts)
}

function formatDate(date, s) {
  const tz = s.timeZone !== 'local' ? { timeZone: s.timeZone } : {}
  const day = String(new Intl.DateTimeFormat('en-US', { day: '2-digit', ...tz }).format(date)).padStart(2, '0')
  const month = String(new Intl.DateTimeFormat('en-US', { month: '2-digit', ...tz }).format(date)).padStart(2, '0')
  const year = new Intl.DateTimeFormat('en-US', { year: 'numeric', ...tz }).format(date)
  if (s.dateFormat === 'MM/DD/YYYY') return `${month}/${day}/${year}`
  if (s.dateFormat === 'YYYY-MM-DD') return `${year}-${month}-${day}`
  return `${day}/${month}/${year}`
}

function tzLabel(tz) {
  const parts = tz.split('/')
  return parts.length > 1 ? parts[parts.length - 1].replace(/_/g, ' ') : tz
}

function AnalogClock({ date, timeZone }) {
  const tz = timeZone !== 'local' ? { timeZone } : {}
  const parts = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false, ...tz,
  }).formatToParts(date)
  const h = Number(parts.find((p) => p.type === 'hour').value) % 12
  const m = Number(parts.find((p) => p.type === 'minute').value)
  const s = Number(parts.find((p) => p.type === 'second').value)

  const hourDeg = h * 30 + m * 0.5
  const minDeg = m * 6
  const secDeg = s * 6

  return (
    <svg className="analog-face" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="48" className="analog-rim" />
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * 30) * (Math.PI / 180)
        const x1 = 50 + 42 * Math.sin(angle)
        const y1 = 50 - 42 * Math.cos(angle)
        const x2 = 50 + 46 * Math.sin(angle)
        const y2 = 50 - 46 * Math.cos(angle)
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className="analog-tick" />
      })}
      <line x1="50" y1="50" x2="50" y2="30" className="analog-hour" transform={`rotate(${hourDeg} 50 50)`} />
      <line x1="50" y1="50" x2="50" y2="18" className="analog-minute" transform={`rotate(${minDeg} 50 50)`} />
      <line x1="50" y1="54" x2="50" y2="14" className="analog-second" transform={`rotate(${secDeg} 50 50)`} />
      <circle cx="50" cy="50" r="2.5" className="analog-center" />
    </svg>
  )
}

function Clock() {
  const [time, setTime] = useState(new Date())
  const { settings } = useSettings()

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const showClock = settings.showClockDate !== 'date'
  const showDate = settings.showClockDate !== 'clock'
  const scale = settings.clockSize / 100
  const ampm = getAmPm(time, settings)
  const secs = getSeconds(time, settings)

  return (
    <div className="clock" style={{ opacity: settings.uiOpacity / 100, transform: `scale(${scale})` }}>
      {showClock && (
        settings.analogClock ? (
          <AnalogClock date={time} timeZone={settings.timeZone} />
        ) : (
          <div className="clock-time">
            {formatTime(time, settings)}
            {secs && <span className="clock-secs">{secs}</span>}
            {ampm && <span className="clock-ampm">{ampm}</span>}
          </div>
        )
      )}
      {showDate && <div className="clock-date">{formatDate(time, settings)}</div>}
      {settings.worldClockTimezones && settings.worldClockTimezones.length > 0 && (
        <div className="world-clocks">
          {settings.worldClockTimezones.map((tz) => (
            <div key={tz} className="world-clock-row">
              <span className="world-clock-label">{tzLabel(tz)}</span>
              <span className="world-clock-time">{formatTime(time, { ...settings, timeZone: tz, showSeconds: false, showAmPm: false })}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default memo(Clock)
