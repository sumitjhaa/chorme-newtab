import { useState, useEffect, useCallback, useRef } from 'react'
import SearchBar from './components/SearchBar.jsx'
import Wallpaper from './components/Wallpaper.jsx'
import Clock from './components/Clock.jsx'
import Calendar from './components/Calendar.jsx'
import Pomodoro from './components/Pomodoro.jsx'
import Weather from './components/Weather.jsx'
import Greeting from './components/Greeting.jsx'
import StickyNote from './components/StickyNote.jsx'
import Lists from './components/list/Lists.jsx'
import Whiteboard from './components/whiteboard/Whiteboard.jsx'
import Settings from './components/Settings.jsx'
import Draggable from './components/Draggable.jsx'
import { fetchRandomWallpaper } from './api/index.js'
import { getCurrentWallpaper, setCurrentWallpaper, getWallpaperSource } from './utils/storage.js'
import { API_SOURCES, DEFAULT_REFRESH_INTERVAL } from './constants.js'
import { useSettings } from './hooks/useSettings.js'
import { useTranslation } from './hooks/useTranslation.js'

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

const NUM_COLUMNS = 6

import { LAYOUT_DEFAULTS } from './utils/defaults.js'

function loadLayout() {
  try {
    return JSON.parse(localStorage.getItem('newtab_layout') || 'null') || LAYOUT_DEFAULTS
  } catch {
    return LAYOUT_DEFAULTS
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
  const { t } = useTranslation()
  const { settings } = useSettings()
  const [wallpaper, setWallpaper] = useState(null)
  const [source, setSource] = useState(API_SOURCES.WALLHAVEN)
  const [isLoading, setIsLoading] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
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
    applyDarkMode(settings.darkMode)
  }, [settings.darkMode])

  useEffect(() => {
    document.title = settings.tabTitle || t('newTab')
  }, [settings.tabTitle])

  useEffect(() => {
    document.documentElement.style.setProperty('--font-family', `'${settings.fontFamily}', sans-serif`)
    document.documentElement.style.setProperty('--font-weight', settings.fontWeight)
    document.documentElement.style.setProperty('--font-color', settings.fontColor)
    document.documentElement.style.setProperty('--font-size', `${Math.round(settings.fontSize)}%`)
    document.documentElement.style.setProperty('--font-shadow', settings.fontShadow > 0 ? `0 0 ${settings.fontShadow}px rgba(0,0,0,0.8)` : 'none')
  }, [settings.fontFamily, settings.fontWeight, settings.fontColor, settings.fontSize, settings.fontShadow])

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--bg-blur', `${settings.bgBlur}px`)
    root.style.setProperty('--bg-brightness', `${settings.bgBrightness}%`)
  }, [settings.bgBlur, settings.bgBrightness])

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
  if (settings.showClockWidget)       visibleWidgets.push({ id: 'clock', component: <Clock /> })
  if (settings.showCalendarWidget)    visibleWidgets.push({ id: 'calendar', component: <Calendar /> })
  if (settings.showPomodoroWidget)    visibleWidgets.push({ id: 'pomodoro', component: <Pomodoro /> })
  if (settings.showWeatherWidget)     visibleWidgets.push({ id: 'weather', component: <Weather /> })
  if (settings.showStickyNote)        visibleWidgets.push({ id: 'sticky-note', component: <StickyNote /> })
  if (settings.showWhiteboard)        visibleWidgets.push({ id: 'whiteboard', component: <Whiteboard onDelete={() => {
    const data = JSON.parse(localStorage.getItem('newtab_settings') || '{}')
    data.showWhiteboard = false
    localStorage.setItem('newtab_settings', JSON.stringify(data))
    try { chrome.storage.local.set({ showWhiteboard: false }) } catch {}
    window.dispatchEvent(new Event('storage'))
  }} /> })
  if (settings.showList)              visibleWidgets.push({ id: 'list', component: <Lists /> })
  if (settings.enableGreeting)          visibleWidgets.push({ id: 'greeting', component: <Greeting /> })
  if (settings.enableSearchBar)       visibleWidgets.push({ id: 'search-bar', component: <SearchBar /> })

  const columns = Array.from({ length: NUM_COLUMNS }, () => [])
  const searchBarWidget = visibleWidgets.find(w => w.id === 'search-bar')
  const sbLayout = layout['search-bar'] || { col: 1 }
  const sbCol = Math.min(sbLayout.col ?? 1, NUM_COLUMNS - 2)

  visibleWidgets.forEach(w => {
    if (w.id === 'search-bar') return
    const pos = layout[w.id] || { col: 0, order: 0 }
    const col = Math.min(pos.col, NUM_COLUMNS - 1)
    columns[col].push({ ...w, order: pos.order })
  })
  columns.forEach(col => col.sort((a, b) => a.order - b.order))

  const [sbHeightPx, setSbHeightPx] = useState(0)
  const [sbPos, setSbPos] = useState({ left: 0, width: 0, top: 0 })
  const sbMeasureRef = useCallback((node) => {
    if (node) setSbHeightPx(node.offsetHeight)
  }, [])

  useEffect(() => {
    if (!settings.enableSearchBar || !searchBarWidget) return
    const columns = document.querySelectorAll('.kanban-column')
    if (columns.length < sbCol + 2) return
    const board = document.querySelector('.kanban-board')
    if (!board) return
    const boardRect = board.getBoundingClientRect()
    const firstCol = columns[sbCol].getBoundingClientRect()
    const secondCol = columns[sbCol + 1].getBoundingClientRect()
    setSbPos({
      left: firstCol.left - boardRect.left,
      width: secondCol.right - firstCol.left,
      top: firstCol.top - boardRect.top,
    })
  }, [settings.enableSearchBar, sbCol, searchBarWidget])


  return (
    <div className="app">
      <Wallpaper wallpaper={wallpaper} isLoading={isLoading} />

      <div className="kanban-board">
        {searchBarWidget && settings.enableSearchBar && (
          <div
            className="search-bar-span"
            style={{ left: sbPos.left, width: sbPos.width, top: sbPos.top }}
            ref={sbMeasureRef}
          >
            <Draggable
              id="search-bar"
              col={sbCol}
              onDrop={handleDrop}
              numColumns={NUM_COLUMNS}
              maxCol={NUM_COLUMNS - 2}
              span={2}
            >
              {searchBarWidget.component}
            </Draggable>
          </div>
        )}

        {columns.map((colWidgets, colIndex) => {
          const covered = settings.enableSearchBar && colIndex >= sbCol && colIndex <= sbCol + 1
          return (
            <div
              className="kanban-column"
              key={colIndex}
              data-col={colIndex}
              style={{
                gridColumn: colIndex + 1,
              }}
            >
              <div className="kanban-column-inner" style={covered ? { paddingTop: sbHeightPx + 12 } : undefined}>
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
          )
        })}
      </div>

      <div className={`bottom-buttons visible${settings.hideSettingsIcons ? ' hidden-icons' : ''}`}>
        <button
          className="refresh-btn"
          onClick={() => loadWallpaper()}
          disabled={isLoading}
          title={t('refreshWallpaper')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
            <path d="M21 3v5h-5"/>
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
            <path d="M8 16H3v5"/>
          </svg>
        </button>

        <button className="settings-btn" onClick={toggleSettings} title={t('settingsEsc')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>
      </div>

      <Settings isOpen={isSettingsOpen} onClose={toggleSettings} />
    </div>
  )
}
