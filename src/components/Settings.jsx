import { useState, useEffect, memo } from 'react'
import { API_SOURCES, BACKGROUND_TYPES, FREQUENCIES, TEXTURES, SEARCH_ENGINES } from '../constants.js'
import ToggleSwitch from './ToggleSwitch.jsx'
import { useTranslation } from '../hooks/useTranslation.js'

const TEXTURE_KEYS = {
  'Grain': 'grain',
  'Vector grain': 'vectorGrain',
  'Diagonal dots': 'diagonalDots',
  'Vertical dots': 'verticalDots',
  'Topographic': 'topographic',
  'Aztec': 'aztec',
  'Checkerboard': 'checkerboard',
  'Isometric': 'isometric',
  'Circuit board': 'circuitBoard',
  'Tic-tac-toe': 'ticTacToe',
  'Endless clouds': 'endlessClouds',
  'Waves': 'waves',
  'Honeycomb': 'honeycomb',
  'Grid': 'grid',
  'Vertical lines': 'verticalLines',
  'Horizontal lines': 'horizontalLines',
  'Diagonal lines': 'diagonalLines',
  'Vertical stripes': 'verticalStripes',
  'Horizontal stripes': 'horizontalStripes',
  'Diagonal stripes': 'diagonalStripes',
  'None': 'none',
}

const SOURCE_LABELS = {
  [API_SOURCES.UNSPLASH]: 'Unsplash',
  [API_SOURCES.WALLHAVEN]: 'Wallhaven',
  [API_SOURCES.PIXABAY]: 'Pixabay',
  [API_SOURCES.PICSUM]: 'Picsum',
  [API_SOURCES.CATBOX]: 'Catbox',
}

const IMAGE_PROVIDERS = [API_SOURCES.UNSPLASH, API_SOURCES.WALLHAVEN, API_SOURCES.PIXABAY, API_SOURCES.PICSUM, API_SOURCES.CATBOX]

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'pt', label: 'Português' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'zh', label: '中文' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'ar', label: 'العربية' },
]

const POPULAR_FONTS = [
  'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Noto Sans',
  'Source Sans 3', 'Raleway', 'Ubuntu', 'Nunito', 'Playfair Display', 'Merriweather',
  'Oswald', 'Quicksand', 'Work Sans', 'Rubik', 'Libre Franklin', 'Titillium Web',
  'Barlow', 'Fira Sans', 'Inconsolata', 'Space Grotesk', 'DM Sans', 'Jost',
  'Manrope', 'Karla', 'Lexend', 'Sora', 'Epilogue', 'Plus Jakarta Sans',
  'Outfit', 'Figtree', 'Onest', 'Urbanist', 'DM Mono', 'Schibsted Grotesk',
  'Instrument Sans', 'Inter Tight', 'Noto Sans Display', 'Hanken Grotesk',
  'Public Sans', 'Alegreya Sans', 'Cabin', 'Catamaran', 'Hind',
  'Mukta', 'Mulish', 'Rajdhani', 'Exo 2',
]

const FONT_WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900]

