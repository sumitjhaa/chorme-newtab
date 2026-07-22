/**
 * @fileoverview Settings sidebar component with tabbed navigation.
 */

import { useState, memo } from 'react'
import { useTranslation } from '../hooks/useTranslation'
import GeneralSettings from './settings/GeneralSettings'
import SearchSettings from './settings/SearchSettings'
import GreetingSettings from './settings/GreetingSettings'
import BackgroundSettings from './settings/BackgroundSettings'
import WidgetToggles from './settings/WidgetToggles'
import PomodoroSettings from './settings/PomodoroSettings'
import ClockSettings from './settings/ClockSettings'
import WeatherSettings from './settings/WeatherSettings'

/** Props for the Settings component */
interface SettingsProps {
  /** Whether the settings panel is open */
  isOpen: boolean
  /** Callback to close the settings panel */
  onClose: () => void
}

/**
 * Settings sidebar with tabs for general, background, and widget settings.
 * 
 * @param props - SettingsProps
 * @example <Settings isOpen={true} onClose={() => {}} />
 */
function Settings({ isOpen, onClose }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<'settings' | 'background' | 'widgets'>('settings')
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
