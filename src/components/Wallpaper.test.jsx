import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Wallpaper from './Wallpaper.jsx'

describe('Wallpaper', () => {
  it('renders wallpaper image when wallpaper has url', () => {
    render(<Wallpaper wallpaper={{ url: 'https://example.com/img.jpg' }} isLoading={false} />)

    const img = screen.getByRole('img', { name: 'Wallpaper' })
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://example.com/img.jpg')
  })

  it('renders default background when wallpaper is null', () => {
    const { container } = render(<Wallpaper wallpaper={null} isLoading={false} />)

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(container.querySelector('.default-background')).toBeInTheDocument()
  })

  it('renders default background when wallpaper has no url', () => {
    const { container } = render(<Wallpaper wallpaper={{ source: 'wallhaven' }} isLoading={false} />)

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(container.querySelector('.default-background')).toBeInTheDocument()
  })

  it('shows loading overlay when isLoading is true', () => {
    const { container } = render(<Wallpaper wallpaper={null} isLoading={true} />)

    expect(container.querySelector('.loading-overlay')).toBeInTheDocument()
    expect(container.querySelector('.spinner')).toBeInTheDocument()
  })

  it('hides loading overlay when isLoading is false', () => {
    const { container } = render(<Wallpaper wallpaper={null} isLoading={false} />)

    expect(container.querySelector('.loading-overlay')).not.toBeInTheDocument()
  })

  it('always renders wallpaper overlay', () => {
    const { container } = render(<Wallpaper wallpaper={{ url: 'test.jpg' }} isLoading={false} />)

    expect(container.querySelector('.wallpaper-overlay')).toBeInTheDocument()
  })

  it('uses eager loading for images', () => {
    render(<Wallpaper wallpaper={{ url: 'test.jpg' }} isLoading={false} />)

    expect(screen.getByRole('img')).toHaveAttribute('loading', 'eager')
  })
})
