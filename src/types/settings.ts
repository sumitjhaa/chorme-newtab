// @ts-nocheck
import type {
  ClockPosition,
  ClockFormat,
  DateFormat,
  ShowClockDate,
  BgType,
  BgFrequency,
  WallpaperSource,
  DarkMode,
  Language,
  SearchEngineKey,
  GeolocationMode,
  ForecastMode,
  TempUnit,
  TempDisplay,
  WeatherShow,
} from './index'

export interface Settings {
  // General
  clockPosition: ClockPosition
  uiOpacity: number
  hideSettingsIcons: boolean
  showAllSettings: boolean
  tabTitle: string
  darkMode: DarkMode
  language: Language

  // Widget visibility
  showClockWidget: boolean
  showCalendarWidget: boolean
  showPomodoroWidget: boolean
  showWeatherWidget: boolean
  showStickyNote: boolean
  showWhiteboard: boolean
  showList: boolean

  // Search bar
  enableSearchBar: boolean
  searchEngine: SearchEngineKey
  searchPlaceholder: string
  searchBlur: number
  openInNewTab: boolean
  showSuggestions: boolean

  // Greeting
  enableGreeting: boolean
  greetingName: string
  greetingSize: number

  // Background
  wallpaperSource: WallpaperSource
  autoRefresh: boolean
  bgType: BgType
  bgProvider: WallpaperSource
  bgCollection: string
  bgFrequency: BgFrequency
  bgTexture: string
  bgBlur: number
  bgBrightness: number
  bgFadeTime: number

  // Typography
  fontFamily: string
  fontWeight: number
  fontColor: string
  fontSize: number
  fontShadow: number

  // Clock
  clockFormat: ClockFormat
  showAmPm: boolean
  showSeconds: boolean
  analogClock: boolean
  worldClockTimezones: string[]
  clockSize: number
  timeZone: string
  dateFormat: DateFormat
  showClockDate: ShowClockDate

  // Weather
  geolocation: GeolocationMode
  manualLocation: string
  tempUnit: TempUnit
  forecast: ForecastMode
  tempDisplay: TempDisplay
  weatherShow: WeatherShow

  // Pomodoro
  pomodoroWork: number
  pomodoroShort: number
  pomodoroLong: number
  pomodoroCycles: number
}

export type SettingsKey = keyof Settings
