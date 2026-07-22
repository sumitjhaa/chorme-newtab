import React from 'react'
import { Box, BoxProps } from './Box'

/**
 * A single segment option in a SegmentedControl.
 */
interface SegmentOption {
  /** Value identifying this option. */
  value: string
  /** Display label for this option. */
  label: string
}

/**
 * Props for the polymorphic SegmentedControl component.
 */
export interface SegmentedControlProps<As extends React.ElementType = 'div'> extends BoxProps<As> {
  /** Available segment options. */
  options: SegmentOption[]
  /** Currently active segment value. */
  value: string
  /** Callback fired when a different segment is selected. */
  onChange: (value: string) => void
}

/**
 * Polymorphic segmented control — a row of toggle buttons for selecting one value.
 * Renders as `<div>` by default.
 *
 * @example <SegmentedControl options={opts} value={v} onChange={setV} />
 * @example <SegmentedControl as="nav" options={opts} value={v} onChange={setV} />
 */
export function SegmentedControl<As extends React.ElementType = 'div'>({
  options,
  value,
  onChange,
  className = '',
  ...props
}: SegmentedControlProps<As>) {
  return (
    <Box className={`segmented-control ${className}`} {...props}>
      {options.map((opt) => (
        <button
          key={opt.value}
          className={`segmented-option ${value === opt.value ? 'active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </Box>
  )
}
