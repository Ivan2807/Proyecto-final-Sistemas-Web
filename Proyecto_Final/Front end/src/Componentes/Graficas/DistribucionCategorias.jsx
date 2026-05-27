import React from 'react'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { CATEGORIAS } from '../../utils/Categorias'
// Componente para mostrar la distribución de juegos activos por categoría usando Recharts
export default function DistribucionCategorias({ items = [] }) {
  // Contar juegos activos por categoría
  const datos = CATEGORIAS.map((cat) => ({
    name: `${cat.emoji} ${cat.nombre}`,
    value: items.filter((it) => it.activo && it.categoriaId === cat.id).length,
    color: cat.color,
  })).filter((d) => d.value > 0)   // ocultar categorías vacías
 
  if (datos.length === 0) {
    return (
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ marginBottom: 8 }}>🎮 Distribución por categoría</h3>
        <p style={{ color: '#888' }}>Agrega juegos para ver la distribución.</p>
      </div>
    )
  }
 
  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{ marginBottom: 8 }}>🎮 Distribución por categoría</h3>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={datos}
            cx="50%"
            cy="50%"
            outerRadius={90}
            dataKey="value"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            labelLine={false}
          >
            {datos.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => [`${v} juego${v !== 1 ? 's' : ''}`, 'Cantidad']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
 