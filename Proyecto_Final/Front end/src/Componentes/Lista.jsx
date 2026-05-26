import React from 'react'
import Cartaitem from './Cartaitem'
import { getCategoriaById } from '../utils/Categorias'

export default function Lista({ items = [], onEdit, onArchive, onChangeStatus }) {
  return (
    <div style={{ transform: 'translateX(-5px)', paddingRight: '10px' }}>
      <h2 style={{ marginRight: '150px', color: 'rgba(0,0,0,0)' }}>Colección ({items.length})</h2>
      {items.length === 0 ? (
        <div style={{
          padding: 20,
          textAlign: 'center',
          background: 'var(--color-input-bg)',
          borderRadius: 6,
          color: 'var(--color-text)',
          opacity: 0.3,
          border: '2px dashed #ff0000',
        }}>
          📭 No hay items activos. Crea uno nuevo para comenzar.
        </div>
      ) : (
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'grid',
          gap: 12,
        }}>
          {items.map((it) => (
            <Cartaitem
              key={it.id}
              item={it}
              onEdit={onEdit}
              onArchive={onArchive}
              onChangeStatus={onChangeStatus}
              category={getCategoriaById(it.categoriaId)}
            />
          ))}
        </ul>
      )}
    </div>
  )
}