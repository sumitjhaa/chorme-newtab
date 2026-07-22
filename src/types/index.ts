// @ts-nocheck
import type { ReactNode } from 'react'

export type WidgetId =
  | 'clock'
  | 'calendar'
  | 'greeting'
  | 'pomodoro'
  | 'search-bar'
  | 'weather'
  | 'sticky-note'
  | 'whiteboard'
  | 'list'

export type LayoutPosition = {
  col: number
  order: number
}

export type LayoutMap = Record<WidgetId, LayoutPosition>

export type ClockPosition = 'left' | 'center' | 'right'
export type ClockFormat = '12h' | '24h'
export type DateFormat = 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'
export type ShowClockDate = 'both' | 'date_only' | 'none'

export type BgType = 'images' | 'videos' | 'local' | 'url' | 'solid'
export type BgFrequency = 'every_tab' | 'every_hour' | 'every_day' | 'daylight' | 'locked'
export type WallpaperSource = 'wallhaven' | 'unsplash' | 'pixabay' | 'picsum' | 'catbox'

export type DarkMode = 'system' | 'light' | 'dark'
export type Language = string // ISO 639-1

export type SearchEngineKey =
  | 'GOOGLE'
  | 'DUCKDUCKGO'
  | 'BING'
  | 'YAHOO'
  | 'BRAVE'
  | 'STARTPAGE'
  | 'QWANT'
  | 'ECOSIA'
  | 'SWISSCOWS'
  | 'MOJEEK'

export type GeolocationMode = 'approximate' | 'manual' | 'disabled'
export type ForecastMode = 'automatic' | 'hourly' | 'daily'
export type TempUnit = 'celsius' | 'fahrenheit'
export type TempDisplay = 'actual' | 'feels_like' | 'both'
export type WeatherShow = 'description_icon' | 'description' | 'icon' | 'none'
