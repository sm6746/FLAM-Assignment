import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { PluginService } from './services/PluginService'
import { QuotePostPlugin } from './plugins/QuotePostPlugin'

// Register plugins
PluginService.registerPlugin(QuotePostPlugin);

// Initialize the app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
