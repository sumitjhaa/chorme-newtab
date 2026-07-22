/**
  * @fileoverview Barrel export for the error boundary system.
  *
  * Provides three levels of error isolation:
  * - **ErrorBoundary** — core class component that catches render errors.
  * - **WidgetErrorBoundary** — per-widget wrapper with a styled fallback.
  * - **AppErrorBoundary** — top-level wrapper with a full-screen overlay.
  * - **ErrorFallback** — standalone reusable fallback UI.
  *
  * @example
  * ```tsx
  * import { WidgetErrorBoundary, AppErrorBoundary } from './components/errors'
  *
  * // Wrap individual widgets
  * <WidgetErrorBoundary widgetName="Weather">
  *   <Weather />
  * </WidgetErrorBoundary>
  *
  * // Wrap the entire app
  * <AppErrorBoundary>
  *   <App />
  * </AppErrorBoundary>
  * ```
  */

export { ErrorBoundary, type ErrorBoundaryProps, type ErrorBoundaryState } from './ErrorBoundary'
export { WidgetErrorBoundary, type WidgetErrorBoundaryProps } from './WidgetErrorBoundary'
export { AppErrorBoundary, type AppErrorBoundaryProps } from './AppErrorBoundary'
export { ErrorFallback, type ErrorFallbackProps } from './ErrorFallback'
