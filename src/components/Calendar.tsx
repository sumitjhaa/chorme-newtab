/**
  * @fileoverview Calendar widget component displaying the current month.
  */

import { useState, useEffect, useCallback, useRef, memo } from 'react'
import { useTranslation } from '../hooks/useTranslation'

function getDays(t: (key: string) => string): string[] {
    return [t('sun'), t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat')]
}

function isSameMonth(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

function Calendar() {
    const { t, lang } = useTranslation()
    const [today, setToday] = useState(new Date())
    const [viewMonth, setViewMonth] = useState(new Date())
    const [animDir, setAnimDir] = useState<'left' | 'right' | null>(null)
    const widgetRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const interval = setInterval(() => setToday(new Date()), 60000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const el = widgetRef.current
        if (!el) return
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') { e.preventDefault(); navigateMonth(-1) }
            if (e.key === 'ArrowRight') { e.preventDefault(); navigateMonth(1) }
        }
        el.addEventListener('keydown', handleKey)
        return () => el.removeEventListener('keydown', handleKey)
    }, [])

    const navigateMonth = useCallback((dir: number) => {
        setAnimDir(dir < 0 ? 'left' : 'right')
        setViewMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + dir, 1))
    }, [])

    useEffect(() => {
        if (animDir) {
            const t = setTimeout(() => setAnimDir(null), 200)
            return () => clearTimeout(t)
        }
    }, [animDir])

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
        const dow = (firstDay + d - 1) % 7
        const isWeekend = dow === 0 || dow === 6
        cells.push(
            <div key={d} className={`cal-cell${isToday ? ' cal-today' : ''}${isWeekend ? ' cal-weekend' : ''}`}>
                {d}
            </div>
        )
    }

    const atCurrentMonth = isSameMonth(viewMonth, today)

    const monthLabel = viewMonth.toLocaleDateString(lang, { month: 'long', year: 'numeric' })

    return (
        <div className="calendar-widget" ref={widgetRef} tabIndex={0}>
            <div className="cal-header">
                <button className="cal-nav" onClick={() => navigateMonth(-1)}>&lsaquo;</button>
                <div className="cal-header-center">
                    <span className="cal-month-label">{monthLabel}</span>
                    {!atCurrentMonth && (
                        <button className="cal-today-btn" onClick={() => setViewMonth(new Date())}>
                            {t('today') || 'Today'}
                        </button>
                    )}
                </div>
                <button className="cal-nav" onClick={() => navigateMonth(1)}>&rsaquo;</button>
            </div>
            <div className={`cal-grid${animDir ? ` cal-slide-${animDir}` : ''}`}>
                {getDays(t).map((d, i) => (
                    <div key={d} className={`cal-day-header${i === 0 || i === 6 ? ' cal-weekend' : ''}`}>{d}</div>
                ))}
                {cells}
            </div>
        </div>
    )
}

export default memo(Calendar)
