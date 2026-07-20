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

  const lines = [
    { label: 'Browser', value: browser },
    { label: 'OS', value: os },
    { label: 'Resolution', value: `${screen.width}×${screen.height}` },
    { label: 'CPU cores', value: String(navigator.hardwareConcurrency || '?') },
    { label: 'Language', value: navigator.language },
    { label: 'Timezone', value: Intl.DateTimeFormat().resolvedOptions().timeZone },
  ]

  if (navigator.deviceMemory) {
    lines.splice(3, 0, { label: 'RAM', value: `${navigator.deviceMemory} GB` })
  }

  return lines
}

function SystemInfo() {
  const info = getInfo()

  return (
    <div className="sysinfo-widget">
      {info.map(({ label, value }) => (
        <div key={label} className="sysinfo-row">
          <span className="sysinfo-label">{label}</span>
          <span className="sysinfo-value">{value}</span>
        </div>
      ))}
    </div>
  )
}

export default memo(SystemInfo)
