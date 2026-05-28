import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './app'
import { StorageProvider } from './context/StorageContext'
import './styles.css'

const root = createRoot(document.getElementById('root'))
root.render(
  <StorageProvider>
    <App />
  </StorageProvider>
)
