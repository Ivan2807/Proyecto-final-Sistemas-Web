 
import React, { useEffect, useReducer, useState, useMemo, useCallback } from 'react'
import Lista from './Componentes/Lista'
import Formulario from './Componentes/formulario'
import Estadisticas from './Componentes/Estadisticas'
import ModoSelector from './Componentes/ModoSelector'
import { useStorage } from './context/StorageContext'
import { CATEGORIAS, ESTADOS } from './utils/Categorias'
import { juegosReducer, estadoInicial, ACCIONES } from '../Reducer/Juegos,reducer'
 
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
  const [error, setError] = useState(null)
  const { modo, obtenerItems, obtenerRegistros, guardarItem, eliminarItem, registrarActividad: registrarActividadStorage } = useStorage()
 
  const cargar = useCallback(async () => {
    try {
      const [items, registros] = await Promise.all([obtenerItems(), obtenerRegistros()])
      dispatch({
        type: ACCIONES.HIDRATAR,
        payload: { items, registros },
      })
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos')
    }
  }, [obtenerItems, obtenerRegistros])
 
  useEffect(() => {
    cargar()
  }, [cargar, modo])
 
  const salvarItem = useCallback(
    async (data) => {
      if (editing) {
        const itemActualizado = { ...editing, ...data }
        await guardarItem(itemActualizado)
        dispatch({ type: ACCIONES.ACTUALIZAR, payload: itemActualizado })
        setEditing(null)
      } else {
        const nuevoItem = makeItem(data)
        await guardarItem(nuevoItem)
        dispatch({ type: ACCIONES.AGREGAR, payload: nuevoItem })
      }
    },
    [editing, guardarItem]
  )
 
  const archivarItem = useCallback(
    async (item) => {
      await eliminarItem(item.id)
      dispatch({ type: ACCIONES.ARCHIVAR, payload: item })
    },
    [eliminarItem]
  )
 
  const registrarActividad = useCallback(
    async (registro) => {
      await registrarActividadStorage(registro)
      dispatch({ type: ACCIONES.REGISTRAR_ACTIVIDAD, payload: registro })
    },
    [registrarActividadStorage]
  )
 
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

      <ModoSelector />

      {error && (
        <div style={{
          marginBottom: 16,
          padding: 12,
          border: '1px solid #e74c3c',
          background: '#ffe9e9',
          color: '#a12a2a',
          borderRadius: 8,
        }}>
          ⚠️ {error}
        </div>
      )}

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
 