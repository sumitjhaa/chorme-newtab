import { memo } from 'react'

function getInfo() {
  const ua = navigator.userAgent
  let browser = 'Unknown'
  if (ua.includes('Edg/')) browser = 'Edge'
  else if (ua.includes('Chrome/')) browser = 'Chrome'
  else if (ua.includes('Firefox/')) browser = 'Firefox'
  else if (ua.includes('Safari/')) browser = 'Safari'

  let os = 'Unknown'
  if (ua.includes('Windows NT')) os = 'Windows'
  else if (ua.includes('Mac OS X')) os = 'macOS'
  else if (ua.includes('Linux')) os = 'Linux'
  else if (ua.includes('Android')) os = 'Android'
  else if (ua.includes('iOS')) os = 'iOS'

  const cores = navigator.hardwareConcurrency || 4
  const mem = navigator.deviceMemory || 8

  return [
    { icon: '🌐', label: 'Browser', value: browser },
    { icon: '💻', label: 'OS', value: os },
    { icon: '📐', label: 'Resolution', value: `${screen.width}×${screen.height}` },
    { icon: '🧠', label: 'RAM', value: `${mem} GB`, bar: mem / 16 },
    { icon: '⚡', label: 'CPU', value: `${cores} cores`, bar: cores / 16 },
    { icon: '🌍', label: 'Language', value: navigator.language },
    { icon: '🕐', label: 'Timezone', value: Intl.DateTimeFormat().resolvedOptions().timeZone.split('/').pop().replace(/_/g, ' ') },
  ]
}

function SystemInfo() {
  const info = getInfo()

  return (
    <div className="sysinfo-widget">
      <div className="sysinfo-title">System Info</div>
      {info.map(({ icon, label, value, bar }) => (
        <div key={label} className="sysinfo-row">
          <span className="sysinfo-icon">{icon}</span>
          <span className="sysinfo-label">{label}</span>
          <span className="sysinfo-value">{value}</span>
          {bar !== undefined && (
            <div className="sysinfo-bar">
              <div className="sysinfo-bar-fill" style={{ width: `${Math.min(bar * 100, 100)}%` }} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default memo(SystemInfo)
