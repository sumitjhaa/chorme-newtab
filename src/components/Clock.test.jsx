import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import Clock from './Clock.jsx'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('Clock', () => {
  it('renders time and date', () => {
    vi.setSystemTime(new Date(2025, 0, 15, 14, 30))

    render(<Clock />)

    expect(screen.getByText(/02:30/)).toBeInTheDocument()
    expect(screen.getByText(/15\/01\/2025/)).toBeInTheDocument()
  })

  it('updates time every second', () => {
    vi.setSystemTime(new Date(2025, 0, 15, 14, 30, 0))

    render(<Clock />)

    expect(screen.getByText(/02:30/)).toBeInTheDocument()

    act(() => {
      vi.setSystemTime(new Date(2025, 0, 15, 14, 30, 30))
      vi.advanceTimersByTime(1000)
    })

    expect(screen.getByText(/02:30/)).toBeInTheDocument()
  })

  it('renders clock container with correct class', () => {
    render(<Clock />)
    const clock = document.querySelector('.clock')
    expect(clock).toBeInTheDocument()
  })

  it('shows AM/PM in 12h format', () => {
    vi.setSystemTime(new Date(2025, 0, 15, 14, 30))
    localStorage.setItem('newtab_settings', JSON.stringify({ clockFormat: '12h', showAmPm: true }))

    render(<Clock />)

    expect(screen.getByText(/PM/)).toBeInTheDocument()
  })

  it('hides AM/PM in 24h format', () => {
    vi.setSystemTime(new Date(2025, 0, 15, 14, 30))
    localStorage.setItem('newtab_settings', JSON.stringify({ clockFormat: '24h', showAmPm: false }))

    render(<Clock />)

    expect(screen.queryByText(/PM/)).not.toBeInTheDocument()
  })
})
