import { useState, useEffect, memo } from 'react'
import { API_SOURCES, BACKGROUND_TYPES, FREQUENCIES, TEXTURES, SEARCH_ENGINES } from '../constants.js'
import ToggleSwitch from './ToggleSwitch.jsx'

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
      fontSize: data.fontSize !== undefined ? data.fontSize : 16,
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
      searchWidth: data.searchWidth !== undefined ? data.searchWidth : 500,
      searchBgOpacity: data.searchBgOpacity !== undefined ? data.searchBgOpacity : 0,
      searchBlur: data.searchBlur !== undefined ? data.searchBlur : 20,
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
      fontSize: 16,
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
      searchWidth: 500,
      searchBgOpacity: 0,
      searchBlur: 20,
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
          'enableSearchBar', 'openInNewTab', 'showSuggestions', 'searchPlaceholder', 'searchWidth', 'searchBgOpacity', 'searchBlur',
        ])
        setSettings((prev) => ({ ...prev, ...stored }))
      } catch {
        setSettings(loadSettings())
      }
    }
    load()
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
          >Settings</button>
          <button
            className={`sidebar-tab ${activeTab === 'background' ? 'active' : ''}`}
            onClick={() => setActiveTab('background')}
          >Background</button>
          <button
            className={`sidebar-tab ${activeTab === 'widgets' ? 'active' : ''}`}
            onClick={() => setActiveTab('widgets')}
          >Widgets</button>
        </div>

        <div className="settings-content">
          {activeTab === 'settings' && (<div className="settings-groups">
            <div className="settings-group">
              <div className="settings-group-title">General</div>

              <div className="setting-row">
                <span className="setting-label">Language</span>
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
                <span className="setting-label">Dark mode</span>
                <div className="segmented-control">
                  {['light', 'dark', 'system'].map((mode) => (
                    <button
                      key={mode}
                      className={`segmented-option ${settings.darkMode === mode ? 'active' : ''}`}
                      onClick={() => update('darkMode', mode)}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="setting-row">
                <span className="setting-label">Tab title</span>
                <input
                  type="text"
                  className="setting-input"
                  value={settings.tabTitle}
                  onChange={(e) => update('tabTitle', e.target.value)}
                  placeholder="New Tab"
                />
              </div>

              <div className="setting-row">
                <span className="setting-label">Hide settings icons</span>
                <ToggleSwitch
                  checked={settings.hideSettingsIcons}
                  onChange={() => update('hideSettingsIcons', !settings.hideSettingsIcons)}
                />
              </div>
            </div>

            <div className="settings-group">
              <div className="settings-group-title">Fonts</div>

              <div className="setting-row">
                <span className="setting-label">Font family</span>
                <select
                  className="setting-select"
                  value={settings.fontFamily}
                  onChange={(e) => update('fontFamily', e.target.value)}
                >
                  {POPULAR_FONTS.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div className="setting-row">
                <span className="setting-label">Weight</span>
                <select
                  className="setting-select"
                  value={settings.fontWeight}
                  onChange={(e) => update('fontWeight', Number(e.target.value))}
                >
                  {FONT_WEIGHTS.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>

              <div className="setting-row">
                <span className="setting-label">Color</span>
                <input
                  type="color"
                  className="setting-input"
                  style={{ padding: '2px', width: '180px', minWidth: '180px', maxWidth: '180px', height: '30px' }}
                  value={settings.fontColor}
                  onChange={(e) => update('fontColor', e.target.value)}
                />
              </div>

              <div className="setting-row">
                <span className="setting-label">Size</span>
                <div className="range-control">
                  <input
                    type="range"
                    min="10"
                    max="48"
                    value={settings.fontSize}
                    onChange={(e) => update('fontSize', Number(e.target.value))}
                    className="slider"
                  />
                  <span className="range-value">{settings.fontSize}px</span>
                </div>
              </div>

              <div className="setting-row">
                <span className="setting-label">Shadow</span>
                <div className="range-control">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={settings.fontShadow}
                    onChange={(e) => update('fontShadow', Number(e.target.value))}
                    className="slider"
                  />
                  <span className="range-value">{settings.fontShadow}px</span>
                </div>
              </div>
            </div>

            <div className="settings-group">
              <div className="settings-group-title">Time & Date</div>

              <div className="setting-row">
                <span className="setting-label">Enable time & date</span>
                <ToggleSwitch
                  checked={settings.enableTimeDate}
                  onChange={() => update('enableTimeDate', !settings.enableTimeDate)}
                />
              </div>

              {settings.enableTimeDate && (<>
                <div className="setting-row">
                  <span className="setting-label">12 hr format</span>
                  <ToggleSwitch
                    checked={settings.clockFormat === '12h'}
                    onChange={() => update('clockFormat', settings.clockFormat === '12h' ? '24h' : '12h')}
                  />
                </div>

                <div className="setting-row">
                  <span className="setting-label">Show AM/PM</span>
                  <ToggleSwitch
                    checked={settings.showAmPm}
                    onChange={() => update('showAmPm', !settings.showAmPm)}
                  />
                </div>

                <div className="setting-row">
                  <span className="setting-label">Show seconds</span>
                  <ToggleSwitch
                    checked={settings.showSeconds}
                    onChange={() => update('showSeconds', !settings.showSeconds)}
                  />
                </div>

                <div className="setting-row">
                  <span className="setting-label">Analog clock</span>
                  <ToggleSwitch
                    checked={settings.analogClock}
                    onChange={() => update('analogClock', !settings.analogClock)}
                  />
                </div>

                <div className="setting-row">
                  <span className="setting-label">World clocks</span>
                  <ToggleSwitch
                    checked={settings.worldClocks}
                    onChange={() => update('worldClocks', !settings.worldClocks)}
                  />
                </div>

                <div className="setting-row">
                  <span className="setting-label">Clock size</span>
                  <div className="range-control">
                    <input
                      type="range"
                      min="50"
                      max="200"
                      value={settings.clockSize}
                      onChange={(e) => update('clockSize', Number(e.target.value))}
                      className="slider"
                    />
                    <span className="range-value">{settings.clockSize}%</span>
                  </div>
                </div>

                <div className="setting-row">
                  <span className="setting-label">Time zone</span>
                  <select
                    className="setting-select"
                    value={settings.timeZone}
                    onChange={(e) => update('timeZone', e.target.value)}
                  >
                    {Intl.supportedValuesOf('timeZone').map((tz) => (
                      <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                </div>

                <div className="setting-row">
                  <span className="setting-label">Date format</span>
                  <select
                    className="setting-select"
                    value={settings.dateFormat}
                    onChange={(e) => update('dateFormat', e.target.value)}
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                <div className="setting-row">
                  <span className="setting-label">Show</span>
                  <select
                    className="setting-select"
                    value={settings.showClockDate}
                    onChange={(e) => update('showClockDate', e.target.value)}
                  >
                    <option value="both">Clock & Date</option>
                    <option value="clock">Clock only</option>
                    <option value="date">Date only</option>
                  </select>
                </div>
              </>)}
            </div>

            <div className="settings-group">
              <div className="settings-group-title">Weather</div>

              <div className="setting-row">
                <span className="setting-label">Enable weather</span>
                <ToggleSwitch
                  checked={settings.enableWeather}
                  onChange={() => update('enableWeather', !settings.enableWeather)}
                />
              </div>

              {settings.enableWeather && (
                <>
                  <div className="setting-row">
                    <span className="setting-label">Geolocation</span>
                    <select
                      className="setting-select"
                      value={settings.geolocation}
                      onChange={(e) => update('geolocation', e.target.value)}
                    >
                      <option value="approximate">Approximate</option>
                      <option value="manual">Manual</option>
                      <option value="precise">Precise</option>
                    </select>
                  </div>

                  {settings.geolocation === 'manual' && (
                    <div className="setting-row">
                      <span className="setting-label">Location</span>
                      <input
                        type="text"
                        className="setting-input"
                        value={settings.manualLocation}
                        onChange={(e) => update('manualLocation', e.target.value)}
                        placeholder="City name or coordinates"
                      />
                    </div>
                  )}

                  <div className="setting-row">
                    <span className="setting-label">Temperature unit</span>
                    <select
                      className="setting-select"
                      value={settings.tempUnit}
                      onChange={(e) => update('tempUnit', e.target.value)}
                    >
                      <option value="celsius">Celsius</option>
                      <option value="fahrenheit">Fahrenheit</option>
                    </select>
                  </div>

                  <div className="setting-row">
                    <span className="setting-label">Forecast</span>
                    <select
                      className="setting-select"
                      value={settings.forecast}
                      onChange={(e) => update('forecast', e.target.value)}
                    >
                      <option value="automatic">Automatic</option>
                      <option value="always">Always</option>
                      <option value="never">Never</option>
                    </select>
                  </div>

                  <div className="setting-row">
                    <span className="setting-label">Temperature</span>
                    <select
                      className="setting-select"
                      value={settings.tempDisplay}
                      onChange={(e) => update('tempDisplay', e.target.value)}
                    >
                      <option value="actual">Actual</option>
                      <option value="feels_like">Feels like</option>
                      <option value="both">Both</option>
                    </select>
                  </div>

                  <div className="setting-row">
                    <span className="setting-label">Show</span>
                    <select
                      className="setting-select"
                      value={settings.weatherShow}
                      onChange={(e) => update('weatherShow', e.target.value)}
                    >
                      <option value="description_icon">Description & icon</option>
                      <option value="description">Description</option>
                      <option value="icon">Icon</option>
                      <option value="nothing">Nothing</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            <div className="settings-group">
              <div className="settings-group-title">Greeting</div>

              <div className="setting-row">
                <span className="setting-label">Enable greeting</span>
                <ToggleSwitch
                  checked={settings.enableGreeting}
                  onChange={() => update('enableGreeting', !settings.enableGreeting)}
                />
              </div>

              {settings.enableGreeting && (
                <>
                  <div className="setting-row">
                    <span className="setting-label">Greeting name</span>
                    <input
                      type="text"
                      className="setting-input"
                      value={settings.greetingName}
                      onChange={(e) => update('greetingName', e.target.value)}
                      placeholder="Your name"
                    />
                  </div>

                  <div className="setting-row">
                    <span className="setting-label">Greeting size</span>
                    <div className="range-control">
                      <input
                        type="range"
                        min="16"
                        max="72"
                        value={settings.greetingSize}
                        onChange={(e) => update('greetingSize', Number(e.target.value))}
                        className="slider"
                      />
                      <span className="range-value">{settings.greetingSize}px</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="settings-group">
              <div className="settings-group-title">Search Bar</div>

              <div className="setting-row">
                <span className="setting-label">Enable search bar</span>
                <ToggleSwitch
                  checked={settings.enableSearchBar}
                  onChange={() => update('enableSearchBar', !settings.enableSearchBar)}
                />
              </div>

              {settings.enableSearchBar && (
                <>
                  <div className="setting-row">
                    <span className="setting-label">Open in new tab</span>
                    <ToggleSwitch
                      checked={settings.openInNewTab}
                      onChange={() => update('openInNewTab', !settings.openInNewTab)}
                    />
                  </div>

                  <div className="setting-row">
                    <span className="setting-label">Suggestions</span>
                    <ToggleSwitch
                      checked={settings.showSuggestions}
                      onChange={() => update('showSuggestions', !settings.showSuggestions)}
                    />
                  </div>

                  <div className="setting-row">
                    <span className="setting-label">Search engine</span>
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

                  <div className="setting-row">
                    <span className="setting-label">Placeholder</span>
                    <input
                      type="text"
                      className="setting-input"
                      value={settings.searchPlaceholder}
                      onChange={(e) => update('searchPlaceholder', e.target.value)}
                      placeholder="Search with Google or type a URL"
                    />
                  </div>

                  <div className="setting-row">
                    <span className="setting-label">Width</span>
                    <div className="range-control">
                      <input
                        type="range"
                        min="200"
                        max="800"
                        step="10"
                        value={settings.searchWidth}
                        onChange={(e) => update('searchWidth', Number(e.target.value))}
                        className="slider"
                      />
                      <span className="range-value">{settings.searchWidth}px</span>
                    </div>
                  </div>

                  <div className="setting-row">
                    <span className="setting-label">Background</span>
                    <div className="range-control">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={settings.searchBgOpacity}
                        onChange={(e) => update('searchBgOpacity', Number(e.target.value))}
                        className="slider"
                      />
                      <span className="range-value">{settings.searchBgOpacity}%</span>
                    </div>
                  </div>

                  <div className="setting-row">
                    <span className="setting-label">Blur</span>
                    <div className="range-control">
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={settings.searchBlur}
                        onChange={(e) => update('searchBlur', Number(e.target.value))}
                        className="slider"
                      />
                      <span className="range-value">{settings.searchBlur}px</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>)}

          {activeTab === 'background' && (
            <div className="settings-group">
              <div className="settings-group-title">General</div>

              <div className="setting-row">
                <span className="setting-label">Background type</span>
                <select
                  className="setting-select"
                  value={settings.bgType}
                  onChange={(e) => update('bgType', e.target.value)}
                >
                  {BACKGROUND_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div className="setting-row">
                <span className="setting-label">Provider</span>
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
                  <span className="setting-label">Collection</span>
                  <input
                    type="text"
                    className="setting-input"
                    value={settings.bgCollection}
                    onChange={(e) => update('bgCollection', e.target.value)}
                    placeholder="Collection ID"
                  />
                </div>
              )}

              <div className="setting-row">
                <span className="setting-label">Frequency</span>
                <select
                  className="setting-select"
                  value={settings.bgFrequency}
                  onChange={(e) => update('bgFrequency', e.target.value)}
                >
                  {FREQUENCIES.map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>

              <div className="setting-row">
                <span className="setting-label">Texture</span>
                <select
                  className="setting-select"
                  value={settings.bgTexture}
                  onChange={(e) => update('bgTexture', e.target.value)}
                >
                  {TEXTURES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="setting-row">
                <span className="setting-label">Blur</span>
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
                <span className="setting-label">Brightness</span>
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
                <span className="setting-label">Fade in time</span>
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
              <div className="settings-group">
                <div className="settings-group-title">Board</div>
              </div>
              <div className="settings-group">
                <div className="settings-group-title">Theme</div>
              </div>
              <div className="settings-group">
                <div className="settings-group-title">Pomodoro</div>
              </div>
              <div className="settings-group">
                <div className="settings-group-title">System Info</div>
              </div>
              <div className="settings-group">
                <div className="settings-group-title">Recent Visited Sites</div>
              </div>
              <div className="settings-group">
                <div className="settings-group-title">Calendar</div>
              </div>
              <div className="settings-group">
                <div className="settings-group-title">Date</div>
              </div>
              <div className="settings-group">
                <div className="settings-group-title">Weather</div>
              </div>
              <div className="settings-group">
                <div className="settings-group-title">Speed Dial</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default memo(Settings)
