import Dropdown from './Dropdown'

export interface SettingSelectProps {
    value: string
    onChange: (value: string) => void
    options: { value: string; label: string }[]
    className?: string
    width?: number | string
}

export function SettingSelect({ value, onChange, options, className = '', width }: SettingSelectProps) {
    return <Dropdown value={value} onChange={onChange} options={options} className={className} width={width} />
}
