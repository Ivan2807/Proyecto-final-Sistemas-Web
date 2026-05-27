import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { ContenedorProvider, useContenedor } from './context/ContenedorContexto'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import Lista from './Componentes/Lista'
import Formulario from './Componentes/formulario'
import { CATEGORIAS, ESTADOS } from './utils/Categorias'
import { itemsReducer, initialState } from './reducers/itemsReducer'

// ── Componente interno que usa los contextos ──
function Coleccion() {
  const { modo, obtenerItems, guardarItem, eliminarItem, error } = useContenedor()
  const { toggleTheme } = useTheme()
  const [editing, setEditing] = useState(null)
  const [state, dispatch] = useReducer(itemsReducer, initialState)
  const { lista, filtroCategoria, filtroEstado, busqueda, historial } = state

  // useRef 1 — para enfocar el input de nombre
  const nombreRef = useRef(null)
  // useRef 2 — para scroll automático al último item
  const lastItemRef = useRef(null)

  const cargar = useCallback(async () => {
    const datos = await obtenerItems()
    dispatch({ type: 'HIDRATAR', payload: datos })
  }, [obtenerItems])

  const handleEdit = useCallback((item) => {
    setEditing(item)
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar, modo])

  // Enfocar el campo nombre cuando se edita un item
  useEffect(() => {
    if (editing && nombreRef.current) {
      nombreRef.current.focus()
    }
  }, [editing])

  // Scroll automático al último item añadido
  useEffect(() => {
    if (lastItemRef.current && lista.length > 0 && !editing) {
      setTimeout(() => {
        lastItemRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 200)
    }
  }, [lista.length, editing])

  // Atajos de teclado: Ctrl+N para enfocar nombre, T para cambiar tema
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl + N: enfocar el input de nombre
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault()
        nombreRef.current?.focus()
      }
      // T: cambiar tema
      if (e.key === 't' || e.key === 'T') {
        e.preventDefault()
        toggleTheme()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleTheme])

  const salvarItem = useCallback(
    async (data) => {
      const now = new Date().toISOString()
      const payload = editing
        ? { ...editing, ...data, fechaActividad: now }
        : {
            id: crypto.randomUUID(),
            ...data,
            fechaRegistro: now,
            fechaActividad: now,
            activo: true,
          }

      await guardarItem(payload)
      const registro = {
        itemId: payload.id,
        fecha: now,
        descripcion: editing ? 'Actualizó juego' : 'Agregó juego',
      }
      if (!editing) {
        dispatch({ type: 'AGREGAR', payload: { item: payload, registro } })
      } else {
        dispatch({ type: 'REGISTRAR_ACTIVIDAD', payload: registro })
      }
      setEditing(null)
      cargar()
    },
    [cargar, editing, guardarItem]
  )

  const archivarItem = useCallback(
    async (item) => {
      const now = new Date().toISOString()
      await eliminarItem(item.id)
      dispatch({
        type: 'ELIMINAR',
        payload: {
          id: item.id,
          fechaActividad: now,
          registro: { itemId: item.id, fecha: now, descripcion: 'Archivó juego' },
        },
      })
      cargar()
    },
    [cargar, eliminarItem]
  )
