// @ts-nocheck
import { useState, useEffect, memo } from 'react'
import { useTranslation } from '../hooks/useTranslation'

function getDays(t: (key: string) => string): string[] {
  return [t('sun'), t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat')]
}

function Calendar() {
  const { t, lang } = useTranslation()
  const [today, setToday] = useState(new Date())
  const [viewMonth, setViewMonth] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setToday(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  const year = viewMonth.getFullYear()
  const month = viewMonth.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const todayStr = today.toDateString()

  const cells = []
  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`blank-${i}`} className="cal-cell cal-blank" />)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d)
    const isToday = date.toDateString() === todayStr
    cells.push(
      <div key={d} className={`cal-cell${isToday ? ' cal-today' : ''}`}>
        {d}
      </div>
    )
  }

  const prevMonth = () => setViewMonth(new Date(year, month - 1, 1))
  const nextMonth = () => setViewMonth(new Date(year, month + 1, 1))

  const monthLabel = viewMonth.toLocaleDateString(lang, { month: 'long', year: 'numeric' })

  return (
    <div className="calendar-widget">
      <div className="cal-header">
        <button className="cal-nav" onClick={prevMonth}>&lsaquo;</button>
        <span className="cal-month-label">{monthLabel}</span>
        <button className="cal-nav" onClick={nextMonth}>&rsaquo;</button>
      </div>
      <div className="cal-grid">
        {getDays(t).map((d) => (
          <div key={d} className="cal-day-header">{d}</div>
        ))}
        {cells}
      </div>
    </div>
  )
}

export default memo(Calendar)
