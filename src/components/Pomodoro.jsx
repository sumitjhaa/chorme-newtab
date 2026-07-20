import { useState, useEffect, useCallback, useRef, memo } from 'react'

function loadSettings() {
  try {
    const data = JSON.parse(localStorage.getItem('newtab_settings') || '{}')
    return {
      pomodoroWork: data.pomodoroWork ?? 25,
      pomodoroShort: data.pomodoroShort ?? 5,
      pomodoroLong: data.pomodoroLong ?? 15,
      pomodoroCycles: data.pomodoroCycles ?? 4,
    }
  } catch {
    return { pomodoroWork: 25, pomodoroShort: 5, pomodoroLong: 15, pomodoroCycles: 4 }
  }
}

function loadState() {
  try {
    return JSON.parse(localStorage.getItem('newtab_pomodoro') || '{}')
  } catch {
    return {}
  }
}

function saveState(state) {
  try {
    localStorage.setItem('newtab_pomodoro', JSON.stringify(state))
  } catch {}
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function Pomodoro() {
  const [settings, setSettings] = useState(loadSettings)
  const durations = {
    work: settings.pomodoroWork * 60,
    short_break: settings.pomodoroShort * 60,
    long_break: settings.pomodoroLong * 60,
  }

  const saved = loadState()
  const [phase, setPhase] = useState(saved.phase || 'work')
  const [timeLeft, setTimeLeft] = useState(saved.timeLeft ?? durations.work)
  const [running, setRunning] = useState(false)
  const [cycles, setCycles] = useState(saved.cycles || 0)
  const phaseRef = useRef(phase)
  const cyclesRef = useRef(cycles)
  const durationsRef = useRef(durations)

  phaseRef.current = phase
  cyclesRef.current = cycles
  durationsRef.current = durations

  useEffect(() => {
    function handleStorage() {
      setSettings(loadSettings())
    }
    window.addEventListener('storage', handleStorage)
    const interval = setInterval(handleStorage, 1000)
    return () => {
      window.removeEventListener('storage', handleStorage)
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    saveState({ phase, timeLeft, cycles })
  }, [phase, timeLeft, cycles])

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          const p = phaseRef.current
          const c = cyclesRef.current
          const d = durationsRef.current
          let next
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

  const switchTo = useCallback((p) => {
    setPhase(p)
    setTimeLeft(durationsRef.current[p])
    setRunning(false)
  }, [])

  const toggle = useCallback(() => setRunning((r) => !r), [])
  const reset = useCallback(() => {
    setTimeLeft(durationsRef.current[phaseRef.current])
    setRunning(false)
  }, [])

  const tabs = [
    { id: 'work', label: 'Work' },
    { id: 'short_break', label: 'Short' },
    { id: 'long_break', label: 'Long' },
  ]

  return (
    <div className="pomodoro-widget">
      <div className="pomo-tabs">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`pomo-tab${phase === t.id ? ' active' : ''}`}
            onClick={() => switchTo(t.id)}
          >
            {t.label}
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
        <button className="pomo-btn" onClick={toggle}>{running ? 'PAUSE' : 'START'}</button>
        <button className="pomo-btn" onClick={reset}>RESET</button>
      </div>
    </div>
  )
}

export default memo(Pomodoro)