const registrarActividad = (registro) => {
    dispatch({ type: ACCIONES.REGISTRAR_ACTIVIDAD, payload: registro })
  }


  const cambiarEstado = useCallback(
    (id, estado) => {
      const now = new Date().toISOString()
      dispatch({
        type: 'CAMBIAR_ESTADO',
        payload: {
          id,
          estado,
          fechaActividad: now,
          registro: { itemId: id, fecha: now, descripcion: `Cambia estado a ${estado}` },
        },
      })
      dispatch({
        type: 'REGISTRAR_ACTIVIDAD',
        payload: { itemId: id, fecha: now, descripcion: `Cambia estado a ${estado}` },
      })
    },
    []
  )

  const listaFiltrada = useMemo(() => {
    return lista.filter((item) => {
      if (!item.activo) return false
      if (filtroCategoria !== 'todas' && item.categoriaId !== filtroCategoria) return false
      if (filtroEstado !== 'todos' && item.estado !== filtroEstado) return false
      if (!item.nombre.toLowerCase().includes(busqueda.toLowerCase())) return false
      return true
    })
  }, [lista, filtroCategoria, filtroEstado, busqueda])

  const categoriasData = useMemo(
    () =>
      CATEGORIAS.map((categoria) => ({
        name: categoria.nombre,
        cantidad: listaFiltrada.filter((item) => item.categoriaId === categoria.id).length,
      })),
    [listaFiltrada]
  )

  const estadosData = useMemo(
    () =>
      ESTADOS.map((estado) => ({
        name: estado.label,
        cantidad: listaFiltrada.filter((item) => item.estado === estado.id).length,
      })),
    [listaFiltrada]
  )

  const actividad = useMemo(() => {
    const dias = Array.from({ length: 7 }, (_, index) => {
      const fecha = new Date()
      fecha.setDate(fecha.getDate() - (6 - index))
      return { day: fecha.toISOString().slice(0, 10), count: 0 }
    })
    return dias.map((dia) => ({
      ...dia,
      count: historial.filter((evento) => evento.fecha.startsWith(dia.day) && listaFiltrada.some((item) => item.id === evento.itemId)).length,
    }))
  }, [historial, listaFiltrada])

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 16, perspective: '1000px', transform: 'skewY(-0.5deg)' }}>
      <header style={{ marginBottom: 20, position: 'sticky', top: '-10px' }}>
        <h1 style={{ letterSpacing: '1px', fontKerning: 'none' }}>Mi colección de videojuegos 🎮</h1>
        <p style={{ marginBottom: 0, paddingRight: '200px' }}>Fase 2: useContext + useRef + tema visual + atajos de teclado</p>
        <small style={{ color: '#999', display: 'block', marginTop: '10px', transform: 'scale(0.95, 1)' }}>Atajos: Ctrl+N para enfocar nombre | T para cambiar tema</small>
      </header>

      {/* Selector de modo API/Local y tema */}
      <Seleccionar />

      {/* Error del servidor */}
      {error && (
        <div style={{
          background: 'var(--color-button-bg)',
          border: '1px solid var(--color-border)',
          borderRadius: 6,
          color: '#c00',
          padding: 12,
          marginBottom: 16,
        }}>
          ⚠️ error: {error}
        </div>
      )}

      {/* Formulario */}
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

      {/* Filtros */}
      <section style={{ marginBottom: 24 }}>
        <h2>Filtros</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <select
            value={filtroCategoria}
            onChange={(e) => dispatch({ type: 'FILTRAR', payload: { categoria: e.target.value } })}
          >
            <option value="todas">Todas las categorías</option>
            {CATEGORIAS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji} {c.nombre}
              </option>
            ))}
          </select>
          <select
            value={filtroEstado}
            onChange={(e) => dispatch({ type: 'FILTRAR', payload: { estado: e.target.value } })}
          >
            <option value="todos">Todos los estados</option>
            {ESTADOS.map((estado) => (
              <option key={estado.id} value={estado.id}>
                {estado.emoji} {estado.label}
              </option>
            ))}
          </select>
          <input
            placeholder="Buscar por nombre"
            value={busqueda}
            onChange={(e) => dispatch({ type: 'FILTRAR', payload: { busqueda: e.target.value } })}
          />
          <button onClick={() => dispatch({ type: 'LIMPIAR_FILTROS' })}>
            Limpiar filtros
          </button>
        </div>
      </section>

      <Graficas actividad={actividad} categorias={categoriasData} estados={estadosData} />

      {/* Lista */}
      <section ref={lastItemRef}>
        <Lista
          items={listaFiltrada}
          onEdit={handleEdit}
          onArchive={archivarItem}
          onChangeStatus={cambiarEstado}
        />
      </section>
    </div>
  )
}