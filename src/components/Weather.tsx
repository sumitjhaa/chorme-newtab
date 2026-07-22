/**
 * @fileoverview Weather widget component displaying current conditions.
 */

import { useState, useEffect, useCallback, memo } from 'react'
import { useTranslation } from '../hooks/useTranslation'
import { useSettings } from '../hooks/useSettings'

/** Weather location coordinates */
interface WeatherCoords {
  /** Latitude */
  lat: number
  /** Longitude */
  lon: number
  /** Location name */
  name: string
  /** Country name */
  country: string
}

/** Weather API response data */
interface WeatherData {
  /** Current weather conditions */
  current: {
    /** Temperature in Celsius */
    temperature_2m: number
    /** Apparent temperature in Celsius */
    apparent_temperature: number
    /** WMO weather code */
    weather_code: number
  }
  /** Daily forecast data */
  daily: {
    /** Maximum temperatures */
    temperature_2m_max: number[]
    /** Minimum temperatures */
    temperature_2m_min: number[]
  }
}

/**
 * Fetch location coordinates based on geolocation settings.
 * @param geolocation - Geolocation mode
 * @param manualLocation - Manual location string
 * @returns Coordinates or null if unavailable
 */
async function fetchCoords(geolocation: string, manualLocation: string): Promise<WeatherCoords | null> {
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
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000, enableHighAccuracy: geolocation === 'precise' })
      )
      return { lat: pos.coords.latitude, lon: pos.coords.longitude, name: '', country: '' }
    } catch {}
  }
  return null
}

/**
 * Fetch weather data from Open-Meteo API.
 * @param lat - Latitude
 * @param lon - Longitude
 * @param unit - Temperature unit
 * @returns Weather data
 */
async function fetchWeather(lat: number, lon: number, unit: string): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: 'temperature_2m,apparent_temperature,weather_code',
    daily: 'temperature_2m_max,temperature_2m_min,weather_code',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    forecast_days: '1',
  })
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`)
  return res.json() as Promise<WeatherData>
}

/** Weather code display information */
interface WeatherCodeInfo {
  /** Localized weather description */
  label: string
  /** Weather emoji icon */
  icon: string
}

/**
 * Get weather code display info with translations.
 * @param t - Translation function
 * @returns Map of weather codes to display info
 */
function getWeatherCodes(t: (key: string) => string): Record<number, WeatherCodeInfo> {
  return {
    0: { label: t('clear'), icon: '☀️' },
    1: { label: t('mainlyClear'), icon: '🌤️' },
    2: { label: t('partlyCloudy'), icon: '⛅' },
    3: { label: t('overcast'), icon: '☁️' },
    45: { label: t('foggy'), icon: '🌫️' },
    48: { label: t('depositingRimeFog'), icon: '🌫️' },
    51: { label: t('lightDrizzle'), icon: '🌦️' },
    53: { label: t('moderateDrizzle'), icon: '🌦️' },
    55: { label: t('denseDrizzle'), icon: '🌧️' },
    61: { label: t('slightRain'), icon: '🌦️' },
    63: { label: t('moderateRain'), icon: '🌧️' },
    65: { label: t('heavyRain'), icon: '🌧️' },
    71: { label: t('slightSnow'), icon: '🌨️' },
    73: { label: t('moderateSnow'), icon: '🌨️' },
    75: { label: t('heavySnow'), icon: '❄️' },
    80: { label: t('rainShowers'), icon: '🌦️' },
    81: { label: t('moderateShowers'), icon: '🌧️' },
    82: { label: t('heavyShowers'), icon: '🌧️' },
    95: { label: t('thunderstorm'), icon: '⛈️' },
    96: { label: t('thunderstormHail'), icon: '⛈️' },
    99: { label: t('heavyThunderstorm'), icon: '⛈️' },
  }
}

/**
 * Convert Celsius to Fahrenheit.
 * @param c - Temperature in Celsius
 * @returns Temperature in Fahrenheit
 */
function toF(c: number): number { return Math.round(c * 9 / 5 + 32) }

/**
 * Convert temperature to the specified unit.
 * @param c - Temperature in Celsius
 * @param unit - Target unit
 * @returns Converted temperature
 */
function convertTemp(c: number, unit: string): number { return unit === 'fahrenheit' ? toF(c) : Math.round(c) }

/**
 * Get unit label string.
 * @param unit - Temperature unit
 * @returns Unit label (°C or °F)
 */
function unitLabel(unit: string): string { return unit === 'fahrenheit' ? '°F' : '°C' }

/**
 * Weather widget displaying current conditions with geolocation support.
 * 
 * @example <Weather />
 */
function Weather() {
  const { t } = useTranslation()
  const { settings } = useSettings()
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [location, setLocation] = useState('')
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setError(null)
    try {
      const coords = await fetchCoords(settings.geolocation, settings.manualLocation)
      if (!coords) { setError(t('locationUnavailable')); return }
      const data = await fetchWeather(coords.lat, coords.lon, settings.tempUnit)
      if (!data.current) { setError(t('weatherUnavailable')); return }
      setWeather(data)
      if (coords.name) setLocation(`${coords.name}${coords.country ? ', ' + coords.country : ''}`)
    } catch {
      setError(t('failedToLoad'))
    }
  }, [settings.geolocation, settings.manualLocation, settings.tempUnit, t])

  useEffect(() => { load() }, [load])

  if (error) {
    return <div className="weather-widget"><div className="weather-error">{error}</div></div>
  }

  if (!weather) {
    return <div className="weather-widget"><div className="weather-loading">{t('loading')}</div></div>
  }

  const weatherCodes = getWeatherCodes(t)
  const code = weather.current.weather_code
  const info = weatherCodes[code as number] || { label: t('unknown'), icon: '❓' }
  const u = settings.tempUnit
  const temp = convertTemp(weather.current.temperature_2m, u)
  const feels = convertTemp(weather.current.apparent_temperature, u)
  const hi = convertTemp(weather.daily.temperature_2m_max[0], u)
  const lo = convertTemp(weather.daily.temperature_2m_min[0], u)
  const label = unitLabel(u)

  let tempStr = ''
  if (settings.tempDisplay === 'actual') tempStr = `${temp}${label}`
  else if (settings.tempDisplay === 'feels_like') tempStr = `${feels}${label}`
  else tempStr = `${temp}${label} / ${t('feels')} ${feels}${label}`

  return (
    <div className="weather-widget">
      <div className="weather-title">{t('weather')}</div>
      {location && <div className="weather-location">{location}</div>}
      <div className="weather-main">
        {settings.weatherShow !== 'description' && <span className="weather-icon">{info.icon}</span>}
        {settings.weatherShow !== 'icon' && <span className="weather-desc">{info.label}</span>}
      </div>
      <div className="weather-temp">{tempStr}</div>
      <div className="weather-hilo">
        <span className="weather-hi">↑ {hi}{label}</span>
        <span className="weather-lo">↓ {lo}{label}</span>
      </div>
    </div>
  )
}

export default memo(Weather)
