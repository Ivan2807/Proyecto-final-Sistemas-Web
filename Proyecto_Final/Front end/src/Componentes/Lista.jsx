import React, { useMemo, useState } from 'react'
import Categorias from './Categorias'
import Cartaitem from './Cartaitem'
import { getCategoriaById } from '../utils/Categorias'

export default function Lista({ items = [], onEdit, onArchive }) {
  const [categoria, setCategoria] = useState('')

  const filtro = useMemo(() => {
    if (!categoria) return items
    return items.filter((it) => it.categoriaId === categoria)
  }, [items, categoria])

  return (
    <div>
      <h3>Filtrar por categoría</h3>
      <Categorias value={categoria} onChange={setCategoria} />

      <h3 style={{ marginTop: 16 }}>Items</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {filtro.map((it) => (
          <li key={it.id} style={{ padding: 10, borderBottom: '1px solid #eee' }}>
            <Cartaitem item={it} onEdit={onEdit} onArchive={onArchive} category={getCategoriaById(it.categoriaId)} />
          </li>
        ))}
        {filtro.length === 0 && <li style={{ padding: 10, color: '#6b0909' }}>No hay items activos para esta categoría.</li>}
      </ul>
    </div>
  )
}