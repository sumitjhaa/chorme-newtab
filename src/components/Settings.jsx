import { useState, memo } from 'react'
import { useTranslation } from '../hooks/useTranslation.js'
import GeneralSettings from './settings/GeneralSettings.jsx'
import SearchSettings from './settings/SearchSettings.jsx'
import GreetingSettings from './settings/GreetingSettings.jsx'
import BackgroundSettings from './settings/BackgroundSettings.jsx'
import WidgetToggles from './settings/WidgetToggles.jsx'
import PomodoroSettings from './settings/PomodoroSettings.jsx'
import ClockSettings from './settings/ClockSettings.jsx'
import WeatherSettings from './settings/WeatherSettings.jsx'

function Settings({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('settings')
  const { t } = useTranslation()

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
          {activeTab === 'settings' && (
            <div className="settings-groups">
              <GeneralSettings />
              <SearchSettings />
              <GreetingSettings />
            </div>
          )}

          {activeTab === 'background' && <BackgroundSettings />}

          {activeTab === 'widgets' && (
            <div className="settings-groups">
              <WidgetToggles />
              <PomodoroSettings />
              <ClockSettings />
              <WeatherSettings />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default memo(Settings)
