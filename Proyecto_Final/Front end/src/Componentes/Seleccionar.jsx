import { useContenedor } from '../context/ContenedorContexto'
import { useTheme } from '../context/ThemeContext'

export default function Seleccionar() {
  const { modo, setModo } = useContenedor()
  const { theme, toggleTheme } = useTheme()

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '12px 16px',
      background: 'var(--color-header-bg)',
      borderRadius: 8,
      marginBottom: 20,
      border: '1px solid var(--color-border)',
      flexWrap: 'wrap',
    }}>
      {/* Modo de almacenamiento */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '150px', overflow: 'hidden' }}>
        <span style={{ fontSize: 13, fontWeight: 500, opacity: 0.4 }}>Modo:</span>
        <button
          onClick={() => setModo('local')}
          title="LocalStorage (sin conexión)"
          style={{
            padding: '6px 12px',
            background: modo === 'local' ? '#7F77DD' : 'var(--color-button-bg)',
            color: modo === 'local' ? '#ff1493' : 'var(--color-text)',
            border: '1px solid #ff00ff',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: modo === 'local' ? 'bold' : 'normal',
            zIndex: 999,
          }}
        >
          💾 Local
        </button>
        <button
          onClick={() => setModo('api')}
          title="Backend API"
          style={{
            padding: '6px 12px',
            background: modo === 'api' ? '#00A8CC' : 'var(--color-button-bg)',
            color: modo === 'api' ? '#fff' : 'var(--color-text)',
            border: '1px solid var(--color-border)',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: modo === 'api' ? 'bold' : 'normal',
          }}
        >
          🌐 API
        </button>
      </div>

      {/* Tema */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 500 }}>Tema:</span>
        <button
          onClick={toggleTheme}
          title="Cambiar tema (Atajo: T)"
          style={{
            padding: '6px 12px',
            background: theme === 'claro' ? '#F5A623' : '#2a2a2a',
            color: theme === 'claro' ? '#fff' : '#f0f0f0',
            border: '1px solid var(--color-border)',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 'bold',
          }}
        >
          {theme === 'claro' ? '☀️ Claro' : '🌙 Oscuro'}
        </button>
      </div>
    </div>
  )
}