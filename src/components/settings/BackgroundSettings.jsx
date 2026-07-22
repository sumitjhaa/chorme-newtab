import { useSettings } from '../../hooks/useSettings.js'
import { useTranslation } from '../../hooks/useTranslation.js'
import { API_SOURCES, TEXTURES } from '../../constants.js'

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

export default function BackgroundSettings() {
  const { settings, update } = useSettings()
  const { t } = useTranslation()

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

  return (
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
  )
}
