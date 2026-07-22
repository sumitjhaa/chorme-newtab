import React from 'react'
import { Box, BoxProps } from './Box'

/**
 * Props for the polymorphic SettingSelect component.
 */
export interface SettingSelectProps<As extends React.ElementType = 'select'> extends BoxProps<As> {
  /** Currently selected value. */
  value: string
  /** Callback fired when the selection changes. */
  onChange: (value: string) => void
  /** Available options to choose from. */
  options: { value: string; label: string }[]
}

/**
 * Polymorphic `<select>` for choosing from a list of options in settings.
 * Renders as `<select>` by default.
 *
 * @example <SettingSelect value={theme} onChange={setTheme} options={opts} />
 * @example <SettingSelect as="div" value={theme} onChange={setTheme} options={opts} />
 */
export function SettingSelect<As extends React.ElementType = 'select'>({
  as,
  value,
  onChange,
  options,
  className = '',
  ...props
}: SettingSelectProps<As>) {
  return (
    <Box
      as={as || 'select'}
      className={`setting-select ${className}`}
      value={value}
      onChange={(e: Event) => onChange((e.target as HTMLSelectElement).value)}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </Box>
  )
}
