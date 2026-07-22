/**
  * @fileoverview Pomodoro timer widget for productivity.
  */

import { useState, useEffect, useCallback, useRef, memo } from 'react'
import { useTranslation } from '../hooks/useTranslation'
import { useSettings } from '../hooks/useSettings'

/**
  * Load pomodoro state from localStorage.
  * @returns Saved state or empty object
  */
function loadState(): { phase?: string; timeLeft?: number; cycles?: number } {
    try {
        return JSON.parse(localStorage.getItem('newtab_pomodoro') || '{}')
    } catch {
        return {}
    }
}

/**
  * Save pomodoro state to localStorage.
  * @param state - Pomodoro state to save
  */
function saveState(state: { phase: string; timeLeft: number; cycles: number }): void {
    try {
        localStorage.setItem('newtab_pomodoro', JSON.stringify(state))
    } catch {}
}

/**
  * Format seconds to MM:SS string.
  * @param seconds - Time in seconds
  * @returns Formatted time string
  */
function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/** Pomodoro timer phases */
type PomodoroPhase = 'work' | 'short_break' | 'long_break'

/**
  * Pomodoro timer widget with work/break cycles.
  * 
  * @example <Pomodoro />
  */
function Pomodoro() {
    const { t } = useTranslation()
    const { settings } = useSettings()
    const durations: Record<PomodoroPhase, number> = {
        work: settings.pomodoroWork * 60,
        short_break: settings.pomodoroShort * 60,
        long_break: settings.pomodoroLong * 60,
    }

    const saved = loadState()
    const [phase, setPhase] = useState<PomodoroPhase>((saved.phase as PomodoroPhase) || 'work')
    const [timeLeft, setTimeLeft] = useState<number>(saved.timeLeft ?? durations.work)
    const [running, setRunning] = useState(false)
    const [cycles, setCycles] = useState(saved.cycles || 0)
    const phaseRef = useRef(phase)
    const cyclesRef = useRef(cycles)
    const durationsRef = useRef(durations)

    phaseRef.current = phase
    cyclesRef.current = cycles
    durationsRef.current = durations

    useEffect(() => {
        saveState({ phase, timeLeft, cycles })
    }, [phase, cycles])

    useEffect(() => {
        if (!running) return
        const id = setInterval(() => {
            setTimeLeft((prev: number) => {
                if (prev <= 1) {
                    const p = phaseRef.current
                    const c = cyclesRef.current
                    const d = durationsRef.current
                    let next: PomodoroPhase
                    if (p === 'work') {
                        const newCycles = c + 1
                        setCycles(newCycles)
                        next = newCycles % settings.pomodoroCycles === 0 ? 'long_break' : 'short_break'
                    } else {
                        next = 'work'
                    }
                    setPhase(next)
                    return d[next]
                }
                return prev - 1
            })
        }, 1000)
        return () => clearInterval(id)
    }, [running, settings.pomodoroCycles])

    const switchTo = useCallback((p: PomodoroPhase) => {
        setPhase(p)
        setTimeLeft(durationsRef.current[p])
        setRunning(false)
    }, [])

    const toggle = useCallback(() => setRunning((r) => !r), [])
    const reset = useCallback(() => {
        setTimeLeft(durationsRef.current[phaseRef.current as PomodoroPhase])
        setRunning(false)
    }, [])

    const tabs = [
        { id: 'work', label: t('work') },
        { id: 'short_break', label: t('short') },
        { id: 'long_break', label: t('long') },
    ]

    return (
        <div className="pomodoro-widget">
            <div className="pomo-tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`pomo-tab${phase === tab.id ? ' active' : ''}`}
                        onClick={() => switchTo(tab.id as PomodoroPhase)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="pomo-time">{formatTime(timeLeft)}</div>
            <div className="pomo-cycles">
                {Array.from({ length: settings.pomodoroCycles }, (_, i) => (
                    <span key={i} className={`pomo-dot${i < cycles % settings.pomodoroCycles || (cycles > 0 && cycles % settings.pomodoroCycles === 0) ? ' done' : ''}`} />
                ))}
            </div>
            <div className="pomo-actions">
                <button className="pomo-btn" onClick={toggle}>{running ? t('pause') : t('start')}</button>
                <button className="pomo-btn" onClick={reset}>{t('reset')}</button>
            </div>
        </div>
    )
}

export default memo(Pomodoro)
