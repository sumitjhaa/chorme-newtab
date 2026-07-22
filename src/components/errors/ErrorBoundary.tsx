import React from 'react'

/**
  * Props for the core ErrorBoundary component.
  *
  * Error boundaries MUST be class components in React — there is no hook-based
  * equivalent for catching errors in child component trees during rendering,
  * lifecycle methods, and constructors.
  */
export interface ErrorBoundaryProps {
    /** The child elements to protect from uncaught render errors. */
    children: React.ReactNode
    /**
      * Custom fallback UI rendered when an error is caught.
      * - If a ReactNode, it is rendered directly (the error object is still logged).
      * - If a function, it receives the caught Error and a `reset` callback that
      *   clears the error state and attempts to re-render the children.
      */
    fallback?: React.ReactNode | ((error: Error, reset: () => void) => React.ReactNode)
    /** Called every time an error is caught. Use for logging / telemetry. */
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void
    /** Human-readable component name shown in the default fallback and error logs. */
    name?: string
    /** Whether to show a retry button in the default fallback. Defaults to `true`. */
    showRetry?: boolean
}

/**
  * Internal state managed by the ErrorBoundary.
  */
export interface ErrorBoundaryState {
    /** Whether the boundary has caught an error and is currently in the error state. */
    hasError: boolean
    /** The most recently caught error, or `null` when no error is active. */
    error: Error | null
}

const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost'

/**
  * Core error boundary class component.
  *
  * Wraps its `children` and catches any errors that occur during React rendering,
  * inside lifecycle methods, or in constructors of descendant components. When an
  * error is caught the boundary transitions into an error state and renders either
  * a custom `fallback` or a styled default error card.
  *
  * @example
  * ```tsx
  * <ErrorBoundary name="Clock" onError={(e, i) => logError(e, i)}>
  *   <Clock />
  * </ErrorBoundary>
  * ```
  */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        const componentName = this.props.name || 'Unknown'
        if (isDev) {
            console.error(`[ErrorBoundary:${componentName}]`, error, errorInfo)
        }
        this.props.onError?.(error, errorInfo)
    }

    /** Clears the error state so children are re-rendered. */
    reset = () => {
        this.setState({ hasError: false, error: null })
    }

    render() {
        if (!this.state.hasError || !this.state.error) {
            return this.props.children
        }

        const { error } = this.state
        const { fallback, name, showRetry = true } = this.props

        if (typeof fallback === 'function') {
            return fallback(error, this.reset)
        }

        if (fallback) {
            return fallback
        }

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
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        color: 'var(--text-tertiary, rgba(255,255,255,0.35))',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                    }}
                >
                    {name ? `Failed to load ${name}` : 'Something went wrong'}
                </span>

                {isDev && error?.message && (
                    <span
                        style={{
                            fontSize: '0.65rem',
                            color: 'var(--text-tertiary, rgba(255,255,255,0.35))',
                            wordBreak: 'break-word',
                            maxWidth: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {error.message}
                    </span>
                )}

                {showRetry && (
                    <button
                        onClick={this.reset}
                        style={{
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
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                        }}
                    >
                        Retry
                    </button>
                )}
            </div>
        )
    }
}
