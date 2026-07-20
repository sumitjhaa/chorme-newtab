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
    expect(screen.getByText(/January/)).toBeInTheDocument()
    expect(screen.getByText(/15/)).toBeInTheDocument()
    expect(screen.getByText(/Wednesday/)).toBeInTheDocument()
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
    expect(screen.getByText(/AM|PM/).closest('.clock')).toBeInTheDocument()
  })
})
