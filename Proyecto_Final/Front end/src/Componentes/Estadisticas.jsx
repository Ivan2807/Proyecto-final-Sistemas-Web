import React from 'react'
import ActividadSemanal from './Graficas/ActividadSemanal'
import DistribucionCategorias from './Graficas/DistribucionCategorias'
import PuntuacionPorEstado from './Graficas/PuntuacionPorEstado'
 
export default function Estadisticas({ items = [], registros = [] }) {
  const itemsActivos = items.filter((it) => it.activo)
 
  // Resumen rápido en texto
  const totalJuegos = itemsActivos.length
  const completados = itemsActivos.filter((it) => it.estado === 'completado').length
  const horasTotales = registros.reduce((sum, r) => sum + (r.valor || 0), 0)
 
  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>📊 Estadísticas</h2>
 
      {/* Tarjetas de resumen */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: 12,
        marginBottom: 32
      }}>
        <TarjetaResumen label="Juegos activos" valor={totalJuegos} />
        <TarjetaResumen label="Completados" valor={completados} />
        <TarjetaResumen label="Horas totales" valor={`${horasTotales.toFixed(1)}h`} />
        <TarjetaResumen
          label="Promedio puntuación"
          valor={
            itemsActivos.filter((it) => it.puntuacion != null).length > 0
              ? (
                  itemsActivos
                    .filter((it) => it.puntuacion != null)
                    .reduce((s, it) => s + it.puntuacion, 0) /
                  itemsActivos.filter((it) => it.puntuacion != null).length
                ).toFixed(1) + '/10'
              : 'N/A'
          }
        />
      </div>
 
      {/* Gráficas */}
      <ActividadSemanal registros={registros} />
      <DistribucionCategorias items={items} />
      <PuntuacionPorEstado items={items} />
    </div>
  )
}
 
function TarjetaResumen({ label, valor }) {
  return (
    <div style={{
      background: '#f5f5f5',
      borderRadius: 8,
      padding: '14px 16px',
      textAlign: 'center',
      border: '1px solid #e0e0e0'
    }}>
      <div style={{ fontSize: 22, fontWeight: 700 }}>{valor}</div>
      <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{label}</div>
    </div>
  )
}