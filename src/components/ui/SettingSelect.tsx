// @ts-nocheck
interface SettingSelectProps {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  className?: string
}

export default function SettingSelect({ value, onChange, options, className = '' }: SettingSelectProps) {
  return (
    <select
      className={`setting-select ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
