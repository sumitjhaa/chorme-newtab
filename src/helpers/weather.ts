/**
  * @fileoverview Weather API utilities for fetching and formatting weather data.
  */

/** Get the WMO weather description code to translation key mapping */
export function getWeatherDescriptionKey(code: number): string {
    const mapping: Record<number, string> = {
        0: 'clear',
        1: 'mainlyClear',
        2: 'partlyCloudy',
        3: 'overcast',
        45: 'foggy',
        48: 'depositingRimeFog',
        51: 'lightDrizzle',
        53: 'moderateDrizzle',
        55: 'denseDrizzle',
        61: 'slightRain',
        63: 'moderateRain',
        65: 'heavyRain',
        71: 'slightSnow',
        73: 'moderateSnow',
        75: 'heavySnow',
        80: 'rainShowers',
        81: 'moderateShowers',
        82: 'heavyShowers',
        95: 'thunderstorm',
        96: 'thunderstormHail',
        99: 'heavyThunderstorm',
    }
    return mapping[code] || 'unknown'
}

/** Format temperature with the user's preferred unit */
export function formatTemp(tempCelsius: number, unit: 'celsius' | 'fahrenheit'): string {
    const value = unit === 'fahrenheit' ? Math.round(tempCelsius * 9 / 5 + 32) : Math.round(tempCelsius)
    const suffix = unit === 'fahrenheit' ? '°F' : '°C'
    return `${value}${suffix}`
}

/** Build the Open-Meteo API URL for weather data */
export function buildWeatherUrl(lat: number, lon: number, tempUnit: 'celsius' | 'fahrenheit'): string {
    const params = new URLSearchParams({
        latitude: String(lat),
        longitude: String(lon),
        current: 'temperature_2m,apparent_temperature,weather_code',
        daily: 'temperature_2m_max,temperature_2m_min,weather_code',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        forecast_days: '1',
    })
    if (tempUnit === 'fahrenheit') {
        params.set('temperature_unit', 'fahrenheit')
    }
    return `https://api.open-meteo.com/v1/forecast?${params.toString()}`
}

/** Build the Open-Meteo geocoding URL */
export function buildGeocodeUrl(location: string): string {
    const params = new URLSearchParams({
        name: location,
        count: '1',
        language: 'en',
        format: 'json',
    })
    return `https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`
}
