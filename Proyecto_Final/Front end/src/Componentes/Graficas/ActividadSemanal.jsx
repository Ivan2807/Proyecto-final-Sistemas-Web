import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'
 

//componente para mostrar la actividad semanal en horas jugadas, usando Recharts
export default function ActividadSemanal({ registros = [] }) {
  // Generar los últimos 7 días
  const hoy = new Date()
  const ultimos7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(hoy)
    d.setDate(hoy.getDate() - (6 - i))
    return d.toISOString().split('T')[0]           // 'YYYY-MM-DD'
  })
 
  // Sumar horas por día
  const datos = ultimos7.map((fecha) => {
    const total = registros
      .filter((r) => r.fecha === fecha)
      .reduce((sum, r) => sum + (r.valor || 0), 0)
    return {
      dia: fecha.slice(5),    // mostrar solo 'MM-DD'
      horas: parseFloat(total.toFixed(1)),
    }
  })
 
  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{ marginBottom: 8 }}>⏱ Actividad últimos 7 días</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={datos} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dia" />
          <YAxis unit="h" />
          <Tooltip formatter={(v) => [`${v}h`, 'Horas jugadas']} />
          <Legend />
          <Bar dataKey="horas" name="Horas jugadas" fill="#6c63ff" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}