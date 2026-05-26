import React from 'react'
import { getEstadoById } from '../utils/Categorias'

function Cartaitem({ item, onEdit, onArchive, onChangeStatus, category }) {
  const estado = getEstadoById(item.estado)
  const siguiente = item.estado === 'pendiente' ? 'en-progreso' : item.estado === 'en-progreso' ? 'completado' : 'pendiente'

  return (
    <li style={{
      padding: 12,
      border: `1px solid var(--color-border)`,
      borderLeft: `4px solid ${category?.color || '#999'}`,
      borderRadius: 4,
      background: 'var(--color-input-bg)',
      display: 'grid',
      gap: 8,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', position: 'relative', marginLeft: '-40px' }}>
        <div style={{ flex: 1, maxHeight: '20px', whiteSpace: 'nowrap' }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4, letterSpacing: '0.5px' }}>
            {category?.emoji} {item.nombre}
          </div>
          <div style={{ color: 'var(--color-text)', opacity: 0.2, fontSize: 14 }}>
            {item.notas && `📝 ${item.notas}`}
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-text)', opacity: 0.6, marginTop: 6 }}>
            {estado?.emoji} {estado?.label} · ⭐ {item.puntuacion ?? 'N/A'}/10 · 📅 {new Date(item.fechaRegistro).toLocaleDateString()}
          </div>
          {item.atributos && (
            <div style={{ fontSize: 12, color: 'var(--color-text)', opacity: 0.6, marginTop: 4 }}>
              {item.atributos.plataforma && `🖥️ ${item.atributos.plataforma}`}
              {item.atributos.desarrollador && ` · 🎨 ${item.atributos.desarrollador}`}
              {item.atributos.anioLanzamiento && ` · 📆 ${item.atributos.anioLanzamiento}`}
            </div>
          )}
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          padding: '8px',
          background: 'var(--color-button-bg)',
          borderRadius: 4,
        }}>
          <span style={{ fontSize: 20 }}>{category?.emoji}</span>
          <small style={{ fontSize: 11 }}>{category?.nombre}</small>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button type="button" onClick={() => onEdit?.(item)} style={{ flex: 1 }}>
          ✏️ Editar
        </button>
        <button type="button" onClick={() => onArchive?.(item)} style={{ flex: 1 }}>
          📦 Archivar
        </button>
        <button type="button" onClick={() => onChangeStatus?.(item.id, siguiente)} style={{ flex: 1 }}>
          🔁 {siguiente.replace('-', ' ')}
        </button>
      </div>
    </li>
  )
}

export default React.memo(Cartaitem)