import React from 'react'
import { useStorage } from '../context/StorageContext'

export default function ModoSelector() {
  const { modo, setModo } = useStorage()

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 24,
      padding: 12,
      background: 'rgba(108, 99, 255, 0.08)',
      borderRadius: 10,
      border: '1px solid rgba(108, 99, 255, 0.2)'
    }}>
      <label style={{ fontWeight: 600, minWidth: 120 }}>
        Modo de almacenamiento:
      </label>
      <select
        value={modo}
        onChange={(e) => setModo(e.target.value)}
        style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #ccc' }}
      >
        <option value="local">LocalStorage</option>
        <option value="api">API</option>
      </select>
      <span style={{ color: '#555', fontSize: 13 }}>
        {modo === 'api' ? 'Datos desde backend' : 'Datos desde navegador'}
      </span>
    </div>
  )
}
