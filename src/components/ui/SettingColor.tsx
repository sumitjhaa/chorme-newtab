import React from 'react'
import { Box, BoxProps } from './Box'

export interface SettingColorProps<As extends React.ElementType = 'div'> extends BoxProps<As> {
    label: string
    value: string
    onChange: (value: string) => void
}

export function SettingColor<As extends React.ElementType = 'div'>({
    label,
    value,
    onChange,
    className = '',
    ...props
}: SettingColorProps<As>) {
    return (
        <Box className={`setting-row ${className}`} {...props}>
            <span className="setting-label">{label}</span>
            <div className="color-control">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="color-input"
                />
                <span className="range-value">{value}</span>
            </div>
        </Box>
    )
}
