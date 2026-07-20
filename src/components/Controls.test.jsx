import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Controls from './Controls.jsx'

const defaultProps = {
  source: 'wallhaven',
  sources: ['wallhaven', 'pixabay', 'picsum', 'catbox'],
  onSourceChange: vi.fn(),
  onRefresh: vi.fn(),
  isLoading: false,
  error: null,
}

describe('Controls', () => {
  it('renders refresh button and source select', () => {
    render(<Controls {...defaultProps} />)

    expect(screen.getByTitle('Refresh wallpaper')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('calls onRefresh when refresh button is clicked', () => {
    const onRefresh = vi.fn()
    render(<Controls {...defaultProps} onRefresh={onRefresh} />)

    fireEvent.click(screen.getByTitle('Refresh wallpaper'))
    expect(onRefresh).toHaveBeenCalledOnce()
  })

  it('disables refresh button when loading', () => {
    render(<Controls {...defaultProps} isLoading={true} />)

    expect(screen.getByTitle('Refresh wallpaper')).toBeDisabled()
  })

  it('calls onSourceChange when select value changes', () => {
    const onSourceChange = vi.fn()
    render(<Controls {...defaultProps} onSourceChange={onSourceChange} />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'pixabay' } })
    expect(onSourceChange).toHaveBeenCalledWith('pixabay')
  })

  it('displays all source options', () => {
    render(<Controls {...defaultProps} />)

    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(4)
    expect(options[0]).toHaveTextContent('Wallhaven')
    expect(options[1]).toHaveTextContent('Pixabay')
    expect(options[2]).toHaveTextContent('Picsum')
    expect(options[3]).toHaveTextContent('Catbox')
  })

  it('shows current source as selected', () => {
    render(<Controls {...defaultProps} source="pixabay" />)

    expect(screen.getByRole('combobox')).toHaveValue('pixabay')
  })

  it('displays error message when error is provided', () => {
    render(<Controls {...defaultProps} error="Something went wrong" />)

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('does not display error message when error is null', () => {
    const { container } = render(<Controls {...defaultProps} error={null} />)

    expect(container.querySelector('.error-message')).not.toBeInTheDocument()
  })
})
