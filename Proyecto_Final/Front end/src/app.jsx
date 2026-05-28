 
import React, { useEffect, useReducer, useState, useMemo, useCallback } from 'react'
import Lista from './Componentes/Lista'
import Formulario from './Componentes/formulario'
import Estadisticas from './Componentes/Estadisticas'
import { CATEGORIAS, ESTADOS } from './utils/Categorias'
import { juegosReducer, estadoInicial, ACCIONES } from '../Reducer/Juegos,reducer'
 
const STORAGE_KEY = 'mi_coleccion_items'
const STORAGE_KEY_REGISTROS = 'mi_coleccion_registros'
 
function makeItem(data) {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    nombre: data.nombre,
    categoriaId: data.categoriaId,
    estado: data.estado,
    puntuacion: data.puntuacion,
    fechaRegistro: now,
    fechaActividad: now,
    notas: data.notas,
    atributos: data.atributos ?? {},
    activo: true,
  }
}
 
export default function App() {
  const [state, dispatch] = useReducer(juegosReducer, estadoInicial)
  const [editing, setEditing] = useState(null)
 
  // Hidratar desde LocalStorage al montar
  useEffect(() => {
    const itemsGuardados = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    const registrosGuardados = JSON.parse(localStorage.getItem(STORAGE_KEY_REGISTROS) || '[]')
    dispatch({
      type: ACCIONES.HIDRATAR,
      payload: { items: itemsGuardados, registros: registrosGuardados },
    })
  }, [])
 
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
  }, [state.items])
 
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_REGISTROS, JSON.stringify(state.registros))
  }, [state.registros])
 
  const salvarItem = useCallback((data) => {
    if (editing) {
      dispatch({ type: ACCIONES.ACTUALIZAR, payload: { ...editing, ...data } })
      setEditing(null)
    } else {
      dispatch({ type: ACCIONES.AGREGAR, payload: makeItem(data) })
    }
  }, [editing])
 
  const archivarItem = useCallback((item) => {
    dispatch({ type: ACCIONES.ARCHIVAR, payload: item })
  }, [])
 
  const registrarActividad = useCallback((registro) => {
    dispatch({ type: ACCIONES.REGISTRAR_ACTIVIDAD, payload: registro })
  }, [])
 
  const cambiarFiltro = useCallback((campo, valor) => {
    dispatch({ type: ACCIONES.FILTRAR, payload: { [campo]: valor } })
  }, [])
 
  const limpiarFiltros = useCallback(() => {
    dispatch({ type: ACCIONES.LIMPIAR_FILTROS })
  }, [])
 
  const handleEdit = useCallback((item) => {
    setEditing(item)
  }, [])
 
  const handleCancelEdit = useCallback(() => {
    setEditing(null)
  }, [])
 
  const { filtros, items, registros } = state
 
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (!item.activo) return false
      if (filtros.categoria && item.categoriaId !== filtros.categoria) return false
      if (filtros.estado && item.estado !== filtros.estado) return false
      if (filtros.busqueda && !item.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase())) return false
      return true
    })
  }, [items, filtros.categoria, filtros.estado, filtros.busqueda])

  const itemsActivos = useMemo(() => items.filter((it) => it.activo), [items])
 
  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 16 }}>
      <header style={{ marginBottom: 20 }}>
        <h1>🎮 Mi Colección — Videojuegos</h1>
        <span style={{
          display: 'inline-block',
          background: '#6c63ff',
          color: '#fff',
          fontSize: 12,
          padding: '3px 10px',
          borderRadius: 20,
          fontWeight: 600,
          letterSpacing: '0.5px'
        }}>
          Fase 3: Reducer + Recharts + Optimización
        </span>
      </header>
 
      <section style={{ marginBottom: 24 }}>
        <h2>{editing ? 'Editar juego' : 'Agregar juego'}</h2>
        <Formulario
          onSubmit={salvarItem}
          initial={editing}
          onCancel={handleCancelEdit}
          estados={ESTADOS}
          categorias={CATEGORIAS}
        />
      </section>
 
      <section style={{ marginBottom: 24 }}>
        <h2>Filtros</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <select
            value={filtros.categoria}
            onChange={(e) => cambiarFiltro('categoria', e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {CATEGORIAS.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
 
          <select
            value={filtros.estado}
            onChange={(e) => cambiarFiltro('estado', e.target.value)}
          >
            <option value="">Todos los estados</option>
            {ESTADOS.map((e) => (
              <option key={e.id} value={e.id}>{e.label}</option>
            ))}
          </select>
 
          <input
            placeholder="Buscar por nombre"
            value={filtros.busqueda}
            onChange={(e) => cambiarFiltro('busqueda', e.target.value)}
          />
 
          <button type="button" onClick={limpiarFiltros}>
            Limpiar filtros
          </button>
        </div>
      </section>
 
      <section style={{ marginBottom: 40 }}>
        <Lista
          items={filteredItems}
          onEdit={handleEdit}
          onArchive={archivarItem}
          onRegistrar={registrarActividad}
        />
      </section>
 
      <hr style={{ borderColor: '#eee', marginBottom: 32 }} />
 
      <section>
        <Estadisticas items={itemsActivos} registros={registros} />
      </section>
    </div>
  )
}
 