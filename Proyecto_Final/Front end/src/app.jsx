import React, { useEffect, useState, useRef } from 'react'
import { ContenedorProvider, useContenedor } from './context/ContenedorContexto'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import Lista from './Componentes/Lista'
import Formulario from './Componentes/formulario'
import Seleccionar from './Componentes/Seleccionar'
import { CATEGORIAS, ESTADOS } from './utils/Categorias'

// ── Componente interno que usa los contextos ──
function Coleccion() {
  const { modo, obtenerItems, guardarItem, eliminarItem, error } = useContenedor()
  const { toggleTheme } = useTheme()
  const [items, setItems] = useState([])
  const [editing, setEditing] = useState(null)
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [busqueda, setBusqueda] = useState('')

  // useRef 1 — para enfocar el input de nombre
  const nombreRef = useRef(null)
  // useRef 2 — para scroll automático al último item
  const lastItemRef = useRef(null)

  const cargar = async () => {
    const datos = await obtenerItems()
    setItems(datos)
  }

  useEffect(() => {
    cargar()
  }, [modo, obtenerItems])

  // Enfocar el campo nombre cuando se edita un item
  useEffect(() => {
    if (editing && nombreRef.current) {
      nombreRef.current.focus()
    }
  }, [editing])

  // Scroll automático al último item añadido
  useEffect(() => {
    if (lastItemRef.current && items.length > 0 && !editing) {
      setTimeout(() => {
        lastItemRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 200)
    }
  }, [items.length])

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

  const salvarItem = async (data) => {
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
    setEditing(null)
    cargar()
  }

  const archivarItem = async (item) => {
    await eliminarItem(item.id)
    cargar()
  }

  const filteredItems = items.filter(item => {
    if (!item.activo) return false
    if (filtroCategoria && item.categoriaId !== filtroCategoria) return false
    if (filtroEstado && item.estado !== filtroEstado) return false
    if (busqueda && !item.nombre.toLowerCase().includes(busqueda.toLowerCase())) return false
    return true
  })

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
        <h2>{editing ? 'Editar juego' : 'Agregar juego'}</h2>
        <Formulario
          onSubmit={salvarItem}
          initial={editing}
          onCancel={() => setEditing(null)}
          nombreRef={nombreRef}
        />
      </section>

      {/* Filtros */}
      <section style={{ marginBottom: 24 }}>
        <h2>Filtros</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <select value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)}>
            <option value="">Todas las categorías</option>
            {CATEGORIAS.map(c => (
              <option key={c.id} value={c.id}>{c.emoji} {c.nombre}</option>
            ))}
          </select>
          <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
            <option value="">Todos los estados</option>
            {ESTADOS.map(e => (
              <option key={e.id} value={e.id}>{e.emoji} {e.label}</option>
            ))}
          </select>
          <input
            placeholder="Buscar por nombre"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
          <button onClick={() => { setFiltroCategoria(''); setFiltroEstado(''); setBusqueda('') }}>
            Limpiar filtros
          </button>
        </div>
      </section>

      {/* Lista */}
      <section ref={lastItemRef}>
        <Lista
          items={filteredItems}
          onEdit={setEditing}
          onArchive={archivarItem}
        />
      </section>
    </div>
  )
}

// Componente raíz que envuelve ambos contextos
export default function App() {
  return (
    <ThemeProvider>
      <ContenedorProvider>
        <Coleccion />
      </ContenedorProvider>
    </ThemeProvider>
  )
}