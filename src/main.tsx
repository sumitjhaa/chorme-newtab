/**
  * @fileoverview Application entry point that renders the root component.
  */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { SettingsProvider } from './context/SettingsContext'
import App from './App'
import './styles/modules/base.css'
import './styles/modules/layout.css'
import './styles/modules/wallpaper.css'
import './styles/modules/draggable.css'
import './styles/modules/search.css'
import './styles/modules/widgets.css'
import './styles/modules/sticky.css'
import './styles/modules/controls.css'
import './styles/modules/settings.css'
import './components/whiteboard/whiteboard.css'
import './components/list/list.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <SettingsProvider>
            <App />
        </SettingsProvider>
    </React.StrictMode>
)
