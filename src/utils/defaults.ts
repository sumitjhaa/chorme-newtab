/**
  * @fileoverview Default settings and layout values for the application.
  */

import type { Settings } from '../types'

export const SETTINGS_DEFAULTS: Settings = {
    hideSettingsIcons: false,
    tabTitle: 'New Tab',
    darkMode: 'system',
    language: 'en',

    showClockWidget: true,
    showCalendarWidget: true,
    showPomodoroWidget: false,
    showWeatherWidget: false,
    showStickyNote: false,
    showWhiteboard: false,
    showList: false,
    listIds: [],

    enableSearchBar: true,
    searchEngine: 'GOOGLE',
    searchPlaceholder: 'Search with Google or type a URL',
    searchBlur: 20,
    openInNewTab: true,
    showSuggestions: true,

    enableGreeting: true,
    greetingName: '',

    bgFrequency: 'every_tab',
    bgBlur: 0,
    bgBrightness: 100,

    clockFormat: '12h',
    showAmPm: true,
    showSeconds: false,
    analogClock: false,
    worldClockTimezones: [],
    clockSize: 100,
    timeZone: 'local',
    dateFormat: 'DD/MM/YYYY',
    showClockDate: 'both',

    geolocation: 'approximate',
    manualLocation: '',
    tempUnit: 'celsius',
    forecast: 'automatic',
    tempDisplay: 'actual',
    weatherShow: 'description_icon',

    pomodoroWork: 25,
    pomodoroShort: 5,
    pomodoroLong: 15,
    pomodoroCycles: 4,
}

/** Default widget layout positions */
export const LAYOUT_DEFAULTS = {
    clock:         { col: 0, order: 0 },
    calendar:      { col: 0, order: 1 },
    greeting:      { col: 0, order: 2 },
    pomodoro:      { col: 1, order: 0 },
    'search-bar':  { col: 1, order: -1 },
    weather:       { col: 2, order: 0 },
    'sticky-note': { col: 3, order: 0 },
    whiteboard:    { col: 4, order: 0 },
} satisfies Record<string, { col: number; order: number }>
