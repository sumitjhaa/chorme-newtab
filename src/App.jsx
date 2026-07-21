import { useState, useEffect, useCallback, useRef } from 'react'
import SearchBar from './components/SearchBar.jsx'
import Wallpaper from './components/Wallpaper.jsx'
import Clock from './components/Clock.jsx'
import Calendar from './components/Calendar.jsx'
import Pomodoro from './components/Pomodoro.jsx'
import SystemInfo from './components/SystemInfo.jsx'
import Weather from './components/Weather.jsx'
import Greeting from './components/Greeting.jsx'
import Settings from './components/Settings.jsx'
import Draggable from './components/Draggable.jsx'
import { fetchRandomWallpaper } from './api/index.js'
import { getCurrentWallpaper, setCurrentWallpaper, getWallpaperSource } from './utils/storage.js'
import { API_SOURCES, DEFAULT_REFRESH_INTERVAL } from './constants.js'

function extractWallpaperColors(imgUrl) {
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.onload = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const size = 50
    canvas.width = size
    canvas.height = size
    ctx.drawImage(img, 0, 0, size, size)
    const data = ctx.getImageData(0, 0, size, size).data

    let r = 0, g = 0, b = 0, count = 0
    for (let i = 0; i < data.length; i += 16) {
      r += data[i]
      g += data[i + 1]
      b += data[i + 2]
      count++
    }
    r = Math.round(r / count)
    g = Math.round(g / count)
    b = Math.round(b / count)

    document.documentElement.style.setProperty('--wallpaper-color', `rgba(${r}, ${g}, ${b}, 0.45)`)
    document.documentElement.style.setProperty('--wallpaper-color-light', `rgba(${r}, ${g}, ${b}, 0.25)`)
  }
  img.src = imgUrl
}

const NUM_COLUMNS = 6

function loadAllSettings() {
  try {
    const data = JSON.parse(localStorage.getItem('newtab_settings') || '{}')
    return {
      clockPosition: data.clockPosition || 'center',
      uiOpacity: data.uiOpacity !== undefined ? data.uiOpacity : 80,
      hideSettingsIcons: data.hideSettingsIcons !== undefined ? data.hideSettingsIcons : false,
      showAllSettings: data.showAllSettings !== undefined ? data.showAllSettings : true,
      tabTitle: data.tabTitle || 'New Tab',
      darkMode: data.darkMode || 'system',
      language: data.language || 'en',
      showClockWidget: data.showClockWidget !== undefined ? data.showClockWidget : true,
      showCalendarWidget: data.showCalendarWidget !== undefined ? data.showCalendarWidget : true,
      showPomodoroWidget: data.showPomodoroWidget !== undefined ? data.showPomodoroWidget : false,
      showSystemInfoWidget: data.showSystemInfoWidget !== undefined ? data.showSystemInfoWidget : false,
      showWeatherWidget: data.showWeatherWidget !== undefined ? data.showWeatherWidget : false,
      enableSearchBar: data.enableSearchBar !== undefined ? data.enableSearchBar : true,
      fontFamily: data.fontFamily || 'Inter',
      fontWeight: data.fontWeight || 400,
      fontColor: data.fontColor || '#ffffff',
      fontSize: data.fontSize !== undefined ? data.fontSize : 16,
      fontShadow: data.fontShadow !== undefined ? data.fontShadow : 0,
      bgBlur: data.bgBlur !== undefined ? data.bgBlur : 0,
      bgBrightness: data.bgBrightness !== undefined ? data.bgBrightness : 100,
    }
  } catch {
    return {
      clockPosition: 'center',
      uiOpacity: 80,
      hideSettingsIcons: false,
      showAllSettings: true,
      tabTitle: 'New Tab',
      darkMode: 'system',
      language: 'en',
      showClockWidget: true,
      showCalendarWidget: true,
      showPomodoroWidget: false,
      showSystemInfoWidget: false,
      showWeatherWidget: false,
      enableSearchBar: true,
      fontFamily: 'Inter',
      fontWeight: 400,
      fontColor: '#ffffff',
      fontSize: 16,
      fontShadow: 0,
      bgBlur: 0,
      bgBrightness: 100,
    }
  }
}

const DEFAULT_LAYOUT = {
  clock:       { col: 0, order: 0 },
  calendar:    { col: 0, order: 1 },
  greeting:    { col: 0, order: 2 },
  pomodoro:    { col: 1, order: 0 },
  'system-info': { col: 1, order: 1 },
  'search-bar':  { col: 1, order: 2 },
  weather:     { col: 2, order: 0 },
}

function loadLayout() {
  try {
    return JSON.parse(localStorage.getItem('newtab_layout') || 'null') || DEFAULT_LAYOUT
  } catch {
    return DEFAULT_LAYOUT
  }
}

function saveLayout(layout) {
  try {
    localStorage.setItem('newtab_layout', JSON.stringify(layout))
  } catch {}
}

function applyDarkMode(mode) {
  if (mode === 'light') {
    document.documentElement.classList.remove('dark')
    document.documentElement.classList.add('light')
  } else if (mode === 'dark') {
    document.documentElement.classList.remove('light')
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('light', 'dark')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    document.documentElement.classList.add(prefersDark ? 'dark' : 'light')
  }
}

