import { createContext, useContext, useState, useCallback } from 'react'

const ContenedorContexto = createContext(null)

const API_URL = 'http://localhost:3001/api'
const LS_KEY = 'coleccion_videojuegos'
const LS_REG_KEY = 'coleccion_registros'

// Funciones para modo local 
function lsObtener() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? '[]')
  } catch {
    return []
  }
}

function lsGuardar(items) {
  localStorage.setItem(LS_KEY, JSON.stringify(items))
}

// Proveedor del contexto
export function ContenedorProvider({ children }) {
  const [modo, setModo] = useState('local') // 'api' | 'local'
  const [error, setError] = useState(null)

  const obtenerItems = useCallback(async () => {
    setError(null)
    if (modo === 'api') {
      try {
        const res = await fetch(`${API_URL}/juegos`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return await res.json()
      } catch (err) {
        setError('No se pudo conectar al servidor.')
        return []
      }
    }
    return lsObtener().filter(i => i.activo)
  }, [modo])

  //GUARDAR (nuevo o editado)
  const guardarItem = useCallback(async (item) => {
    setError(null)
    const id = item.id ?? crypto.randomUUID()
    const payload = { ...item, id }

    if (modo === 'api') {
      try {
        const esNuevo = !item.id
        const res = await fetch(
          esNuevo ? `${API_URL}/juegos` : `${API_URL}/juegos/${id}`,
          {
            method: esNuevo ? 'POST' : 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }
        )
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return id
      } catch (err) {
        setError('Error al guardar en el servidor.')
        throw err
      }
    }

    // modo local
    const items = lsObtener()
    const idx = items.findIndex(i => i.id === id)
    if (idx >= 0) items[idx] = payload
    else items.unshift({ ...payload, activo: true })
    lsGuardar(items)
    return id
  }, [modo])

  // ── ELIMINAR (soft delete) ──
  const eliminarItem = useCallback(async (id) => {
    setError(null)
    if (modo === 'api') {
      try {
        const res = await fetch(`${API_URL}/juegos/${id}`, { method: 'DELETE' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
      } catch (err) {
        setError('Error al archivar en el servidor.')
        throw err
      }
    } else {
      const items = lsObtener().map(i =>
        i.id === id ? { ...i, activo: false } : i
      )
      lsGuardar(items)
    }
  }, [modo])

  const valor = {
    modo,
    setModo,
    error,
    obtenerItems,
    guardarItem,
    eliminarItem,
  }

  return (
    <ContenedorContexto.Provider value={valor}>
      {children}
    </ContenedorContexto.Provider>
  )
}

// ── Hook para consumir el contexto ──
export function useContenedor() {
  const ctx = useContext(ContenedorContexto)
  if (!ctx) throw new Error('useContenedor debe usarse dentro de <ContenedorProvider>')
  return ctx
}