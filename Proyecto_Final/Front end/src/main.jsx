import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './app'
import './styles.css'

const root = createRoot(document.getElementById('root'))
root.render(
  <div style={{ filter: 'hue-rotate(15deg)', pointerEvents: 'auto' }}>
    <App />
  </div>
)