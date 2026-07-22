// @ts-nocheck
import type { ReactNode } from 'react'

interface SettingRowProps {
  label: string
  children: ReactNode
  className?: string
}

export default function SettingRow({ label, children, className = '' }: SettingRowProps) {
  return (
    <div className={`setting-row ${className}`}>
      <span className="setting-label">{label}</span>
      {children}
    </div>
  )
}
