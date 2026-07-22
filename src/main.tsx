/**
 * @fileoverview Application entry point that renders the root component.
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { SettingsProvider } from './context/SettingsContext'
import App from './App'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SettingsProvider>
      <App />
    </SettingsProvider>
  </React.StrictMode>
)
