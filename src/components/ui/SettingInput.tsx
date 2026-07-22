import React from 'react'
import { Box, BoxProps } from './Box'

/**
 * Props for the polymorphic SettingInput component.
 */
export interface SettingInputProps<As extends React.ElementType = 'input'> extends BoxProps<As> {
  /** Current input value. */
  value: string
  /** Callback fired when the input value changes. */
  onChange: (value: string) => void
  /** Placeholder text when empty. */
  placeholder?: string
  /** Input type. */
  type?: 'text' | 'number'
  /** Minimum value for numeric inputs. */
  min?: number
  /** Maximum value for numeric inputs. */
  max?: number
  /** Step increment for numeric inputs. */
  step?: number
}

/**
 * Polymorphic text/number input for settings panels.
 * Renders as `<input>` by default.
 *
 * @example <SettingInput value={val} onChange={setVal} placeholder="Enter…" />
 * @example <SettingInput as="textarea" value={val} onChange={setVal} />
 */
export function SettingInput<As extends React.ElementType = 'input'>({
  as,
  value,
  onChange,
  placeholder,
  type = 'text',
  min,
  max,
  step,
  className = '',
  ...props
}: SettingInputProps<As>) {
  return (
    <Box
      as={as || 'input'}
      type={type}
      className={`setting-input ${className}`}
      value={value}
      onChange={(e: Event) => onChange((e.target as HTMLInputElement).value)}
      placeholder={placeholder}
      min={min}
      max={max}
      step={step}
      {...props}
    />
  )
}
