/**
 * @fileoverview Toggle switch component for boolean settings.
 */

import type { InputHTMLAttributes } from 'react'

/** Props for the ToggleSwitch component */
interface ToggleSwitchProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Label text */
  label?: string
  /** Input element ID */
  id?: string
  /** Whether toggle is on */
  checked: boolean
  /** Default checked state */
  defaultChecked?: boolean
  /** Change handler */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  /** Whether toggle is disabled */
  disabled?: boolean
  /** Additional CSS class */
  className?: string
}

/**
 * Toggle switch component for boolean settings.
 * Displays an on/off toggle with optional label.
 * 
 * @param props - ToggleSwitchProps
 * @example <ToggleSwitch checked={darkMode} onChange={setDarkMode} label="Dark Mode" />
 */
export default function ToggleSwitch({
  label,
  id,
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  className = "",
  ...props
}: ToggleSwitchProps) {
  const labelId = id ? `${id}-label` : undefined;

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
          defaultChecked={defaultChecked}
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
  );
}
