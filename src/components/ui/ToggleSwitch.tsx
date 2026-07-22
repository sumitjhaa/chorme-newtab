/**
 * @fileoverview Toggle switch component using CSS classes from settings.css.
 * Rectangular design with I/O text indicators and a sliding square thumb.
 */

/**
 * Props for the ToggleSwitch component.
 */
export interface ToggleSwitchProps {
    /** Whether the toggle is on. */
    checked: boolean
    /** Callback fired when the toggle state changes. */
    onChange: (...args: any[]) => void
    /** Optional label displayed beside the toggle. */
    label?: string
    /** Unique id linking the label to the input. */
    id?: string
    /** Whether the toggle is disabled. */
    disabled?: boolean
    /** Additional CSS class names. */
    className?: string
}

/**
 * Toggle switch with a hidden checkbox input and styled label.
 * Uses CSS classes from settings.css for the rectangular I/O design.
 *
 * @example <ToggleSwitch checked={on} onChange={fn} label="Dark mode" />
 */
export function ToggleSwitch({
    label,
    id,
    checked,
    onChange,
    disabled = false,
    className = '',
    ...props
}: ToggleSwitchProps) {
    const labelId = id ? `${id}-label` : undefined

    return (
        <div className={`toggle-wrapper ${className}`}>
            {label && (
                <span id={labelId} className="toggle-label">
                    {label}
                </span>
            )}

            <label className="toggle">
                <input
                    id={id}
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    disabled={disabled}
                    aria-labelledby={labelId}
                    {...props}
                />

                <span className="toggle-track">
                    <span className="toggle-text-on">I</span>
                    <span className="toggle-thumb" />
                    <span className="toggle-text-off">O</span>
                </span>
            </label>
        </div>
    )
}

export default ToggleSwitch
