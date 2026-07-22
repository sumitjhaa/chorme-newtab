import React from 'react'
import { Box, BoxProps } from './Box'

/**
  * Props for the polymorphic SettingRow component.
  */
export interface SettingRowProps<As extends React.ElementType = 'div'> extends BoxProps<As> {
    /** Label displayed on the left side of the row. */
    label: string
}

/**
  * A labeled settings row built on the polymorphic `Box`.
  * Renders as `<div>` by default.
  *
  * @example <SettingRow label="Name"><input /></SettingRow>
  * @example <SettingRow as="li" label="Theme"><select /></SettingRow>
  */
export function SettingRow<As extends React.ElementType = 'div'>({
    label,
    children,
    className = '',
    ...props
}: SettingRowProps<As>) {
    return (
        <Box className={`setting-row ${className}`} {...props}>
            <span className="setting-label">{label}</span>
            {children}
        </Box>
    )
}
