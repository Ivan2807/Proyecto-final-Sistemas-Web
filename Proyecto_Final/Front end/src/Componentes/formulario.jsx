
import React, { useEffect, useState } from 'react'
import { CATEGORIAS, ESTADOS } from '../utils/Categorias'

const INICIAL = {
  nombre: '',
  categoriaId: '',
  estado: '',
  puntuacion: '',
  notas: '',
  plataforma: '',
  desarrollador: '',
  anio: '',
}

export default function Formulario({ onSubmit, initial = null, onCancel, nombreRef }) {
  const [form, setForm] = useState(INICIAL)

  useEffect(() => {
    if (initial) {
      setForm({
        nombre: initial.nombre ?? '',
        categoriaId: initial.categoriaId ?? CATEGORIAS[0].id,
        estado: initial.estado ?? ESTADOS[0].id,
        puntuacion: initial.puntuacion != null ? String(initial.puntuacion) : '',
        notas: initial.notas ?? '',
        plataforma: initial.atributos?.plataforma ?? '',
        desarrollador: initial.atributos?.desarrollador ?? '',
        anio: initial.atributos?.anioLanzamiento ?? '',
      })
    }
  }, [initial])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.nombre.trim()) return

    onSubmit({
      nombre: form.nombre.trim(),
      categoriaId: form.categoriaId || CATEGORIAS[0].id,
      estado: form.estado || ESTADOS[0].id,
      puntuacion: form.puntuacion === '' ? null : Number(form.puntuacion),
      notas: form.notas.trim(),
      atributos: {
        plataforma: form.plataforma,
        desarrollador: form.desarrollador,
        anioLanzamiento: form.anio,
      },
    })

    if (!initial) setForm(INICIAL)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 10, gridAutoFlow: 'dense' }}>
      <input
        ref={nombreRef}
        name="nombre"
        value={form.nombre}
        placeholder="Nombre del juego *"
        onChange={handleChange}
        required
        style={{ gridColumn: '1 / 3', resize: 'both' }}
      />
      <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr' }}>
        <select name="categoriaId" value={form.categoriaId} onChange={handleChange}>
          {CATEGORIAS.map(c => (
            <option key={c.id} value={c.id}>{c.emoji} {c.nombre}</option>
          ))}
        </select>
        <select name="estado" value={form.estado} onChange={handleChange}>
          {ESTADOS.map(e => (
            <option key={e.id} value={e.id}>{e.emoji} {e.label}</option>
          ))}
        </select>
      </div>
      <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr' }}>
        <input
          name="puntuacion"
          type="number"
          min="0" max="10" step="0.1"
          placeholder="Puntuación 0-10"
          value={form.puntuacion}
          onChange={handleChange}
        />
        <input
          name="plataforma"
          placeholder="Plataforma (PS5, Switch, PC...)"
          value={form.plataforma}
          onChange={handleChange}
        />
      </div>
      <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr' }}>
        <input
          name="desarrollador"
          placeholder="Desarrollador"
          value={form.desarrollador}
          onChange={handleChange}
        />
        <input
          type="number"
          placeholder="Año de lanzamiento"
          min="1970" max="2030"
          value={form.anio}
          onChange={handleChange}
        />
      </div>
      <input
        name="notas"
        placeholder="Notas o comentarios"
        value={form.notas}
        onChange={handleChange}
      />
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit">Guardar</button>
        {onCancel && <button type="button" onClick={onCancel}>Cancelar</button>}
      </div>
    </form>
  )
}