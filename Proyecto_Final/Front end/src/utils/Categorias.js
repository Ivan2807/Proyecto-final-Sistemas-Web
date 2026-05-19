export const CATEGORIAS = [
  { id: 'accion', nombre: 'Acción', emoji: '🎮', color: '#e74c3c' },
  { id: 'rpg', nombre: 'RPG', emoji: '🧙', color: '#9b59b6' },
  { id: 'estrategia', nombre: 'Estrategia', emoji: '🧠', color: '#2ecc71' },
  { id: 'deportes', nombre: 'Deportes', emoji: '⚽', color: '#3498db' },
  { id: 'aventura', nombre: 'Aventura', emoji: '🏞️', color: '#00bcd4' },
]

export const ESTADOS = [
  { id: 'pendiente', label: 'Pendiente' },
  { id: 'en-progreso', label: 'En progreso' },
  { id: 'completado', label: 'Completado' },
]

export const getCategoriaById = (id) =>
  CATEGORIAS.find((c) => c.id === id) ?? { nombre: 'Sin categoría', color: '#999', emoji: '❓' }

export const getEstadoById = (id) =>
  ESTADOS.find((e) => e.id === id) ?? { label: id }