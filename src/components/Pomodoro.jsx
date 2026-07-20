import { useState, useEffect, useCallback, useRef, memo } from 'react'

const WORK = 25 * 60
const SHORT_BREAK = 5 * 60
const LONG_BREAK = 15 * 60

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
  const saved = loadState()
  const [phase, setPhase] = useState(saved.phase || 'work')
  const [timeLeft, setTimeLeft] = useState(saved.timeLeft ?? WORK)
  const [running, setRunning] = useState(false)
  const [cycles, setCycles] = useState(saved.cycles || 0)
  const phaseRef = useRef(phase)
  const cyclesRef = useRef(cycles)

  phaseRef.current = phase
  cyclesRef.current = cycles

  const phaseDurations = { work: WORK, short_break: SHORT_BREAK, long_break: LONG_BREAK }
  const phaseLabels = { work: 'WORK', short_break: 'SHORT BREAK', long_break: 'LONG BREAK' }

  useEffect(() => {
    saveState({ phase, timeLeft, cycles })
  }, [phase, timeLeft, cycles])

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          const currentPhase = phaseRef.current
          const currentCycles = cyclesRef.current
          const next = currentPhase === 'work'
            ? (currentCycles >= 3 ? 'long_break' : 'short_break')
            : 'work'
          if (next === 'work') setCycles((c) => c + 1)
          setPhase(next)
          return next === 'work' ? WORK : next === 'long_break' ? LONG_BREAK : SHORT_BREAK
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [running])

  const toggle = useCallback(() => setRunning((r) => !r), [])
  const reset = useCallback(() => {
    setTimeLeft(phaseDurations[phase])
    setRunning(false)
  }, [phase, phaseDurations])

  const total = phaseDurations[phase]
  const pct = ((total - timeLeft) / total) * 100

  return (
    <div className="pomodoro-widget">
      <div className="pomo-phase">{phaseLabels[phase]}</div>
      <div className="pomo-bar">
        <div className="pomo-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="pomo-time">{formatTime(timeLeft)}</div>
      <div className="pomo-actions">
        <button className="pomo-btn" onClick={toggle}>{running ? 'PAUSE' : 'START'}</button>
        <button className="pomo-btn" onClick={reset}>RESET</button>
      </div>
    </div>
  )
}

export default memo(Pomodoro)
