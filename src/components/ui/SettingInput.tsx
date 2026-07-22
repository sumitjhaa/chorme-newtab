// @ts-nocheck
interface SettingInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: 'text' | 'number'
  min?: number
  max?: number
  step?: number
  className?: string
}

export default function SettingInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  min,
  max,
  step,
  className = '',
}: SettingInputProps) {
  return (
    <input
      type={type}
      className={`setting-input ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      min={min}
      max={max}
      step={step}
    />
  )
}
