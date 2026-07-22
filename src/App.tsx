/**
 * @fileoverview Main application component that orchestrates the new tab page.
 */

import { useState, useEffect, useCallback } from 'react'
import SearchBar from './components/SearchBar'
import Wallpaper from './components/Wallpaper'
import Clock from './components/Clock'
import Calendar from './components/Calendar'
import Pomodoro from './components/Pomodoro'
import Weather from './components/Weather'
import Greeting from './components/Greeting'
import StickyNote from './components/StickyNote'
import Lists from './components/list/Lists'
import Whiteboard from './components/whiteboard/Whiteboard'
import Settings from './components/Settings'
import Draggable from './components/Draggable'
import { AppErrorBoundary, WidgetErrorBoundary } from './components/errors'
import { fetchRandomWallpaper } from './api/index'
import { getCurrentWallpaper, setCurrentWallpaper, getWallpaperSource } from './utils/storage'
import { API_SOURCES } from './constants'
import { useSettings } from './hooks/useSettings'
import { useTranslation } from './hooks/useTranslation'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { useFontCSSVariables, useBackgroundCSSVariables } from './hooks/useCSSVariables'
import { useWallpaperRefresh } from './hooks/useWallpaperRefresh'
import { extractDominantColor } from './lib/canvas'
import { loadLayout, saveLayout } from './helpers/layout'
import { applyDarkMode } from './helpers/darkMode'
import type { WallpaperImage } from './types/wallpaper'
import type { WidgetId, WallpaperSource } from './types'

const NUM_COLUMNS = 6

/**
 * Extract dominant color from wallpaper and apply as CSS variables.
 * @param imgUrl - URL of the wallpaper image
 */
async function applyWallpaperColors(imgUrl: string) {
  const avg = await extractDominantColor(imgUrl)
  if (!avg) return
  document.documentElement.style.setProperty('--wallpaper-color', `rgba(${avg.r}, ${avg.g}, ${avg.b}, 0.45)`)
  document.documentElement.style.setProperty('--wallpaper-color-light', `rgba(${avg.r}, ${avg.g}, ${avg.b}, 0.25)`)
}

const WIDGET_NAME_MAP: Record<WidgetId, string> = {
  'clock': 'Clock',
  'calendar': 'Calendar',
  'pomodoro': 'Pomodoro',
  'weather': 'Weather',
  'sticky-note': 'Sticky Note',
  'whiteboard': 'Whiteboard',
  'list': 'Lists',
  'greeting': 'Greeting',
  'search-bar': 'Search Bar',
}

