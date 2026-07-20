import { useState, useEffect, useCallback, memo } from 'react'

function loadSettings() {
  try {
    const data = JSON.parse(localStorage.getItem('newtab_settings') || '{}')
    return {
      geolocation: data.geolocation || 'approximate',
      manualLocation: data.manualLocation || '',
      tempUnit: data.tempUnit || 'celsius',
      forecast: data.forecast || 'automatic',
      tempDisplay: data.tempDisplay || 'actual',
      weatherShow: data.weatherShow || 'description_icon',
    }
  } catch {
    return {
      geolocation: 'approximate',
      manualLocation: '',
      tempUnit: 'celsius',
      forecast: 'automatic',
      tempDisplay: 'actual',
      weatherShow: 'description_icon',
    }
  }
}

async function fetchCoords(geolocation, manualLocation) {
  if (geolocation === 'manual' && manualLocation) {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(manualLocation)}&count=1&language=en&format=json`)
    const data = await res.json()
    if (data.results && data.results.length) {
      return { lat: data.results[0].latitude, lon: data.results[0].longitude, name: data.results[0].name, country: data.results[0].country || '' }
    }
    return null
  }
  if (geolocation !== 'never') {
    try {
      const pos = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000, enableHighAccuracy: geolocation === 'precise' })
      )
      return { lat: pos.coords.latitude, lon: pos.coords.longitude, name: '', country: '' }
    } catch {}
  }
  return null
}

async function fetchWeather(lat, lon, unit) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: 'temperature_2m,apparent_temperature,weather_code',
    daily: 'temperature_2m_max,temperature_2m_min,weather_code',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    forecast_days: 1,
  })
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`)
  return res.json()
}

const WEATHER_CODES = {
  0: { label: 'Clear', icon: '☀️' },
  1: { label: 'Mainly clear', icon: '🌤️' },
  2: { label: 'Partly cloudy', icon: '⛅' },
  3: { label: 'Overcast', icon: '☁️' },
  45: { label: 'Foggy', icon: '🌫️' },
  48: { label: 'Depositing rime fog', icon: '🌫️' },
  51: { label: 'Light drizzle', icon: '🌦️' },
  53: { label: 'Moderate drizzle', icon: '🌦️' },
  55: { label: 'Dense drizzle', icon: '🌧️' },
  56: { label: 'Light freezing drizzle', icon: '🌧️' },
  57: { label: 'Dense freezing drizzle', icon: '🌧️' },
  61: { label: 'Slight rain', icon: '🌦️' },
  63: { label: 'Moderate rain', icon: '🌧️' },
  65: { label: 'Heavy rain', icon: '🌧️' },
  66: { label: 'Light freezing rain', icon: '🌧️' },
  67: { label: 'Heavy freezing rain', icon: '🌧️' },
  71: { label: 'Slight snow', icon: '🌨️' },
  73: { label: 'Moderate snow', icon: '🌨️' },
  75: { label: 'Heavy snow', icon: '❄️' },
  77: { label: 'Snow grains', icon: '❄️' },
  80: { label: 'Slight rain showers', icon: '🌦️' },
  81: { label: 'Moderate rain showers', icon: '🌧️' },
  82: { label: 'Violent rain showers', icon: '🌧️' },
  85: { label: 'Slight snow showers', icon: '🌨️' },
  86: { label: 'Heavy snow showers', icon: '🌨️' },
  95: { label: 'Thunderstorm', icon: '⛈️' },
  96: { label: 'Thunderstorm with slight hail', icon: '⛈️' },
  99: { label: 'Thunderstorm with heavy hail', icon: '⛈️' },
}

function toF(c) { return Math.round(c * 9 / 5 + 32) }

function Weather() {
  const [settings, setSettings] = useState(loadSettings)
  const [weather, setWeather] = useState(null)
  const [location, setLocation] = useState('')
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setError(null)
    try {
      const coords = await fetchCoords(settings.geolocation, settings.manualLocation)
      if (!coords) { setError('Location unavailable'); return }
      const data = await fetchWeather(coords.lat, coords.lon, settings.tempUnit)
      if (!data.current) { setError('Weather unavailable'); return }
      setWeather(data)
      if (coords.name) setLocation(`${coords.name}${coords.country ? ', ' + coords.country : ''}`)
    } catch {
      setError('Failed to load weather')
    }
  }, [settings.geolocation, settings.manualLocation, settings.tempUnit])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    function handleStorage() {
      setSettings(loadSettings())
    }
    window.addEventListener('storage', handleStorage)
    const interval = setInterval(handleStorage, 1000)
    return () => {
      window.removeEventListener('storage', handleStorage)
      clearInterval(interval)
    }
  }, [])

  if (error) {
    return <div className="weather-widget"><div className="weather-error">{error}</div></div>
  }

  if (!weather) {
    return <div className="weather-widget"><div className="weather-loading">Loading...</div></div>
  }

  const code = weather.current.weather_code
  const info = WEATHER_CODES[code] || { label: 'Unknown', icon: '❓' }
  const temp = settings.tempUnit === 'fahrenheit' ? toF(weather.current.temperature_2m) : Math.round(weather.current.temperature_2m)
  const feels = settings.tempUnit === 'fahrenheit' ? toF(weather.current.apparent_temperature) : Math.round(weather.current.apparent_temperature)
  const unit = settings.tempUnit === 'fahrenheit' ? '°F' : '°C'

  let tempStr = ''
  if (settings.tempDisplay === 'actual') tempStr = `${temp}${unit}`
  else if (settings.tempDisplay === 'feels_like') tempStr = `${feels}${unit}`
  else tempStr = `${temp}${unit} / Feels ${feels}${unit}`

  return (
    <div className="weather-widget">
      {location && <div className="weather-location">{location}</div>}
      <div className="weather-main">
        {settings.weatherShow !== 'description' && <span className="weather-icon">{info.icon}</span>}
        {settings.weatherShow !== 'icon' && <span className="weather-desc">{info.label}</span>}
      </div>
      <div className="weather-temp">{tempStr}</div>
    </div>
  )
}

export default memo(Weather)
