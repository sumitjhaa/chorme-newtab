import { useState, useEffect, memo } from 'react'

function loadSettings() {
  try {
    const data = JSON.parse(localStorage.getItem('newtab_settings') || '{}')
    return {
      enableGreeting: data.enableGreeting !== undefined ? data.enableGreeting : true,
      greetingName: data.greetingName || '',
      greetingSize: data.greetingSize !== undefined ? data.greetingSize : 32,
      fontFamily: data.fontFamily || 'Inter',
      fontWeight: data.fontWeight || 400,
      fontColor: data.fontColor || '#ffffff',
      fontShadow: data.fontShadow !== undefined ? data.fontShadow : 0,
    }
  } catch {
    return { enableGreeting: true, greetingName: '', greetingSize: 32, fontFamily: 'Inter', fontWeight: 400, fontColor: '#ffffff', fontShadow: 0 }
  }
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function Greeting() {
  const [settings, setSettings] = useState(loadSettings)

  useEffect(() => {
    const handler = () => setSettings(loadSettings())
    window.addEventListener('storage', handler)
    const id = setInterval(handler, 500)
    return () => { window.removeEventListener('storage', handler); clearInterval(id) }
  }, [])

  if (!settings.enableGreeting) return null

  const name = settings.greetingName ? `, ${settings.greetingName}` : ''

  return (
    <div className="greeting-widget" style={{
      fontSize: `${settings.greetingSize}px`,
      fontFamily: `'${settings.fontFamily}', sans-serif`,
      fontWeight: settings.fontWeight,
      color: settings.fontColor,
      textShadow: settings.fontShadow > 0 ? `0 0 ${settings.fontShadow}px rgba(0,0,0,0.8)` : 'none',
    }}>
      {getGreeting()}{name}
    </div>
  )
}

export default memo(Greeting)