export default function App() {
  const [wallpaper, setWallpaper] = useState(null)
  const [source, setSource] = useState(API_SOURCES.WALLHAVEN)
  const [isLoading, setIsLoading] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [appSettings, setAppSettings] = useState(loadAllSettings)
  const [layout, setLayout] = useState(loadLayout)
  const intervalRef = useRef(null)

  const loadWallpaper = useCallback(async (selectedSource) => {
    setIsLoading(true)

    try {
      const newWallpaper = await fetchRandomWallpaper(selectedSource || source)
      setWallpaper(newWallpaper)
      await setCurrentWallpaper(newWallpaper)
      if (newWallpaper?.url) extractWallpaperColors(newWallpaper.url)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [source])

  const toggleSettings = useCallback(() => {
    setIsSettingsOpen((prev) => !prev)
  }, [])

  const handleDrop = useCallback((widgetId, targetCol, targetOrder) => {
    setLayout(prev => {
      const next = { ...prev }

      const affectedInTarget = Object.entries(next)
        .filter(([id, pos]) => id !== widgetId && pos.col === targetCol)
        .sort((a, b) => a[1].order - b[1].order)

      affectedInTarget.forEach(([id, pos], i) => {
        if (i >= targetOrder) {
          next[id] = { ...pos, order: i + 1 }
        } else {
          next[id] = pos
        }
      })

      next[widgetId] = { col: targetCol, order: targetOrder }
      saveLayout(next)
      return next
    })
  }, [])

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setIsSettingsOpen((prev) => !prev)
      }
      if (e.key === 'r' && !e.ctrlKey && !e.metaKey && !e.target.closest('input, textarea, select')) {
        loadWallpaper()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [loadWallpaper])

  useEffect(() => {
    function handleStorage() {
      setAppSettings(loadAllSettings())
    }
    window.addEventListener('storage', handleStorage)
    const interval = setInterval(handleStorage, 300)
    return () => {
      window.removeEventListener('storage', handleStorage)
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    applyDarkMode(appSettings.darkMode)
  }, [appSettings.darkMode])

  useEffect(() => {
    document.title = appSettings.tabTitle || 'New Tab'
  }, [appSettings.tabTitle])

  useEffect(() => {
    document.documentElement.style.setProperty('--font-family', `'${appSettings.fontFamily}', sans-serif`)
    document.documentElement.style.setProperty('--font-weight', appSettings.fontWeight)
    document.documentElement.style.setProperty('--font-color', appSettings.fontColor)
    document.documentElement.style.setProperty('--font-size', `${Math.round(appSettings.fontSize)}%`)
    document.documentElement.style.setProperty('--font-shadow', appSettings.fontShadow > 0 ? `0 0 ${appSettings.fontShadow}px rgba(0,0,0,0.8)` : 'none')
  }, [appSettings.fontFamily, appSettings.fontWeight, appSettings.fontColor, appSettings.fontSize, appSettings.fontShadow])

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--bg-blur', `${appSettings.bgBlur}px`)
    root.style.setProperty('--bg-brightness', `${appSettings.bgBrightness}%`)
  }, [appSettings.bgBlur, appSettings.bgBrightness])

  useEffect(() => {
    async function init() {
      const savedWallpaper = await getCurrentWallpaper()
      const savedSource = await getWallpaperSource()

      if (savedSource) setSource(savedSource)
      if (savedWallpaper) {
        setWallpaper(savedWallpaper)
        if (savedWallpaper.url) extractWallpaperColors(savedWallpaper.url)
      } else {
        await loadWallpaper(savedSource || API_SOURCES.WALLHAVEN)
      }
    }

    init()
  }, [])

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      loadWallpaper()
    }, DEFAULT_REFRESH_INTERVAL)

    return () => clearInterval(intervalRef.current)
  }, [loadWallpaper])

  const visibleWidgets = []
  if (appSettings.showClockWidget)       visibleWidgets.push({ id: 'clock', component: <Clock /> })
  if (appSettings.showCalendarWidget)    visibleWidgets.push({ id: 'calendar', component: <Calendar /> })
  if (appSettings.showPomodoroWidget)    visibleWidgets.push({ id: 'pomodoro', component: <Pomodoro /> })
  if (appSettings.showSystemInfoWidget)  visibleWidgets.push({ id: 'system-info', component: <SystemInfo /> })
  if (appSettings.showWeatherWidget)     visibleWidgets.push({ id: 'weather', component: <Weather /> })
  visibleWidgets.push({ id: 'greeting', component: <Greeting /> })
  if (appSettings.enableSearchBar)       visibleWidgets.push({ id: 'search-bar', component: <SearchBar /> })

  const columns = Array.from({ length: NUM_COLUMNS }, () => [])
  visibleWidgets.forEach(w => {
    const pos = layout[w.id] || { col: 0, order: 0 }
    const col = Math.min(pos.col, NUM_COLUMNS - 1)
    columns[col].push({ ...w, order: pos.order })
  })
  columns.forEach(col => col.sort((a, b) => a.order - b.order))

  return (
    <div className="app">
      <Wallpaper wallpaper={wallpaper} isLoading={isLoading} />

      <div className="kanban-board">
        {columns.map((colWidgets, colIndex) => (
          <div className="kanban-column" key={colIndex} data-col={colIndex}>
            <div className="kanban-column-inner">
              {colWidgets.map(w => (
                <Draggable
                  key={w.id}
                  id={w.id}
                  col={colIndex}
                  onDrop={handleDrop}
                  numColumns={NUM_COLUMNS}
                >
                  {w.component}
                </Draggable>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bottom-buttons visible">
        <button
          className="refresh-btn"
          onClick={() => loadWallpaper()}
          disabled={isLoading}
          title="Refresh wallpaper"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
            <path d="M21 3v5h-5"/>
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
            <path d="M8 16H3v5"/>
          </svg>
        </button>

        <button className="settings-btn" onClick={toggleSettings} title="Settings (Esc)">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            <circle cx="12" cy="12" r="4"/>
          </svg>
        </button>
      </div>

      <Settings isOpen={isSettingsOpen} onClose={toggleSettings} />
    </div>
  )
}
