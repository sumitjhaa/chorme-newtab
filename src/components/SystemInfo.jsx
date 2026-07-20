import { useState, useEffect, useRef, memo } from 'react'

function getStaticInfo() {
  return [
    { label: 'Browser', value: /Edg\//.test(navigator.userAgent) ? 'Edge' : /Chrome\//.test(navigator.userAgent) ? 'Chrome' : /Firefox\//.test(navigator.userAgent) ? 'Firefox' : 'Safari' },
    { label: 'OS', value: /Windows/.test(navigator.userAgent) ? 'Windows' : /Mac OS X/.test(navigator.userAgent) ? 'macOS' : /Linux/.test(navigator.userAgent) ? 'Linux' : 'Other' },
    { label: 'Resolution', value: `${screen.width}×${screen.height}` },
    { label: 'CPU', value: `${navigator.hardwareConcurrency || '?'} cores` },
    { label: 'RAM', value: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'N/A' },
  ]
}

function MiniGraph({ data, color = 'var(--accent)', height = 24 }) {
  const max = Math.max(...data, 1)
  const w = 200
  const h = height
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h}`).join(' ')
  const area = `0,${h} ${points} ${w},${h}`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="sys-graph" style={{ height }}>
      <defs>
        <linearGradient id={`grad-${color.replace(/[^a-zA-Z0-9]/g, '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#grad-${color.replace(/[^a-zA-Z0-9]/g, '')})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

function SystemInfo() {
  const staticInfo = getStaticInfo()
  const [battery, setBattery] = useState(null)
  const [batteryLevel, setBatteryLevel] = useState(100)
  const [batteryHistory, setBatteryHistory] = useState(Array(30).fill(100))
  const [heapUsed, setHeapUsed] = useState(0)
  const [heapTotal, setHeapTotal] = useState(0)
  const [heapHistory, setHeapHistory] = useState(Array(30).fill(0))
  const [netDown, setNetDown] = useState(null)
  const [netHistory, setNetHistory] = useState(Array(30).fill(0))
  const [netRtt, setNetRtt] = useState(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    navigator.getBattery?.().then((b) => {
      setBattery(b)
      setBatteryLevel(Math.round(b.level * 100))
      setBatteryHistory(Array(30).fill(Math.round(b.level * 100)))
      b.addEventListener('levelchange', () => setBatteryLevel(Math.round(b.level * 100)))
    })

    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    if (conn) {
      setNetDown(conn.downlink)
      setNetRtt(conn.rtt)
      conn.addEventListener('change', () => {
        setNetDown(conn.downlink)
        setNetRtt(conn.rtt)
      })
    }

    intervalRef.current = setInterval(() => {
      const perf = performance.memory
      if (perf) {
        const used = Math.round(perf.usedJSHeapSize / 1048576)
        const total = Math.round(perf.jsHeapSizeLimit / 1048576)
        setHeapUsed(used)
        setHeapTotal(total)
        setHeapHistory((prev) => [...prev.slice(1), used])
      }

      if (conn) {
        setNetDown(conn.downlink)
        setNetHistory((prev) => [...prev.slice(1), conn.downlink || 0])
      }

      if (battery) {
        setBatteryLevel(Math.round(battery.level * 100))
        setBatteryHistory((prev) => [...prev.slice(1), Math.round(battery.level * 100)])
      }
    }, 1000)

    return () => clearInterval(intervalRef.current)
  }, [])

  const heapPct = heapTotal > 0 ? (heapUsed / heapTotal) * 100 : 0

  return (
    <div className="sysinfo-widget">
      <div className="sysinfo-title">System Info</div>
      {staticInfo.map(({ label, value }) => (
        <div key={label} className="sysinfo-row">
          <span className="sysinfo-label">{label}</span>
          <span className="sysinfo-value">{value}</span>
        </div>
      ))}

      {battery !== null && (
        <div className="sysinfo-section">
          <div className="sysinfo-section-title">
            Battery
            <span className={`sysinfo-badge ${batteryLevel < 20 ? 'low' : ''}`}>{batteryLevel}%</span>
          </div>
          <MiniGraph data={batteryHistory} color="#4a9eff" />
        </div>
      )}

      {heapTotal > 0 && (
        <div className="sysinfo-section">
          <div className="sysinfo-section-title">
            JS Heap
            <span className="sysinfo-badge">{heapUsed} / {heapTotal} MB</span>
          </div>
          <div className="sysinfo-bar">
            <div className="sysinfo-bar-fill" style={{ width: `${heapPct}%` }} />
          </div>
          <MiniGraph data={heapHistory} color="#a78bfa" />
        </div>
      )}

      {netDown !== null && (
        <div className="sysinfo-section">
          <div className="sysinfo-section-title">
            Network
            <span className="sysinfo-badge">{netDown} Mbps{netRtt ? ` · ${netRtt}ms` : ''}</span>
          </div>
          <MiniGraph data={netHistory} color="#34d399" />
        </div>
      )}
    </div>
  )
}

export default memo(SystemInfo)
