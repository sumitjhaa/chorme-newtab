import { Box, BoxProps } from './Box'

/**
  * Props for the polymorphic SettingInput component.
  */
export interface SettingInputProps extends BoxProps<'div'> {
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
    /** Unique id for the underlying input. */
    id?: string
}

/**
  * Wrapper around a native input for settings panels.
  * Renders as a `<div>` containing an `<input>`, matching the other Setting* components.
  *
  * @example <SettingInput value={val} onChange={setVal} placeholder="Enter…" />
  */
export function SettingInput({
    value,
    onChange,
    placeholder,
    type = 'text',
    min,
    max,
    step,
    id,
    className = '',
    ...props
}: SettingInputProps) {
    return (
        <Box className={`setting-input-wrapper ${className}`} {...props}>
            <input
                id={id}
                type={type}
                className="setting-input"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                min={min}
                max={max}
                step={step}
            />
        </Box>
    )
}
