import React from 'react'
import { ErrorBoundary } from './ErrorBoundary'

/**
 * Props for the per-widget error boundary wrapper.
 *
 * Provides a lightweight way to isolate individual widgets so that a crash in
 * one does not take down the entire application.
 */
export interface WidgetErrorBoundaryProps {
  /** Display name for the widget, shown in the fallback UI and error logs. */
  widgetName: string
  /** The widget content to wrap with error isolation. */
  children: React.ReactNode
  /**
   * Optional custom fallback UI.
   * - ReactNode: rendered directly when an error occurs.
   * - Function: receives the caught Error and a `reset` callback.
   */
  fallback?: React.ReactNode | ((error: Error, reset: () => void) => React.ReactNode)
}

const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost'

/**
 * Styled error card shown when a widget crashes.
 *
 * Matches the extension's glassmorphism widget design language while clearly
 * communicating the failure to the user.
 */
function WidgetFallback({
  error,
  reset,
  widgetName,
}: {
  error: Error
  reset: () => void
  widgetName: string
}) {
  return (
    <div
      style={{
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
      }}
    >
      <span
        style={{
          fontSize: '1.5rem',
          lineHeight: 1,
          color: '#f87171',
        }}
        aria-hidden
      >
        &#x2715;
      </span>

      <span
        style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          color: 'var(--text-secondary, rgba(255,255,255,0.65))',
        }}
      >
        {widgetName}
      </span>

      <span
        style={{
          fontSize: '0.7rem',
          color: 'var(--text-tertiary, rgba(255,255,255,0.35))',
        }}
      >
        Failed to load
      </span>

      {isDev && error?.message && (
        <span
          style={{
            fontSize: '0.6rem',
            color: 'rgba(248, 113, 113, 0.8)',
            wordBreak: 'break-word',
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1.4,
          }}
        >
          {error.message}
        </span>
      )}

      <button
        onClick={reset}
        style={{
          marginTop: '0.15rem',
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
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
        }}
      >
        Try Again
      </button>
    </div>
  )
}

/**
 * Per-widget error boundary that wraps a single widget and isolates it from the
 * rest of the application.
 *
 * When the wrapped widget throws during rendering, the boundary catches the
 * error and renders a styled fallback that includes the widget name, a retry
 * button, and (in development) the error message.
 *
 * @example
 * ```tsx
 * <WidgetErrorBoundary widgetName="Weather">
 *   <Weather />
 * </WidgetErrorBoundary>
 * ```
 */
export function WidgetErrorBoundary({
  widgetName,
  children,
  fallback,
}: WidgetErrorBoundaryProps) {
  const handleError = (error: Error) => {
    if (isDev) {
      console.error(`[WidgetErrorBoundary:${widgetName}]`, error)
    }
  }

  const defaultFallback = (error: Error, reset: () => void) => (
    <WidgetFallback error={error} reset={reset} widgetName={widgetName} />
  )

  return (
    <ErrorBoundary
      name={widgetName}
      onError={handleError}
      fallback={fallback ?? defaultFallback}
      showRetry={false}
    >
      {children}
    </ErrorBoundary>
  )
}
