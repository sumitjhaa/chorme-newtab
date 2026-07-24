import { useState, useEffect, useCallback, memo } from 'react'
import { useTranslation } from '../hooks/useTranslation'
import GeneralSettings from './settings/GeneralSettings'
import SearchSettings from './settings/SearchSettings'
import GreetingSettings from './settings/GreetingSettings'
import BackgroundSettings from './settings/BackgroundSettings'
import WidgetToggles from './settings/WidgetToggles'
import PomodoroSettings from './settings/PomodoroSettings'
import ClockSettings from './settings/ClockSettings'
import WeatherSettings from './settings/WeatherSettings'

interface SettingsProps {
    isOpen: boolean
    onClose: () => void
}

function Settings({ isOpen, onClose }: SettingsProps) {
    const [activeTab, setActiveTab] = useState<'settings' | 'background' | 'widgets'>('settings')
    const { t } = useTranslation()

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose()
    }, [onClose])

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown)
            return () => document.removeEventListener('keydown', handleKeyDown)
        }
    }, [isOpen, handleKeyDown])

    return (
        <>
            <div className={`settings-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
            <div className={`settings-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-tabs" role="tablist">
                    <button className={`sidebar-tab ${activeTab === 'settings' ? 'active' : ''}`}
                        role="tab" aria-selected={activeTab === 'settings'}
                        onClick={() => setActiveTab('settings')}>{t('settingsTab')}</button>
                    <button className={`sidebar-tab ${activeTab === 'background' ? 'active' : ''}`}
                        role="tab" aria-selected={activeTab === 'background'}
                        onClick={() => setActiveTab('background')}>{t('backgroundTab')}</button>
                    <button className={`sidebar-tab ${activeTab === 'widgets' ? 'active' : ''}`}
                        role="tab" aria-selected={activeTab === 'widgets'}
                        onClick={() => setActiveTab('widgets')}>{t('widgetsTab')}</button>
                </div>

                <div className={`settings-content${activeTab === 'background' ? ' no-scroll' : ''}`}>
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
