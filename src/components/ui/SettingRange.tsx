import { useEffect, useRef } from 'react'
import { Box, BoxProps } from './Box'

export interface SettingRangeProps<As extends React.ElementType = 'div'> extends BoxProps<As> {
    label: string
    value: number
    min: number
    max: number
    step?: number
    unit?: string
    format?: (v: number) => string
    onChange: (value: number) => void
}

export function SettingRange<As extends React.ElementType = 'div'>({
    label,
    value,
    min,
    max,
    step = 1,
    unit = '',
    format,
    onChange,
    className = '',
    ...props
}: SettingRangeProps<As>) {
    const inputRef = useRef<HTMLInputElement>(null)
    const display = format ? format(value) : `${value}${unit}`

    useEffect(() => {
        const el = inputRef.current
        if (!el) return
        el.style.setProperty('--value', String(value))
        el.style.setProperty('--min', String(min))
        el.style.setProperty('--max', String(max))
    }, [value, min, max])

    return (
        <Box className={`setting-row ${className}`} {...props}>
            <span className="setting-label">{label}</span>
            <div className="range-control">
                <input
                    ref={inputRef}
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="slider"
                />
                <span className="range-value">{display}</span>
            </div>
        </Box>
    )
}
