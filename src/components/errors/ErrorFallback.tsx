import React from 'react'

/**
 * Props for the reusable ErrorFallback component.
 */
export interface ErrorFallbackProps {
  /** The error that triggered the fallback display. */
  error: Error
  /** Callback to reset the error boundary and attempt re-rendering. */
  onRetry: () => void
  /** Display name of the component that failed. Shown in the heading when set. */
  componentName?: string
  /**
   * Whether to show the full error message and stack trace.
   * Defaults to `true` in development, `false` in production.
   */
  showDetails?: boolean
  /**
   * Visual variant:
   * - `'inline'` — compact card suitable for a single widget slot.
   * - `'full'` — full-viewport overlay for top-level crashes.
   */
  variant?: 'inline' | 'full'
}

const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost'

const INLINE_STYLES: Record<string, React.CSSProperties> = {
  root: {
    background: 'var(--wallpaper-color, rgba(0,0,0,0.4))',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: 'var(--radius-lg, 10px)',
    padding: '1rem',
    width: '100%',
    fontFamily: "var(--font-family, 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif)",
    color: 'var(--text-primary, #ffffff)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
  },
  icon: {
    fontSize: '1.5rem',
    lineHeight: 1,
    color: '#f87171',
  },
  heading: {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: 'var(--text-secondary, rgba(255,255,255,0.65))',
  },
  message: {
    fontSize: '0.65rem',
    color: 'var(--text-tertiary, rgba(255,255,255,0.35))',
    wordBreak: 'break-word',
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  retryButton: {
    marginTop: '0.25rem',
    background: 'rgba(255,255,255,0.08)',
    border: 'none',
    color: 'var(--text-primary, #ffffff)',
    padding: '4px 14px',
    borderRadius: '4px',
    fontSize: '0.7rem',
    fontWeight: 600,
    letterSpacing: '0.05em',
    cursor: 'pointer',
    transition: 'background 0.12s ease',
    fontFamily: 'inherit',
  },
}

const FULL_STYLES: Record<string, React.CSSProperties> = {
  root: {
    position: 'fixed',
    inset: 0,
    zIndex: 99999,
    background: '#111111',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "var(--font-family, 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif)",
    color: '#ffffff',
    padding: '2rem',
  },
  icon: {
    fontSize: '3rem',
    lineHeight: 1,
    color: '#f87171',
    marginBottom: '1rem',
  },
  heading: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#ffffff',
    marginBottom: '0.35rem',
  },
  message: {
    fontSize: '0.75rem',
    color: '#888888',
    marginBottom: '1.25rem',
    textAlign: 'center',
    maxWidth: '400px',
  },
  details: {
    fontSize: '0.65rem',
    color: '#888888',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '6px',
    padding: '0.75rem 1rem',
    maxWidth: '560px',
    width: '100%',
    overflow: 'auto',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    marginBottom: '1.25rem',
    lineHeight: 1.5,
  },
  retryButton: {
    background: '#4a9eff',
    border: 'none',
    color: '#ffffff',
    padding: '8px 24px',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.05em',
    cursor: 'pointer',
    transition: 'background 0.12s ease',
    fontFamily: 'inherit',
  },
}

/**
 * Reusable fallback UI component for error boundaries.
 *
 * Renders a styled error card with an icon, heading, optional detail text, and a
 * retry button. The `variant` prop controls whether the fallback is an inline
 * widget-sized card or a full-viewport overlay.
 *
 * @example
 * ```tsx
 * <ErrorFallback
 *   error={error}
 *   onRetry={reset}
 *   componentName="Weather"
 *   variant="inline"
 * />
 * ```
 */
export function ErrorFallback({
  error,
  onRetry,
  componentName,
  showDetails = isDev,
  variant = 'inline',
}: ErrorFallbackProps) {
  const s = variant === 'full' ? FULL_STYLES : INLINE_STYLES
  const heading = componentName
    ? `Failed to load ${componentName}`
    : 'Something went wrong'

  return (
    <div style={s.root}>
      <span style={s.icon} aria-hidden>&#x2715;</span>
      <span style={s.heading}>{heading}</span>
      <span style={s.message}>
        {variant === 'full'
          ? 'The application encountered an unexpected error and cannot continue.'
          : 'This component encountered an error.'}
      </span>

      {showDetails && error?.message && (
        <pre style={s.details}>
          {error.message}
          {error.stack && `\n\n${error.stack}`}
        </pre>
      )}

      <button
        onClick={onRetry}
        style={s.retryButton}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = variant === 'full' ? '#5eaaff' : 'rgba(255,255,255,0.15)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = variant === 'full' ? '#4a9eff' : 'rgba(255,255,255,0.08)'
        }}
      >
        {variant === 'full' ? 'Reload Page' : 'Try Again'}
      </button>
    </div>
  )
}