function loadSettings() {
  try {
    const data = JSON.parse(localStorage.getItem('newtab_settings') || '{}')
    return {
      wallpaperSource: data.wallpaperSource || API_SOURCES.WALLHAVEN,
      autoRefresh: data.autoRefresh !== undefined ? data.autoRefresh : true,
      searchEngine: data.searchEngine || 'GOOGLE',
      clockFormat: data.clockFormat || '12h',
      clockPosition: data.clockPosition || 'center',
      uiOpacity: data.uiOpacity !== undefined ? data.uiOpacity : 80,
      showAllSettings: data.showAllSettings !== undefined ? data.showAllSettings : true,
      language: data.language || 'en',
      darkMode: data.darkMode || 'system',
      tabTitle: data.tabTitle || 'New Tab',
      hideSettingsIcons: data.hideSettingsIcons !== undefined ? data.hideSettingsIcons : false,
      bgType: data.bgType || 'images',
      bgProvider: data.bgProvider || API_SOURCES.WALLHAVEN,
      bgCollection: data.bgCollection || '',
      bgFrequency: data.bgFrequency || 'every_tab',
      bgTexture: data.bgTexture || 'None',
      bgBlur: data.bgBlur !== undefined ? data.bgBlur : 0,
      bgBrightness: data.bgBrightness !== undefined ? data.bgBrightness : 100,
      bgFadeTime: data.bgFadeTime !== undefined ? data.bgFadeTime : 500,
      enableTimeDate: data.enableTimeDate !== undefined ? data.enableTimeDate : true,
      showAmPm: data.showAmPm !== undefined ? data.showAmPm : true,
      showSeconds: data.showSeconds !== undefined ? data.showSeconds : false,
      analogClock: data.analogClock !== undefined ? data.analogClock : false,
      worldClocks: data.worldClocks !== undefined ? data.worldClocks : false,
      clockSize: data.clockSize !== undefined ? data.clockSize : 100,
      timeZone: data.timeZone || 'local',
      dateFormat: data.dateFormat || 'DD/MM/YYYY',
      showClockDate: data.showClockDate || 'both',
      fontFamily: data.fontFamily || 'Inter',
      fontWeight: data.fontWeight || 400,
      fontColor: data.fontColor || '#ffffff',
      fontSize: data.fontSize !== undefined ? data.fontSize : 100,
      fontShadow: data.fontShadow !== undefined ? data.fontShadow : 0,
      enableWeather: data.enableWeather !== undefined ? data.enableWeather : false,
      geolocation: data.geolocation || 'approximate',
      manualLocation: data.manualLocation || '',
      tempUnit: data.tempUnit || 'celsius',
      forecast: data.forecast || 'automatic',
      tempDisplay: data.tempDisplay || 'actual',
      weatherShow: data.weatherShow || 'description_icon',
      enableGreeting: data.enableGreeting !== undefined ? data.enableGreeting : true,
      greetingName: data.greetingName || '',
      greetingSize: data.greetingSize !== undefined ? data.greetingSize : 32,
      enableSearchBar: data.enableSearchBar !== undefined ? data.enableSearchBar : true,
      openInNewTab: data.openInNewTab !== undefined ? data.openInNewTab : true,
      showSuggestions: data.showSuggestions !== undefined ? data.showSuggestions : true,
      searchPlaceholder: data.searchPlaceholder || 'Search with Google or type a URL',
      searchBlur: data.searchBlur !== undefined ? data.searchBlur : 20,
      showClockWidget: data.showClockWidget !== undefined ? data.showClockWidget : true,
      showPomodoroWidget: data.showPomodoroWidget !== undefined ? data.showPomodoroWidget : false,
      showWeatherWidget: data.showWeatherWidget !== undefined ? data.showWeatherWidget : false,
      showStickyNote: data.showStickyNote !== undefined ? data.showStickyNote : false,
      showWhiteboard: data.showWhiteboard !== undefined ? data.showWhiteboard : false,
      showList: data.showList !== undefined ? data.showList : false,
      pomodoroWork: data.pomodoroWork ?? 25,
      pomodoroShort: data.pomodoroShort ?? 5,
      pomodoroLong: data.pomodoroLong ?? 15,
      pomodoroCycles: data.pomodoroCycles ?? 4,
    }
  } catch {
    return {
      wallpaperSource: API_SOURCES.WALLHAVEN,
      autoRefresh: true,
      searchEngine: 'GOOGLE',
      clockFormat: '12h',
      clockPosition: 'center',
      uiOpacity: 80,
      showAllSettings: true,
      language: 'en',
      darkMode: 'system',
      tabTitle: 'New Tab',
      hideSettingsIcons: false,
      bgType: 'images',
      bgProvider: API_SOURCES.WALLHAVEN,
      bgCollection: '',
      bgFrequency: 'every_tab',
      bgTexture: 'None',
      bgBlur: 0,
      bgBrightness: 100,
      bgFadeTime: 500,
      enableTimeDate: true,
      showAmPm: true,
      showSeconds: false,
      analogClock: false,
      worldClocks: false,
      clockSize: 100,
      timeZone: 'local',
      dateFormat: 'DD/MM/YYYY',
      showClockDate: 'both',
      fontFamily: 'Inter',
      fontWeight: 400,
      fontColor: '#ffffff',
      fontSize: 100,
      fontShadow: 0,
      enableWeather: false,
      geolocation: 'approximate',
      manualLocation: '',
      tempUnit: 'celsius',
      forecast: 'automatic',
      tempDisplay: 'actual',
      weatherShow: 'description_icon',
      enableGreeting: true,
      greetingName: '',
      greetingSize: 32,
      enableSearchBar: true,
      openInNewTab: true,
      showSuggestions: true,
      searchPlaceholder: 'Search with Google or type a URL',
      searchBgOpacity: 0,
      searchBlur: 20,
      showClockWidget: true,
      showCalendarWidget: true,
      showPomodoroWidget: false,
      showWeatherWidget: false,
      showStickyNote: false,
      showWhiteboard: false,
      showList: false,
      pomodoroWork: 25,
      pomodoroShort: 5,
      pomodoroLong: 15,
      pomodoroCycles: 4,
    }
  }
}

