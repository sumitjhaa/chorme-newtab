import React from 'react'
import { ErrorBoundary } from './ErrorBoundary'

/**
  * Props for the top-level application error boundary.
  */
export interface AppErrorBoundaryProps {
    /** The entire application tree to protect. */
    children: React.ReactNode
}

const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost'

/**
  * Full-viewport error overlay shown when the entire application crashes.
  *
  * This should wrap the root of the application (typically the `<App />` or
  * whatever is rendered into `#root`). It catches errors that propagate past
  * every widget-level boundary and renders a dark overlay with a reload button.
  *
  * @example
  * ```tsx
  * ReactDOM.createRoot(document.getElementById('root')!).render(
  *   <AppErrorBoundary>
  *     <App />
  *   </AppErrorBoundary>
  * )
  * ```
  */
export class AppErrorBoundary extends ErrorBoundary {
    constructor(props: AppErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    render() {
        if (!this.state.hasError || !this.state.error) {
            return this.props.children
        }

        const { error } = this.state

        return (
            <div
                style={{
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
                }}
            >
                <span
                    style={{
                        fontSize: '3rem',
                        lineHeight: 1,
                        color: '#f87171',
                        marginBottom: '1rem',
                    }}
                    aria-hidden
                >
                    &#x2715;
                </span>

                <span
                    style={{
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: '#ffffff',
                        marginBottom: '0.35rem',
                    }}
                >
                    Something went wrong
                </span>

                <span
                    style={{
                        fontSize: '0.75rem',
                        color: '#888888',
                        marginBottom: '1.25rem',
                        textAlign: 'center',
                        maxWidth: '400px',
                    }}
                >
                    The application encountered an unexpected error and cannot continue.
                </span>

                {isDev && error?.message && (
                    <pre
                        style={{
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
                        }}
                    >
                        {error.message}
                        {error.stack && `\n\n${error.stack}`}
                    </pre>
                )}

                <button
                    onClick={() => window.location.reload()}
                    style={{
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
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#5eaaff'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#4a9eff'
                    }}
                >
                    Reload Page
                </button>
            </div>
        )
    }
}
