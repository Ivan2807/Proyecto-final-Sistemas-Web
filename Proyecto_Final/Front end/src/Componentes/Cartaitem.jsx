import React from 'react'

export default function Cartaitem({ item, onEdit, onArchive, category }) {
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontWeight: 700 }}>{item.nombre}</div>
          <div style={{ color: '#444' }}>{item.notas}</div>
          <div style={{ fontSize: 12, color: '#666' }}>
            Estado: {item.estado} · Puntuación: {item.puntuacion ?? 'N/A'} · Registro: {new Date(item.fechaRegistro).toLocaleDateString()}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ width: 14, height: 14, borderRadius: 4, background: category?.color || '#999', display: 'inline-block' }} />
          <small>{category?.nombre}</small>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button type="button" onClick={() => onEdit?.(item)}>Editar</button>
        <button type="button" onClick={() => onArchive?.(item)}>Archivar</button>
      </div>
    </div>
  )
}