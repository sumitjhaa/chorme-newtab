import React from 'react'
import { Box, BoxProps } from './Box'

/**
  * Props for the polymorphic ToggleSwitch component.
  */
export interface ToggleSwitchProps<As extends React.ElementType = 'label'> extends BoxProps<As> {
    /** Whether the toggle is on. */
    checked: boolean
    /** Callback fired when the toggle state changes. */
    onChange: (checked: boolean) => void
    /** Optional label displayed beside the toggle. */
    label?: string
    /** Unique id linking the label to the input. */
    id?: string
}

/**
  * Polymorphic toggle switch with a hidden checkbox input and styled label.
  * Renders as `<label>` by default.
  *
  * @example <ToggleSwitch checked={on} onChange={setOn} label="Dark mode" />
  * @example <ToggleSwitch as="div" checked={on} onChange={setOn} />
  */
export function ToggleSwitch<As extends React.ElementType = 'label'>({
    checked, onChange, label, id, className = '', children, ...props
}: ToggleSwitchProps<As>) {
    const inputId = id || React.useId()

    const handleToggle = () => {
        onChange(!checked)
    }

    return (
        <Box
            className={`toggle-switch ${checked ? 'active' : ''} ${className}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
            {...props}
        >
            <input
                type="checkbox"
                id={inputId}
                checked={checked}
                onChange={handleToggle}
                style={{ display: 'none' }}
            />
            <span
                className="toggle-track"
                style={{
                    position: 'relative',
                    width: '2.25rem',
                    height: '1.25rem',
                    borderRadius: '0.625rem',
                    background: checked ? 'var(--accent, #3b82f6)' : 'var(--muted, #6b7280)',
                    transition: 'background 0.2s'
                }}
            >
                <span
                    className="toggle-thumb"
                    style={{
                        position: 'absolute',
                        top: '0.125rem',
                        left: checked ? '1.125rem' : '0.125rem',
                        width: '1rem',
                        height: '1rem',
                        borderRadius: '50%',
                        background: '#fff',
                        transition: 'left 0.2s'
                    }}
                />
            </span>
            {(label || children) && (
                <span className="toggle-label">{label || children}</span>
            )}
        </Box>
    )
}
