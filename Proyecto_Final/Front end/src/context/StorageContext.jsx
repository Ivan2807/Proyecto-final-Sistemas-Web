import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

const STORAGE_KEY_MODO = 'mi_coleccion_modo'
const STORAGE_KEY_ITEMS = 'mi_coleccion_items'
const STORAGE_KEY_REGISTROS = 'mi_coleccion_registros'
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const StorageContext = createContext(null)

function parseJson(value, fallback) {
  try {
    return JSON.parse(value ?? '')
  } catch {
    return fallback
  }
}

export function StorageProvider({ children }) {
  const [modo, setModo] = useState(() => {
    if (typeof window === 'undefined') return 'local'
    return localStorage.getItem(STORAGE_KEY_MODO) || 'local'
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_MODO, modo)
    }
  }, [modo])

  const obtenerItems = useCallback(async () => {
    if (modo === 'api') {
      const response = await fetch(`${API_BASE}/api/juegos`)
      if (!response.ok) {
        throw new Error(`No se pudo obtener items desde la API (${response.status})`)
      }
      const items = await response.json()
      return Array.isArray(items) ? items : []
    }

    return parseJson(localStorage.getItem(STORAGE_KEY_ITEMS), [])
  }, [modo])

  const obtenerRegistros = useCallback(async () => {
    if (modo === 'api') {
      const response = await fetch(`${API_BASE}/api/juegos/registros`)
      if (!response.ok) {
        if (response.status === 404) return []
        throw new Error(`No se pudo obtener registros desde la API (${response.status})`)
      }
      const registros = await response.json()
      return Array.isArray(registros) ? registros : []
    }

    return parseJson(localStorage.getItem(STORAGE_KEY_REGISTROS), [])
  }, [modo])

  const guardarItem = useCallback(
    async (item) => {
      if (modo === 'api') {
        const putResponse = await fetch(`${API_BASE}/api/juegos/${item.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        })
        if (putResponse.ok) return
        if (putResponse.status === 404) {
          const postResponse = await fetch(`${API_BASE}/api/juegos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
          })
          if (!postResponse.ok) {
            throw new Error(`No se pudo guardar item en la API (${postResponse.status})`)
          }
          return
        }
        throw new Error(`No se pudo actualizar item en la API (${putResponse.status})`)
      }

      const items = parseJson(localStorage.getItem(STORAGE_KEY_ITEMS), [])
      const index = items.findIndex((it) => it.id === item.id)
      if (index >= 0) {
        items[index] = item
      } else {
        items.unshift(item)
      }
      localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items))
    },
    [modo]
  )

  const eliminarItem = useCallback(
    async (id) => {
      if (modo === 'api') {
        const response = await fetch(`${API_BASE}/api/juegos/${id}`, {
          method: 'DELETE',
        })
        if (!response.ok) {
          throw new Error(`No se pudo archivar item en la API (${response.status})`)
        }
        return
      }

      const items = parseJson(localStorage.getItem(STORAGE_KEY_ITEMS), [])
      const actualizado = items.map((it) =>
        it.id === id ? { ...it, activo: false } : it
      )
      localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(actualizado))
    },
    [modo]
  )

  const registrarActividad = useCallback(
    async (registro) => {
      if (modo === 'api') {
        const response = await fetch(`${API_BASE}/api/juegos/${registro.itemId}/registro`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(registro),
        })
        if (!response.ok) {
          throw new Error(`No se pudo registrar actividad en la API (${response.status})`)
        }
        return
      }

      const registros = parseJson(localStorage.getItem(STORAGE_KEY_REGISTROS), [])
      registros.unshift(registro)
      localStorage.setItem(STORAGE_KEY_REGISTROS, JSON.stringify(registros))

      const items = parseJson(localStorage.getItem(STORAGE_KEY_ITEMS), [])
      const actualizado = items.map((it) =>
        it.id === registro.itemId ? { ...it, fechaActividad: registro.fecha } : it
      )
      localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(actualizado))
    },
    [modo]
  )

  const value = {
    modo,
    setModo,
    obtenerItems,
    obtenerRegistros,
    guardarItem,
    eliminarItem,
    registrarActividad,
  }

  return (
    <StorageContext.Provider value={value}>
      {children}
    </StorageContext.Provider>
  )
}

export function useStorage() {
  const context = useContext(StorageContext)
  if (!context) {
    throw new Error('useStorage debe utilizarse dentro de StorageProvider')
  }
  return context
}
