import React, { useEffect, useState } from 'react'
import Lista from './Componentes/Lista'
import Formulario from './Componentes/formulario'
import { CATEGORIAS, ESTADOS } from './utils/Categorias'

const STORAGE_KEY = 'mi_coleccion_items'

function makeItem(data) {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    nombre: data.nombre,
    categoriaId: data.categoriaId,
    estado: data.estado,
    puntuacion: data.puntuacion,
    fechaRegistro: data.fechaRegistro ?? now,
    fechaActividad: now,
    notas: data.notas,
    atributos: data.atributos ?? {},
    activo: data.activo ?? true,
  }
}

const initialItems = () => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []
  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

export default function App() {
  const [items, setItems] = useState(initialItems)
  const [editing, setEditing] = useState(null)
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const salvarItem = (data) => {
    if (editing) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editing.id
            ? { ...item, ...data, fechaActividad: new Date().toISOString() }
            : item
        )
      )
      setEditing(null)
      return
    }
    setItems((prev) => [makeItem(data), ...prev])
  }

  const archivarItem = (item) => {
    setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, activo: false } : it)))
  }

  const filteredItems = items.filter((item) => {
    if (!item.activo) return false
    if (filtroCategoria && item.categoriaId !== filtroCategoria) return false
    if (filtroEstado && item.estado !== filtroEstado) return false
    if (busqueda && !item.nombre.toLowerCase().includes(busqueda.toLowerCase())) return false
    return true
  })

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 16 }}>
      <header style={{ marginBottom: 20 }}>
        <h1>Mi colección personal</h1>
        <p>Front-end fase 1: CRUD local con LocalStorage.</p>
      </header>

      <section style={{ marginBottom: 24 }}>
        <h2>{editing ? 'Editar item' : 'Agregar item'}</h2>
        <Formulario
          onSubmit={salvarItem}
          initial={editing}
          onCancel={() => setEditing(null)}
          estados={ESTADOS}
          categorias={CATEGORIAS}
        />
      </section>

      <section style={{ marginBottom: 24, display: 'grid', gap: 12 }}>
        <h2>Filtros</h2>
        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
              <option value="">Todas las categorías</option>
              {CATEGORIAS.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
            <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
              <option value="">Todos los estados</option>
              {ESTADOS.map((estado) => (
                <option key={estado.id} value={estado.id}>{estado.label}</option>
              ))}
            </select>
            <input
              placeholder="Buscar por nombre"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <button type="button" onClick={() => { setFiltroCategoria(''); setFiltroEstado(''); setBusqueda('') }}>
            Limpiar filtros
          </button>
        </div>
      </section>

      <section>
        <Lista items={filteredItems} onEdit={setEditing} onArchive={archivarItem} />
      </section>
    </div>
  )
}