function saveSettings(partial) {
  try {
    const data = JSON.parse(localStorage.getItem('newtab_settings') || '{}')
    Object.assign(data, partial)
    localStorage.setItem('newtab_settings', JSON.stringify(data))
  } catch {}
}

function Settings({ isOpen, onClose }) {
  const [settings, setSettings] = useState(loadSettings)
  const [activeTab, setActiveTab] = useState('settings')
  const [notes, setNotes] = useState(() => {
    try {
      const data = localStorage.getItem('newtab_sticky')
      return data ? JSON.parse(data) : []
    } catch { return [] }
  })
  const [lists, setLists] = useState(() => {
    try {
      const data = localStorage.getItem('newtab_lists')
      return data ? JSON.parse(data) : []
    } catch { return [] }
  })
  const { t, lang, getLanguageName } = useTranslation()

  useEffect(() => {
    function readNotes() {
      try {
        const data = JSON.parse(localStorage.getItem('newtab_sticky') || '[]')
        if (Array.isArray(data)) setNotes(data)
      } catch {}
    }
    window.addEventListener('sticky-update', readNotes)
    const interval = setInterval(readNotes, 500)
    return () => {
      window.removeEventListener('sticky-update', readNotes)
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    function readLists() {
      try {
        const data = JSON.parse(localStorage.getItem('newtab_lists') || '[]')
        if (Array.isArray(data)) setLists(data)
      } catch {}
    }
    window.addEventListener('lists-update', readLists)
    const interval = setInterval(readLists, 500)
    return () => {
      window.removeEventListener('lists-update', readLists)
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    if (!isOpen) return
    try {
      const data = localStorage.getItem('newtab_sticky')
      if (data) setNotes(JSON.parse(data))
    } catch {}
  }, [isOpen])

  function persistNotes(next) {
    setNotes(next)
    localStorage.setItem('newtab_sticky', JSON.stringify(next))
    window.dispatchEvent(new Event('sticky-update'))
  }

  function handleAddNote() {
    if (notes.length >= 10) return
    if (notes.some(n => !n.html.replace(/<[^>]+>/g, '').trim())) return
    const updated = [...notes, { html: '', colorIdx: notes.length % 6 }]
    persistNotes(updated)
    if (!settings.showStickyNote) update('showStickyNote', true)
  }

  const hasEmptyNote = notes.some(n => !n.html.replace(/<[^>]+>/g, '').trim())

  function handleAddList() {
    if (lists.length >= 10) return
    if (lists.some(l => !l.title && l.items.length === 0)) return
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
    const updated = [...lists, { id, title: '', items: [] }]
    setLists(updated)
    localStorage.setItem('newtab_lists', JSON.stringify(updated))
    window.dispatchEvent(new Event('lists-update'))
    if (!settings.showList) update('showList', true)
  }

  const hasEmptyList = lists.some(l => !l.title && l.items.length === 0)

  const bgTypes = [
    { value: 'images', label: t('images') },
    { value: 'videos', label: t('videos') },
    { value: 'local', label: t('localFiles') },
    { value: 'url', label: t('urls') },
    { value: 'solid', label: t('solidColor') },
  ]

  const freqOptions = [
    { value: 'every_tab', label: t('everyTab') },
    { value: 'every_hour', label: t('everyHour') },
    { value: 'every_day', label: t('everyDay') },
    { value: 'daylight', label: t('daylight') },
    { value: 'locked', label: t('locked') },
  ]

  const texOptions = TEXTURES.map(tex => ({ value: tex, label: t(TEXTURE_KEYS[tex]) }))

  useEffect(() => {
    async function load() {
      try {
        const stored = await chrome.storage.local.get([
          'wallpaperSource', 'autoRefresh', 'searchEngine',
          'clockFormat', 'clockPosition', 'uiOpacity',
          'showAllSettings', 'language', 'darkMode', 'tabTitle', 'hideSettingsIcons',
          'bgType', 'bgProvider', 'bgCollection', 'bgFrequency', 'bgTexture',
          'bgBlur', 'bgBrightness', 'bgFadeTime',
          'enableTimeDate', 'showAmPm', 'showSeconds', 'analogClock', 'worldClocks',
          'clockSize', 'timeZone', 'dateFormat', 'showClockDate',
          'fontFamily', 'fontWeight', 'fontColor', 'fontSize', 'fontShadow',
          'enableWeather', 'geolocation', 'manualLocation', 'tempUnit', 'forecast', 'tempDisplay', 'weatherShow',
          'enableGreeting', 'greetingName', 'greetingSize',
          'enableSearchBar', 'openInNewTab', 'showSuggestions', 'searchPlaceholder', 'searchBgOpacity', 'searchBlur',
          'showClockWidget', 'showCalendarWidget', 'showPomodoroWidget', 'showWeatherWidget', 'showStickyNote', 'showWhiteboard', 'showList',
          'pomodoroWork', 'pomodoroShort', 'pomodoroLong', 'pomodoroCycles',
        ])
        setSettings((prev) => ({ ...prev, ...stored }))
      } catch {
        setSettings(loadSettings())
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (typeof chrome === 'undefined' || !chrome?.storage?.onChanged) return
    function onChange(changes, area) {
      if (area !== 'local') return
      const update = {}
      for (const [key, { newValue }] of Object.entries(changes)) {
        if (newValue !== undefined) update[key] = newValue
      }
      if (Object.keys(update).length) setSettings(prev => ({ ...prev, ...update }))
    }
    chrome.storage.onChanged.addListener(onChange)
    return () => chrome.storage.onChanged.removeListener(onChange)
  }, [])

  function update(key, value) {
    setSettings((prev) => ({ ...prev, [key]: value }))
    saveSettings({ [key]: value })
    try { chrome.storage.local.set({ [key]: value }) } catch {}
  }

  return (
    <>
      <div className={`settings-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <div className={`settings-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-tabs">
          <button
            className={`sidebar-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >{t('settingsTab')}</button>
          <button
            className={`sidebar-tab ${activeTab === 'background' ? 'active' : ''}`}
            onClick={() => setActiveTab('background')}
          >{t('backgroundTab')}</button>
          <button
            className={`sidebar-tab ${activeTab === 'widgets' ? 'active' : ''}`}
            onClick={() => setActiveTab('widgets')}
          >{t('widgetsTab')}</button>
        </div>

        <div className="settings-content">
          {activeTab === 'settings' && (<div className="settings-groups">
            <div className="settings-group">
              <div className="settings-group-title">{t('general')}</div>

              <div className="setting-row">
                <span className="setting-label">{t('hideSettingsIcons')}</span>
                <ToggleSwitch
                  checked={settings.hideSettingsIcons}
                  onChange={() => update('hideSettingsIcons', !settings.hideSettingsIcons)}
                />
              </div>

              <div className="setting-row">
                <span className="setting-label">{t('language')} {lang !== 'en' && `(${getLanguageName(lang)})`}</span>
                <select
                  className="setting-select"
                  value={settings.language}
                  onChange={(e) => update('language', e.target.value)}
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>{l.label}</option>
                  ))}
                </select>
              </div>

              <div className="setting-row">
                <span className="setting-label">{t('darkMode')}</span>
                <div className="segmented-control">
                  {['light', 'dark', 'system'].map((mode) => (
                    <button
                      key={mode}
                      className={`segmented-option ${settings.darkMode === mode ? 'active' : ''}`}
                      onClick={() => update('darkMode', mode)}
                    >
                      {t(mode)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="setting-row">
                <span className="setting-label">{t('tabTitle')}</span>
                <input
                  type="text"
                  className="setting-input"
                  value={settings.tabTitle}
                  onChange={(e) => update('tabTitle', e.target.value)}
                  placeholder={t('newTab')}
                />
              </div>
            </div>

            <div className="settings-group">
              <div className="settings-group-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>{t('searchBar')}</span>
                <ToggleSwitch
                  checked={settings.enableSearchBar}
                  onChange={() => update('enableSearchBar', !settings.enableSearchBar)}
                />
              </div>

              {settings.enableSearchBar && (
                <>
                  <div className="setting-row">
                    <span className="setting-label">{t('openInNewTab')}</span>
                    <ToggleSwitch
                      checked={settings.openInNewTab}
                      onChange={() => update('openInNewTab', !settings.openInNewTab)}
                    />
                  </div>

                  <div className="setting-row">
                    <span className="setting-label">{t('suggestions')}</span>
                    <ToggleSwitch
                      checked={settings.showSuggestions}
                      onChange={() => update('showSuggestions', !settings.showSuggestions)}
                    />
                  </div>

                  <div className="setting-row">
                    <span className="setting-label">{t('placeholder')}</span>
                    <input
                      type="text"
                      className="setting-input"
                      value={settings.searchPlaceholder}
                      onChange={(e) => update('searchPlaceholder', e.target.value)}
                      placeholder={t('defaultPlaceholder')}
                    />
                  </div>

                  <div className="setting-row" style={{ alignItems: 'flex-start' }}>
                    <span className="setting-label">{t('searchEngine')}</span>
                    <div className="engine-icon-grid">
                      {Object.keys(SEARCH_ENGINES).map((key) => (
                        <button
                          key={key}
                          className={`engine-icon-btn ${settings.searchEngine === key ? 'active' : ''}`}
                          onClick={() => update('searchEngine', key)}
                          title={SEARCH_ENGINES[key].name}
                        >
                          <img
                            src={`icons/engines/${key.toLowerCase()}.png`}
                            alt={SEARCH_ENGINES[key].name}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="settings-group">
              <div className="settings-group-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>{t('greeting')}</span>
                <ToggleSwitch
                  checked={settings.enableGreeting}
                  onChange={() => update('enableGreeting', !settings.enableGreeting)}
                />
              </div>

              {settings.enableGreeting && (
                <>
                  <div className="setting-row">
                    <span className="setting-label">{t('greetingName')}</span>
                    <input
                      type="text"
                      className="setting-input"
                      value={settings.greetingName}
                      onChange={(e) => update('greetingName', e.target.value)}
                      placeholder={t('yourName')}
                    />
                  </div>
                </>
              )}
            </div>
          </div>)}

          {activeTab === 'background' && (
            <div className="settings-group">
              <div className="settings-group-title">{t('general')}</div>

              <div className="setting-row">
                <span className="setting-label">{t('backgroundType')}</span>
                <select
                  className="setting-select"
                  value={settings.bgType}
                  onChange={(e) => update('bgType', e.target.value)}
                >
                  {bgTypes.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </div>

              <div className="setting-row">
                <span className="setting-label">{t('provider')}</span>
                <select
                  className="setting-select"
                  value={settings.bgProvider}
                  onChange={(e) => update('bgProvider', e.target.value)}
                >
                  {IMAGE_PROVIDERS.map((p) => (
                    <option key={p} value={p}>{SOURCE_LABELS[p] || p}</option>
                  ))}
                </select>
              </div>

              {(settings.bgProvider === API_SOURCES.WALLHAVEN || settings.bgProvider === API_SOURCES.UNSPLASH) && (
                <div className="setting-row">
                  <span className="setting-label">{t('collection')}</span>
                  <input
                    type="text"
                    className="setting-input"
                    value={settings.bgCollection}
                    onChange={(e) => update('bgCollection', e.target.value)}
                    placeholder={t('collectionId')}
                  />
                </div>
              )}

              <div className="setting-row">
                <span className="setting-label">{t('frequency')}</span>
                <select
                  className="setting-select"
                  value={settings.bgFrequency}
                  onChange={(e) => update('bgFrequency', e.target.value)}
                >
                  {freqOptions.map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>

              <div className="setting-row">
                <span className="setting-label">{t('texture')}</span>
                <select
                  className="setting-select"
                  value={settings.bgTexture}
                  onChange={(e) => update('bgTexture', e.target.value)}
                >
                  {texOptions.map((tex) => (
                    <option key={tex.value} value={tex.value}>{tex.label}</option>
                  ))}
                </select>
              </div>

              <div className="setting-row">
                <span className="setting-label">{t('blur')}</span>
                <div className="range-control">
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={settings.bgBlur}
                    onChange={(e) => update('bgBlur', Number(e.target.value))}
                    className="slider"
                  />
                  <span className="range-value">{settings.bgBlur}px</span>
                </div>
              </div>

              <div className="setting-row">
                <span className="setting-label">{t('brightness')}</span>
                <div className="range-control">
                  <input
                    type="range"
                    min="10"
                    max="200"
                    value={settings.bgBrightness}
                    onChange={(e) => update('bgBrightness', Number(e.target.value))}
                    className="slider"
                  />
                  <span className="range-value">{settings.bgBrightness}%</span>
                </div>
              </div>

              <div className="setting-row">
                <span className="setting-label">{t('fadeInTime')}</span>
                <div className="range-control">
                  <input
                    type="range"
                    min="100"
                    max="3000"
                    step="100"
                    value={settings.bgFadeTime}
                    onChange={(e) => update('bgFadeTime', Number(e.target.value))}
                    className="slider"
                  />
                  <span className="range-value">{settings.bgFadeTime}ms</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'widgets' && (
            <div className="settings-groups">
              <div className="settings-group-inline">
                <span className="settings-group-inline-title">{t('calendar')}</span>
                <ToggleSwitch
                  checked={settings.showCalendarWidget}
                  onChange={() => update('showCalendarWidget', !settings.showCalendarWidget)}
                />
              </div>
              <div className="settings-group-inline">
                <span className="settings-group-inline-title">{t('whiteboard')}</span>
                <ToggleSwitch
                  checked={settings.showWhiteboard}
                  onChange={() => update('showWhiteboard', !settings.showWhiteboard)}
                />
              </div>
              <div className="settings-group-inline">
                <span className="settings-group-inline-title">{t('stickyNote')}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="setting-dashed-btn-count">{notes.length}/10</span>
                  <button className="sticky-add-btn" onClick={handleAddNote} title="Add note" disabled={notes.length >= 10 || hasEmptyNote}>
                    <span style={{ fontSize: '12px' }}>Add</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="settings-group-inline">
                <span className="settings-group-inline-title">{t('lists')}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="setting-dashed-btn-count">{lists.length}/10</span>
                  <button className="sticky-add-btn" onClick={handleAddList} title="Add list" disabled={lists.length >= 10 || hasEmptyList}>
                    <span style={{ fontSize: '12px' }}>Add</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="settings-group">
                <div className="settings-group-title">{t('pomodoro')}</div>
                <div className="setting-row">
                  <span className="setting-label">{t('showPomodoro')}</span>
                  <ToggleSwitch
                    checked={settings.showPomodoroWidget}
                    onChange={() => update('showPomodoroWidget', !settings.showPomodoroWidget)}
                  />
                </div>
                {settings.showPomodoroWidget && (<>
                  <div className="setting-row">
                    <span className="setting-label">{t('workMin')}</span>
                    <input
                      type="number"
                      className="setting-input"
                      min="1"
                      max="120"
                      value={settings.pomodoroWork ?? 25}
                      onChange={(e) => update('pomodoroWork', Number(e.target.value))}
                    />
                  </div>
                  <div className="setting-row">
                    <span className="setting-label">{t('shortBreakMin')}</span>
                    <input
                      type="number"
                      className="setting-input"
                      min="1"
                      max="30"
                      value={settings.pomodoroShort ?? 5}
                      onChange={(e) => update('pomodoroShort', Number(e.target.value))}
                    />
                  </div>
                  <div className="setting-row">
                    <span className="setting-label">{t('longBreakMin')}</span>
                    <input
                      type="number"
                      className="setting-input"
                      min="1"
                      max="60"
                      value={settings.pomodoroLong ?? 15}
                      onChange={(e) => update('pomodoroLong', Number(e.target.value))}
                    />
                  </div>
                  <div className="setting-row">
                    <span className="setting-label">{t('longBreakAfter')}</span>
                    <input
                      type="number"
                      className="setting-input"
                      min="1"
                      max="10"
                      value={settings.pomodoroCycles ?? 4}
                      onChange={(e) => update('pomodoroCycles', Number(e.target.value))}
                    />
                  </div>
                </>)}
              </div>
              <div className="settings-group">
                <div className="settings-group-title">{t('date')}</div>
                <div className="setting-row">
                  <span className="setting-label">{t('showClock')}</span>
                  <ToggleSwitch
                    checked={settings.showClockWidget}
                    onChange={() => update('showClockWidget', !settings.showClockWidget)}
                  />
                </div>
                {settings.showClockWidget && (<>
                  <div className="setting-row">
                    <span className="setting-label">{t('twelveHrFormat')}</span>
                    <ToggleSwitch
                      checked={settings.clockFormat === '12h'}
                      onChange={() => update('clockFormat', settings.clockFormat === '12h' ? '24h' : '12h')}
                    />
                  </div>
                  <div className="setting-row">
                    <span className="setting-label">{t('showAmPm')}</span>
                    <ToggleSwitch
                      checked={settings.showAmPm}
                      onChange={() => update('showAmPm', !settings.showAmPm)}
                    />
                  </div>
                  <div className="setting-row">
                    <span className="setting-label">{t('showSeconds')}</span>
                    <ToggleSwitch
                      checked={settings.showSeconds}
                      onChange={() => update('showSeconds', !settings.showSeconds)}
                    />
                  </div>
                  <div className="setting-row">
                    <span className="setting-label">{t('analogClock')}</span>
                    <ToggleSwitch
                      checked={settings.analogClock}
                      onChange={() => update('analogClock', !settings.analogClock)}
                    />
                  </div>
                  <div className="setting-row">
                    <span className="setting-label">{t('worldClocks')}</span>
                    <ToggleSwitch
                      checked={(settings.worldClockTimezones || []).length > 0}
                      onChange={() => {
                        if ((settings.worldClockTimezones || []).length > 0) {
                          update('worldClockTimezones', [])
                        } else {
                          update('worldClockTimezones', ['America/New_York', 'Europe/London', 'Asia/Tokyo'])
                        }
                      }}
                    />
                  </div>
                  {(settings.worldClockTimezones || []).length > 0 && (
                    <>
                      {(settings.worldClockTimezones || []).map((tz, i) => (
                        <div key={tz} className="setting-row">
                          <select
                            className="setting-select"
                            value={tz}
                            onChange={(e) => {
                              const list = [...settings.worldClockTimezones]
                              list[i] = e.target.value
                              update('worldClockTimezones', list)
                            }}
                          >
                            {Intl.supportedValuesOf('timeZone').map((t) => {
                              const parts = t.split('/')
                              const label = parts.length > 1 ? parts[parts.length - 1].replace(/_/g, ' ') : t
                              return <option key={t} value={t}>{label}</option>
                            })}
                          </select>
                          <button
                            className="wc-remove-btn"
                            onClick={() => {
                              const list = [...settings.worldClockTimezones]
                              list.splice(i, 1)
                              update('worldClockTimezones', list)
                            }}
                          >✕</button>
                        </div>
                      ))}
                      <div className="setting-row">
                        <button
                          className="wc-add-btn"
                          onClick={() => {
                            const list = [...(settings.worldClockTimezones || [])]
                            if (!list.includes('America/New_York')) list.push('America/New_York')
                            else if (!list.includes('Europe/London')) list.push('Europe/London')
                            else if (!list.includes('Asia/Tokyo')) list.push('Asia/Tokyo')
                            else list.push(Intl.supportedValuesOf('timeZone')[0])
                            update('worldClockTimezones', list)
                          }}
                        >{t('addWorldClock')}</button>
                      </div>
                    </>
                  )}
                  <div className="setting-row">
                    <span className="setting-label">{t('clockSize')}</span>
                    <div className="range-control">
                      <input
                        type="range"
                        min="50"
                        max="200"
                        step="5"
                        value={settings.clockSize}
                        onChange={(e) => update('clockSize', Number(e.target.value))}
                        className="slider"
                      />
                      <span className="range-value">{settings.clockSize}%</span>
                    </div>
                  </div>
                  <div className="setting-row">
                    <span className="setting-label">{t('timeZone')}</span>
                    <select
                      className="setting-select"
                      value={settings.timeZone}
                      onChange={(e) => update('timeZone', e.target.value)}
                    >
                      <option value="local">{t('local')}</option>
                      {Intl.supportedValuesOf('timeZone').map((tz) => {
                        const parts = tz.split('/')
                        const label = parts.length > 1 ? parts[parts.length - 1].replace(/_/g, ' ') : tz
                        return <option key={tz} value={tz}>{label}</option>
                      })}
                    </select>
                  </div>
                  <div className="setting-row">
                    <span className="setting-label">{t('dateFormat')}</span>
                    <select
                      className="setting-select"
                      value={settings.dateFormat}
                      onChange={(e) => update('dateFormat', e.target.value)}
                    >
                      <option value="DD/MM/YYYY">{t('dayMonthYear')}</option>
                      <option value="MM/DD/YYYY">{t('monthDayYear')}</option>
                      <option value="YYYY-MM-DD">{t('yearMonthDay')}</option>
                    </select>
                  </div>
                  <div className="setting-row">
                    <span className="setting-label">{t('show')}</span>
                    <select
                      className="setting-select"
                      value={settings.showClockDate}
                      onChange={(e) => update('showClockDate', e.target.value)}
                    >
                      <option value="both">{t('clockAndDate')}</option>
                      <option value="clock">{t('clockOnly')}</option>
                      <option value="date">{t('dateOnly')}</option>
                    </select>
                  </div>
                </>)}
              </div>
              <div className="settings-group">
                <div className="settings-group-title">{t('weather')}</div>
                <div className="setting-row">
                  <span className="setting-label">{t('showWeather')}</span>
                  <ToggleSwitch
                    checked={settings.showWeatherWidget}
                    onChange={() => update('showWeatherWidget', !settings.showWeatherWidget)}
                  />
                </div>

                {settings.showWeatherWidget && (
                  <>
                    <div className="setting-row">
                      <span className="setting-label">{t('geolocation')}</span>
                      <select
                        className="setting-select"
                        value={settings.geolocation}
                        onChange={(e) => update('geolocation', e.target.value)}
                      >
                        <option value="approximate">{t('approximate')}</option>
                        <option value="manual">{t('manual')}</option>
                        <option value="precise">{t('precise')}</option>
                      </select>
                    </div>

                    {settings.geolocation === 'manual' && (
                      <div className="setting-row">
                        <span className="setting-label">{t('location')}</span>
                        <input
                          type="text"
                          className="setting-input"
                          value={settings.manualLocation}
                          onChange={(e) => update('manualLocation', e.target.value)}
                          placeholder={t('cityOrCoords')}
                        />
                      </div>
                    )}

                    <div className="setting-row">
                      <span className="setting-label">{t('tempUnit')}</span>
                      <select
                        className="setting-select"
                        value={settings.tempUnit}
                        onChange={(e) => update('tempUnit', e.target.value)}
                      >
                        <option value="celsius">{t('celsius')}</option>
                        <option value="fahrenheit">{t('fahrenheit')}</option>
                      </select>
                    </div>

                    <div className="setting-row">
                      <span className="setting-label">{t('forecast')}</span>
                      <select
                        className="setting-select"
                        value={settings.forecast}
                        onChange={(e) => update('forecast', e.target.value)}
                      >
                        <option value="automatic">{t('automatic')}</option>
                        <option value="always">{t('always')}</option>
                        <option value="never">{t('never')}</option>
                      </select>
                    </div>

                    <div className="setting-row">
                      <span className="setting-label">{t('temperature')}</span>
                      <select
                        className="setting-select"
                        value={settings.tempDisplay}
                        onChange={(e) => update('tempDisplay', e.target.value)}
                      >
                        <option value="actual">{t('actual')}</option>
                        <option value="feels_like">{t('feelsLike')}</option>
                        <option value="both">{t('both')}</option>
                      </select>
                    </div>

                    <div className="setting-row">
                      <span className="setting-label">{t('show')}</span>
                      <select
                        className="setting-select"
                        value={settings.weatherShow}
                        onChange={(e) => update('weatherShow', e.target.value)}
                      >
                        <option value="description_icon">{t('descAndIcon')}</option>
                        <option value="description">{t('description')}</option>
                        <option value="icon">{t('icon')}</option>
                        <option value="nothing">{t('nothing')}</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default memo(Settings)
