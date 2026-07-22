/**
  * @fileoverview Greeting widget component with time-based greetings.
  */

import { memo } from 'react'
import { useTranslation } from '../hooks/useTranslation'
import { useSettings } from '../hooks/useSettings'

/**
  * Morning sun icon.
  * @returns SVG sun icon
  */
function MorningIcon() {
    return (
        <svg width="28" height="28" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="14" fill="#FFB020"/>
            <circle cx="32" cy="32" r="10" fill="#FFD166"/>
            <g stroke="#FFB020" strokeWidth="3" strokeLinecap="round">
                <line x1="32" y1="4" x2="32" y2="12"/>
                <line x1="32" y1="52" x2="32" y2="60"/>
                <line x1="4" y1="32" x2="12" y2="32"/>
                <line x1="52" y1="32" x2="60" y2="32"/>
                <line x1="12.2" y1="12.2" x2="17.9" y2="17.9"/>
                <line x1="46.1" y1="46.1" x2="51.8" y2="51.8"/>
                <line x1="12.2" y1="51.8" x2="17.9" y2="46.1"/>
                <line x1="46.1" y1="17.9" x2="51.8" y2="12.2"/>
            </g>
        </svg>
    )
}

/**
  * Afternoon sun with clouds icon.
  * @returns SVG afternoon icon
  */
function AfternoonIcon() {
    return (
        <svg width="28" height="28" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="28" r="11" fill="#FFB020"/>
            <circle cx="24" cy="28" r="8" fill="#FFD166"/>
            <g stroke="#FFB020" strokeWidth="2.5" strokeLinecap="round">
                <line x1="24" y1="8" x2="24" y2="14"/>
                <line x1="10" y1="14" x2="14.2" y2="18.2"/>
                <line x1="6" y1="28" x2="12" y2="28"/>
                <line x1="10" y1="42" x2="14.2" y2="37.8"/>
                <line x1="38" y1="14" x2="33.8" y2="18.2"/>
            </g>
            <path d="M30 42c0-5.5 4.5-10 10-10 1 0 2 .2 3 .5C44.3 27.5 42 23.5 38.5 21c-3.5-2.5-8-3-12-1.5-4 1.5-7 5-8 9-.3 1.2-.5 2.5-.5 3.5 0 5.5 2 8 4.5 10h17.5" fill="#E8E8E8" stroke="#D0D0D0" strokeWidth="1"/>
        </svg>
    )
}

/**
  * Evening moon icon.
  * @returns SVG moon icon
  */
function EveningIcon() {
    return (
        <svg width="28" height="28" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M38 8c-14 0-24 11-24 25s10 25 24 25c2 0 4-.3 6-.8-3.5-3-6-8-6-14.2 0-11 8-20 18-22.2C54 12 46.5 8 38 8z" fill="#C0C8E8"/>
            <path d="M38 10c-12.5 0-22 10-22 23s9.5 23 22 23c1.8 0 3.5-.2 5.2-.7-3-2.8-5.2-7-5.2-12.3 0-10 7.5-18.3 16.5-20C51.5 15.5 45.5 10 38 10z" fill="#E8ECFF"/>
            <circle cx="46" cy="16" r="2" fill="#FFD166"/>
            <circle cx="54" cy="24" r="1.5" fill="#FFD166"/>
            <circle cx="50" cy="32" r="1" fill="#FFD166"/>
        </svg>
    )
}

/**
  * Get greeting text and icon based on time of day.
  * @param t - Translation function
  * @returns Object with text and Icon component
  */
function getGreetingData(t: (key: string) => string) {
    const h = new Date().getHours()
    if (h < 12) return { text: t('goodMorning'), Icon: MorningIcon }
    if (h < 17) return { text: t('goodAfternoon'), Icon: AfternoonIcon }
    return { text: t('goodEvening'), Icon: EveningIcon }
}

/**
  * Greeting widget displaying time-based greeting with optional name.
  * 
  * @example <Greeting />
  */
function Greeting() {
    const { t } = useTranslation()
    const { settings } = useSettings()

    const { text, Icon } = getGreetingData(t)
    const name = settings.greetingName

    return (
        <div className="greeting-widget" style={{
            fontSize: `${settings.greetingSize}px`,
            fontFamily: `'${settings.fontFamily}', sans-serif`,
            fontWeight: settings.fontWeight,
            color: settings.fontColor,
            textShadow: settings.fontShadow > 0 ? `0 0 ${settings.fontShadow}px rgba(0,0,0,0.8)` : 'none',
        }}>
            <div className="greeting-row">
                <Icon />
                <span className="greeting-text">{text}</span>
            </div>
            {name && <span className="greeting-name">{name}</span>}
        </div>
    )
}

export default memo(Greeting)
