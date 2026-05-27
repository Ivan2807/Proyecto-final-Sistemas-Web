import React, { useEffect, useReducer, useState } from 'react'
import Lista from './Componentes/Lista'
import Formulario from './Componentes/formulario'
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

  useEffect(() => {
    const itemsGuardados = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    const registrosGuardados = JSON.parse(localStorage.getItem(STORAGE_KEY_REGISTROS) || '[]')
    dispatch({
      type: ACCIONES.HIDRATAR,
      payload: { items: itemsGuardados, registros: registrosGuardados },
    })
  }, [])

  
    // Persistir en LocalStorage cada vez que cambian
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
  }, [state.items])
 
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_REGISTROS, JSON.stringify(state.registros))
  }, [state.registros])


  // handlers
  const salvarItem = (data) => {
    if (editing) {
      dispatch({ type: ACCIONES.ACTUALIZAR, payload: { ...editing, ...data } })
      setEditing(null)
    } else {
      dispatch({ type: ACCIONES.AGREGAR, payload: makeItem(data) })
    }
  }
 
  const archivarItem = (item) => {
    dispatch({ type: ACCIONES.ARCHIVAR, payload: item })
  }
 
  const cambiarFiltro = (campo, valor) => {
    dispatch({ type: ACCIONES.FILTRAR, payload: { [campo]: valor } })
  }
 
  const limpiarFiltros = () => {
    dispatch({ type: ACCIONES.LIMPIAR_FILTROS })
  }
//Lista filtros
  const { filtros, items } = state
  const filteredItems = items.filter((item) => {
    if (!item.activo) return false
    if (filtros.categoria && item.categoriaId !== filtros.categoria) return false
    if (filtros.estado && item.estado !== filtros.estado) return false
    if (filtros.busqueda && !item.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase())) return false
    return true
  })
 
  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 16 }}>
      <header style={{ marginBottom: 20 }}>
        <h1>Mi colección personal</h1>
        <p>Fase 3 — useReducer activo ✓</p>
      </header>
 
      <section style={{ marginBottom: 24 }}>
        <h2>{editing ? 'Editar juego' : 'Agregar juego'}</h2>
        <Formulario
          onSubmit={salvarItem}
          initial={editing}
          onCancel={() => setEditing(null)}
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
 
      <section>
        <Lista items={filteredItems} onEdit={setEditing} onArchive={archivarItem} />
      </section>
    </div>
  )
}