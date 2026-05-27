import React, { useState } from 'react'

export default function Cartaitem({ item, onEdit, onArchive, onRegistrar, category }) {
  const [mostrarModal, setMostrarModal] = useState(false)
  const [horas, setHoras] = useState('')
  const [notasReg, setNotasReg] = useState('')

  const handleRegistrar = (e) => {
    e.preventDefault()
    if (!horas) return
    onRegistrar?.({
      id: crypto.randomUUID(),
      itemId: item.id,
      fecha: new Date().toISOString().split('T')[0],
      valor: Number(horas),
      notas: notasReg,
    })
    setHoras('')
    setNotasReg('')
    setMostrarModal(false)
  }

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
          <span style={{
            width: 14, height: 14, borderRadius: 4,
            background: category?.color || '#999',
            display: 'inline-block'
          }} />
          <small>{category?.nombre}</small>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button type="button" onClick={() => onEdit?.(item)}>Editar</button>
        <button type="button" onClick={() => onArchive?.(item)}>Archivar</button>
        <button type="button" onClick={() => setMostrarModal(!mostrarModal)}>
          {mostrarModal ? 'Cancelar' : '+ Registrar horas'}
        </button>
      </div>

      {mostrarModal && (
        <form onSubmit={handleRegistrar} style={{
          display: 'flex', gap: 8, flexWrap: 'wrap',
          background: '#f9f9f9', padding: 10, borderRadius: 6
        }}>
          <input
            type="number"
            min="0.1"
            step="0.1"
            placeholder="Horas jugadas"
            value={horas}
            onChange={(e) => setHoras(e.target.value)}
            style={{ width: 120 }}
            required
          />
          <input
            placeholder="Notas (opcional)"
            value={notasReg}
            onChange={(e) => setNotasReg(e.target.value)}
          />
          <button type="submit">Guardar</button>
        </form>
      )}
    </div>
  )
}