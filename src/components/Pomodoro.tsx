/**
  * @fileoverview Pomodoro timer widget for productivity.
  */

import { useState, useEffect, useCallback, useRef, memo } from 'react'
import { useTranslation } from '../hooks/useTranslation'
import { useSettings } from '../hooks/useSettings'
import { playWorkComplete, playShortBreakComplete, playLongBreakComplete } from '../lib/timerSound'

type PomodoroPhase = 'work' | 'short_break' | 'long_break'

interface PomodoroState {
    phase: PomodoroPhase
    timeLeft: number
    cycles: number
    updatedAt: number
}

function loadState(): PomodoroState | null {
    try {
        const raw = localStorage.getItem('newtab_pomodoro')
        if (!raw) return null
        return JSON.parse(raw) as PomodoroState
    } catch {
        return null
    }
}

function saveState(state: PomodoroState): void {
    try {
        localStorage.setItem('newtab_pomodoro', JSON.stringify(state))
    } catch {}
}

function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission()
    }
}

function sendNotification(title: string, body: string) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body, icon: '/icon128.png' })
    }
}

function Pomodoro() {
    const { t } = useTranslation()
    const { settings } = useSettings()
    const durations: Record<PomodoroPhase, number> = {
        work: settings.pomodoroWork * 60,
        short_break: settings.pomodoroShort * 60,
        long_break: settings.pomodoroLong * 60,
    }

    const saved = loadState()

    // Reconcile timeLeft based on elapsed time since last save
    const reconciledTimeLeft = (() => {
        if (!saved) return durations.work
        const elapsed = Math.floor((Date.now() - saved.updatedAt) / 1000)
        const remaining = (saved.timeLeft ?? durations[saved.phase]) - elapsed
        return Math.max(0, remaining)
    })()

    const [phase, setPhase] = useState<PomodoroPhase>(saved?.phase || 'work')
    const [timeLeft, setTimeLeft] = useState<number>(reconciledTimeLeft)
    const [running, setRunning] = useState(false)
    const [cycles, setCycles] = useState(saved?.cycles || 0)
    const phaseRef = useRef(phase)
    const cyclesRef = useRef(cycles)
    const durationsRef = useRef(durations)
    const settingsRef = useRef(settings)

    phaseRef.current = phase
    cyclesRef.current = cycles
    durationsRef.current = durations
    settingsRef.current = settings

    // Request notification permission on mount
    useEffect(() => {
        requestNotificationPermission()
    }, [])

    // Persist state on every change (phase, timeLeft, cycles)
    useEffect(() => {
        saveState({ phase, timeLeft, cycles, updatedAt: Date.now() })
    }, [phase, timeLeft, cycles])

    // Timer tick with drift compensation
    useEffect(() => {
        if (!running) return
        const intervalId = setInterval(() => {
            setTimeLeft((prev: number) => {
                if (prev <= 1) {
                    const p = phaseRef.current
                    const c = cyclesRef.current
                    const d = durationsRef.current
                    const s = settingsRef.current
                    let next: PomodoroPhase
                    let newCycles = c

                    if (p === 'work') {
                        newCycles = c + 1
                        setCycles(newCycles)
                        next = newCycles % s.pomodoroCycles === 0 ? 'long_break' : 'short_break'
                        playWorkComplete()
                        sendNotification(t('workComplete'), t('workCompleteMsg'))
                    } else if (p === 'short_break') {
                        next = 'work'
                        playShortBreakComplete()
                        sendNotification(t('breakComplete'), t('breakCompleteMsg'))
                    } else {
                        next = 'work'
                        newCycles = 0
                        setCycles(0)
                        playLongBreakComplete()
                        sendNotification(t('longBreakComplete'), t('longBreakCompleteMsg'))
                    }
                    setPhase(next)
                    return d[next]
                }
                return prev - 1
            })
        }, 1000)
        return () => clearInterval(intervalId)
    }, [running, t])

    // Reconcile when tab becomes visible again (drift correction)
    useEffect(() => {
        function handleVisibility() {
            if (document.visibilityState === 'visible') {
                const savedState = loadState()
                if (savedState && savedState.phase) {
                    const elapsed = Math.floor((Date.now() - savedState.updatedAt) / 1000)
                    const expected = Math.max(0, (savedState.timeLeft ?? durationsRef.current[savedState.phase]) - elapsed)
                    setTimeLeft(expected)
                    if (savedState.phase !== phaseRef.current) setPhase(savedState.phase)
                    if (savedState.cycles !== cyclesRef.current) setCycles(savedState.cycles)
                }
            }
        }
        document.addEventListener('visibilitychange', handleVisibility)
        return () => document.removeEventListener('visibilitychange', handleVisibility)
    }, [])

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

    // Cycle dots: show how many completed out of total cycles
    const cycleTarget = settings.pomodoroCycles
    const completedInSet = cycles === 0 ? 0 : (cycles % cycleTarget === 0 ? cycleTarget : cycles % cycleTarget)

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
                {Array.from({ length: cycleTarget }, (_, i) => (
                    <span key={i} className={`pomo-dot${i < completedInSet ? ' done' : ''}`} />
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