export default function App() {
  const { t } = useTranslation()
  const { settings } = useSettings()
  const [wallpaper, setWallpaper] = useState<WallpaperImage | null>(null)
  const [source, setSource] = useState<string>(API_SOURCES.WALLHAVEN)
  const [isLoading, setIsLoading] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [layout, setLayout] = useState(loadLayout)

  const loadWallpaper = useCallback(async (selectedSource?: string) => {
    setIsLoading(true)
    try {
      const newWallpaper = await fetchRandomWallpaper((selectedSource || source) as WallpaperSource)
      setWallpaper(newWallpaper)
      await setCurrentWallpaper(newWallpaper)
      if (newWallpaper?.url) applyWallpaperColors(newWallpaper.url)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [source])

  /**
   * Handle keyboard shortcuts for the application.
   * Escape toggles settings, R refreshes wallpaper.
   */
  useKeyboardShortcuts({
    Escape: () => setIsSettingsOpen(prev => !prev),
    r: () => loadWallpaper(),
  }, [loadWallpaper])

  useFontCSSVariables()
  useBackgroundCSSVariables()
  useWallpaperRefresh(() => loadWallpaper())

  useEffect(() => {
    applyDarkMode(settings.darkMode)
  }, [settings.darkMode])

  useEffect(() => {
    document.title = settings.tabTitle || t('newTab')
  }, [settings.tabTitle])

  /**
   * Initialize wallpaper from storage or fetch a new one.
   */
  useEffect(() => {
    async function init() {
      const savedWallpaper = await getCurrentWallpaper()
      const savedSource = await getWallpaperSource()
      if (savedSource) setSource(savedSource as WallpaperSource)
      if (savedWallpaper) {
        const wp = savedWallpaper as WallpaperImage
        setWallpaper(wp)
        if (wp.url) applyWallpaperColors(wp.url)
      } else {
        await loadWallpaper(savedSource || API_SOURCES.WALLHAVEN)
      }
    }
    init()
  }, [])

  /**
   * Handle widget drop events for reordering.
   * @param widgetId - ID of the widget being dropped
   * @param targetCol - Target column index
   * @param targetOrder - Target order within the column
   */
  const handleDrop = useCallback((widgetId: string, targetCol: number, targetOrder: number) => {
    setLayout(prev => {
      const next = { ...prev }
      const affectedInTarget = Object.entries(next)
        .filter(([id, pos]) => id !== widgetId && pos.col === targetCol)
        .sort((a, b) => a[1].order - b[1].order)
      affectedInTarget.forEach(([id, pos], i) => {
        if (i >= targetOrder) {
          next[id as WidgetId] = { ...pos, order: i + 1 }
        } else {
          next[id as WidgetId] = pos
        }
      })
      next[widgetId as WidgetId] = { col: targetCol, order: targetOrder }
      saveLayout(next)
      return next
    })
  }, [])

  // Build visible widgets
  const visibleWidgets: { id: WidgetId; component: React.ReactNode }[] = []
  if (settings.showClockWidget)    visibleWidgets.push({ id: 'clock', component: <Clock /> })
  if (settings.showCalendarWidget) visibleWidgets.push({ id: 'calendar', component: <Calendar /> })
  if (settings.showPomodoroWidget) visibleWidgets.push({ id: 'pomodoro', component: <Pomodoro /> })
  if (settings.showWeatherWidget)  visibleWidgets.push({ id: 'weather', component: <Weather /> })
  if (settings.showStickyNote)     visibleWidgets.push({ id: 'sticky-note', component: <StickyNote /> })
  if (settings.showWhiteboard)     visibleWidgets.push({ id: 'whiteboard', component: <Whiteboard onDelete={() => {
    const data = JSON.parse(localStorage.getItem('newtab_settings') || '{}')
    data.showWhiteboard = false
    localStorage.setItem('newtab_settings', JSON.stringify(data))
    try { chrome.storage.local.set({ showWhiteboard: false }) } catch {}
    window.dispatchEvent(new Event('storage'))
  }} /> })
  if (settings.showList)           visibleWidgets.push({ id: 'list', component: <Lists /> })
  if (settings.enableGreeting)     visibleWidgets.push({ id: 'greeting', component: <Greeting /> })
  if (settings.enableSearchBar)    visibleWidgets.push({ id: 'search-bar', component: <SearchBar /> })

  // Distribute widgets into columns
  const columns: { id: WidgetId; component: React.ReactNode; order: number }[][] =
    Array.from({ length: NUM_COLUMNS }, () => [])
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

  // Search bar measurement — useEffect required for DOM measurement / layout calculation
  const [sbHeightPx, setSbHeightPx] = useState(0)
  const [sbPos, setSbPos] = useState({ left: 0, width: 0, top: 0 })
  const sbMeasureRef = useCallback((node: HTMLDivElement | null) => {
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
    <AppErrorBoundary>
      <div className="app">
        <Wallpaper wallpaper={wallpaper} isLoading={isLoading} />

        <div className="kanban-board">
          {searchBarWidget && settings.enableSearchBar && (
            <div
              className="search-bar-span"
              style={{ left: sbPos.left, width: sbPos.width, top: sbPos.top }}
              ref={sbMeasureRef}
            >
              <WidgetErrorBoundary widgetName="Search Bar">
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
              </WidgetErrorBoundary>
            </div>
          )}

          {columns.map((colWidgets, colIndex) => {
            const covered = settings.enableSearchBar && colIndex >= sbCol && colIndex <= sbCol + 1
            return (
              <div
                className="kanban-column"
                key={colIndex}
                data-col={colIndex}
                style={{ gridColumn: colIndex + 1 }}
              >
                <div className="kanban-column-inner" style={covered ? { paddingTop: sbHeightPx + 12 } : undefined}>
                  {colWidgets.map(w => (
                    <WidgetErrorBoundary key={w.id} widgetName={WIDGET_NAME_MAP[w.id]}>
                      <Draggable
                        id={w.id}
                        col={colIndex}
                        onDrop={handleDrop}
                        numColumns={NUM_COLUMNS}
                      >
                        {w.component}
                      </Draggable>
                    </WidgetErrorBoundary>
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

          <button className="settings-btn" onClick={() => setIsSettingsOpen(prev => !prev)} title={t('settingsEsc')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>
        </div>

        <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(prev => !prev)} />
      </div>
    </AppErrorBoundary>
  )
}
