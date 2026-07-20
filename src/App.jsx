import { useState, useEffect, useCallback, useRef } from 'react'
import SearchBar from './components/SearchBar.jsx'
import Wallpaper from './components/Wallpaper.jsx'
import Clock from './components/Clock.jsx'
import Calendar from './components/Calendar.jsx'
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
    }
  }
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

  return (
    <div className="app">
      <Wallpaper wallpaper={wallpaper} isLoading={isLoading} />

      {appSettings.showClockWidget && (
        <Draggable id="clock" defaultPosition={{ x: 50, y: 15 }}>
          <Clock />
        </Draggable>
      )}

      {appSettings.showCalendarWidget && (
        <Draggable id="calendar" defaultPosition={{ x: 50, y: 35 }}>
          <Calendar />
        </Draggable>
      )}

      <Draggable id="search-bar" defaultPosition={{ x: 50, y: 50 }}>
        <SearchBar />
      </Draggable>

      <Draggable id="bottom-buttons" defaultPosition={{ x: 50, y: 90 }}>
        <div className={`bottom-buttons visible`}>
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
      </Draggable>

      <Settings isOpen={isSettingsOpen} onClose={toggleSettings} />
    </div>
  )
}
