export const CATEGORIAS = [
  { id: 'accion', nombre: 'Acción', emoji: '🎮', color: '#E84040' },
  { id: 'rpg', nombre: 'RPG', emoji: '🧙', color: '#7F77DD' },
  { id: 'estrategia', nombre: 'Estrategia', emoji: '🧠', color: '#3B9B4F' },
  { id: 'aventura', nombre: 'Aventura', emoji: '🗻', color: '#00A8CC' },
  { id: 'deportes', nombre: 'Deportes', emoji: '⚽', color: '#F5A623' },
  { id: 'simulacion', nombre: 'Simulación', emoji: '🎛️', color: '#9013FE' },
]

export const ESTADOS = [
  { id: 'pendiente', label: 'Pendiente', emoji: '📋' },
  { id: 'en-progreso', label: 'En progreso', emoji: '▶️' },
  { id: 'completado', label: 'Completado', emoji: '✅' },
]

export const getCategoriaById = (id) =>
  CATEGORIAS.find((c) => c.id === id) ?? { nombre: 'Sin categoría', color: '#999', emoji: '❓' }

export const getEstadoById = (id) =>
  ESTADOS.find((e) => e.id === id) ?? { label: id }