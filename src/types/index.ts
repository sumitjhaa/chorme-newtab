/**
  * @fileoverview Core type definitions for the application.
  */

/** Unique identifier for each widget type */
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

/** Column and order position for a widget in the layout */
export type LayoutPosition = {
    col: number
    order: number
}

/** Mapping of widget IDs to their layout positions */
export type LayoutMap = Record<WidgetId, LayoutPosition>

/** Clock time format preference */
export type ClockFormat = '12h' | '24h'
/** Date display format preference */
export type DateFormat = 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'
/** What to show alongside the clock */
export type ShowClockDate = 'both' | 'date_only' | 'none'

/** Background content type */
export type BgType = 'images' | 'videos' | 'local' | 'url' | 'solid'
/** How often to refresh the background */
export type BgFrequency = 'every_tab' | 'every_hour' | 'every_day' | 'daylight' | 'locked'
/** Wallpaper image source provider */
export type WallpaperSource = 'wallhaven'

/** Dark mode preference */
export type DarkMode = 'system' | 'light' | 'dark'
/** ISO 639-1 language code */
export type Language = string

/** Supported search engine identifiers */
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

/** How to determine the user's location for weather */
export type GeolocationMode = 'approximate' | 'manual' | 'disabled'
/** Weather forecast display mode */
export type ForecastMode = 'automatic' | 'hourly' | 'daily'
/** Temperature unit preference */
export type TempUnit = 'celsius' | 'fahrenheit'
/** What temperature to display */
export type TempDisplay = 'actual' | 'feels_like' | 'both'
/** What weather information to show */
export type WeatherShow = 'description_icon' | 'description' | 'icon' | 'none'

/**
  * Application settings configuration.
  * Contains all user preferences for widgets, appearance, and behavior.
  */
export interface Settings {
    // General
    /** Hide settings icons in the UI */
    hideSettingsIcons: boolean
    /** Custom browser tab title */
    tabTitle: string
    /** Dark mode preference */
    darkMode: DarkMode
    /** Interface language */
    language: Language

    // Widget visibility
    /** Show clock widget */
    showClockWidget: boolean
    /** Show calendar widget */
    showCalendarWidget: boolean
    /** Show pomodoro timer widget */
    showPomodoroWidget: boolean
    /** Show weather widget */
    showWeatherWidget: boolean
    /** Show sticky notes widget */
    showStickyNote: boolean
    /** Show whiteboard widget */
    showWhiteboard: boolean
    /** Show todo list widget */
    showList: boolean

    // Search bar
    /** Enable search bar widget */
    enableSearchBar: boolean
    /** Selected search engine */
    searchEngine: SearchEngineKey
    /** Placeholder text for search input */
    searchPlaceholder: string
    /** Search bar background blur (px) */
    searchBlur: number
    /** Open search results in new tab */
    openInNewTab: boolean
    /** Show search suggestions dropdown */
    showSuggestions: boolean

    // Greeting
    /** Enable greeting widget */
    enableGreeting: boolean
    /** Name to display in greeting */
    greetingName: string

    // Background
    /** Background content type */
    bgType: BgType
    /** Background image provider */
    bgProvider: WallpaperSource
    /** Background collection/category */
    bgCollection: string
    /** Background refresh frequency */
    bgFrequency: BgFrequency
    /** Background texture overlay */
    bgTexture: string
    /** Texture opacity (0-1) */
    bgTextureOpacity: number
    /** Texture pattern size (px) */
    bgTextureSize: number
    /** Texture color (hex) for applicable patterns */
    bgTextureColor: string
    /** Background blur amount (px) */
    bgBlur: number
    /** Background brightness (0-200) */
    bgBrightness: number
    /** Background fade transition time (ms) */
    bgFadeTime: number

    // Clock
    /** Clock time format */
    clockFormat: ClockFormat
    /** Show AM/PM indicator */
    showAmPm: boolean
    /** Show seconds on clock */
    showSeconds: boolean
    /** Use analog clock display */
    analogClock: boolean
    /** Timezone strings for world clock */
    worldClockTimezones: string[]
    /** Clock display size (rem) */
    clockSize: number
    /** Timezone for clock display */
    timeZone: string
    /** Date display format */
    dateFormat: DateFormat
    /** What to show alongside clock */
    showClockDate: ShowClockDate

    // Weather
    /** Geolocation mode for weather */
    geolocation: GeolocationMode
    /** Manual location string */
    manualLocation: string
    /** Temperature unit preference */
    tempUnit: TempUnit
    /** Forecast display mode */
    forecast: ForecastMode
    /** What temperature to display */
    tempDisplay: TempDisplay
    /** What weather info to show */
    weatherShow: WeatherShow

    // Pomodoro
    /** Work session duration (minutes) */
    pomodoroWork: number
    /** Short break duration (minutes) */
    pomodoroShort: number
    /** Long break duration (minutes) */
    pomodoroLong: number
    /** Cycles before long break */
    pomodoroCycles: number
}

/** Union of all Settings keys */
export type SettingsKey = keyof Settings
