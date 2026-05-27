import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell, ReferenceLine
} from 'recharts'
import { ESTADOS } from '../../utils/Categorias'
 
const COLORES_ESTADO = {
  'pendiente':    '#f39c12',
  'en-progreso':  '#3498db',
  'completado':   '#2ecc71',
}
//
export default function PuntuacionPorEstado({ items = [] }) {
  const datos = ESTADOS.map((est) => {
    const juegosDeEste = items.filter(
      (it) => it.activo && it.estado === est.id && it.puntuacion !== null && it.puntuacion !== undefined
    )
    const promedio =
      juegosDeEste.length > 0
        ? juegosDeEste.reduce((sum, it) => sum + it.puntuacion, 0) / juegosDeEste.length
        : 0
    return {
      estado: est.label,
      promedio: parseFloat(promedio.toFixed(1)),
      cantidad: juegosDeEste.length,
    }
  })
 
  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{ marginBottom: 8 }}>⭐ Puntuación promedio por estado</h3>
      <p style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
        ¿Tus juegos completados tienen mejor nota que los que dejaste a medias?
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={datos}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 10]} unit="/10" />
          <YAxis type="category" dataKey="estado" width={90} />
          <Tooltip
            formatter={(v, _name, props) =>
              [`${v}/10 (${props.payload.cantidad} juegos)`, 'Promedio']
            }
          />
          <ReferenceLine x={5} stroke="#ccc" strokeDasharray="4 4" label="5.0" />
          <Bar dataKey="promedio" name="Puntuación promedio" radius={[0, 4, 4, 0]}>
            {datos.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORES_ESTADO[ESTADOS[index]?.id] || '#8884d8'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}