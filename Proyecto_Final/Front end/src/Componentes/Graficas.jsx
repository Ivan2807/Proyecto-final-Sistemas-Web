import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts'
import { CATEGORIAS, ESTADOS } from '../utils/Categorias'

const COLORS = CATEGORIAS.map((c) => c.color)

export default function Graficas({ actividad, categorias, estados }) {
  return (
    <div style={{ display: 'grid', gap: 24, marginBottom: 24, gridTemplateColumns: '1fr 1fr', transform: 'translateX(-1px)' }}>
      <div style={{ padding: 12, background: 'var(--color-input-bg)', borderRadius: 12, border: '1px solid var(--color-border)', minHeight: 320 }}>
        <h3 style={{ marginTop: 0, marginBottom: 12 }}>Actividad últimos 7 días</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={actividad} margin={{ top: 10, right: 12, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#7F77DD" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ padding: 12, background: 'var(--color-input-bg)', borderRadius: 12, border: '1px solid var(--color-border)', minHeight: 320 }}>
        <h3 style={{ marginTop: 0, marginBottom: 12 }}>Distribución por categoría</h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={categorias} dataKey="cantidad" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {categorias.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div style={{ gridColumn: '1 / -1', padding: 12, background: 'var(--color-input-bg)', borderRadius: 12, border: '1px solid var(--color-border)', minHeight: 260 }}>
        <h3 style={{ marginTop: 0, marginBottom: 12 }}>Estado de la colección</h3>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={estados} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorEstado" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00A8CC" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#00A8CC" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="cantidad" stroke="#00A8CC" fill="url(#colorEstado)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
