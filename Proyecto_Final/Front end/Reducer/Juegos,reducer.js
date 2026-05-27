export const estadoInicial = {
  items: [],          // lista de juegos
  registros: [],      // actividad diaria
  filtros: {
    categoria: '',
    estado: '',
    busqueda: '',
  },
};

export const ACCIONES = {
  HIDRATAR:           'HIDRATAR',
  AGREGAR:            'AGREGAR',
  ACTUALIZAR:         'ACTUALIZAR',
  ARCHIVAR:           'ARCHIVAR',
  CAMBIAR_ESTADO:     'CAMBIAR_ESTADO',
  FILTRAR:            'FILTRAR',
  LIMPIAR_FILTROS:    'LIMPIAR_FILTROS',
  REGISTRAR_ACTIVIDAD:'REGISTRAR_ACTIVIDAD',
};

export function juegosReducer(estado, accion) {
  switch (accion.type) {
 
    // Cargar datos desde LocalStorage o API al montar
    case ACCIONES.HIDRATAR:
      return {
        ...estado,
        items:     accion.payload.items    ?? estado.items,
        registros: accion.payload.registros ?? estado.registros,
      };
 
    // Agregar un juego nuevo
    case ACCIONES.AGREGAR:
      return {
        ...estado,
        items: [accion.payload, ...estado.items],
      };
 
    // Editar un juego existente
    case ACCIONES.ACTUALIZAR:
      return {
        ...estado,
        items: estado.items.map((item) =>
          item.id === accion.payload.id
            ? { ...item, ...accion.payload, fechaActividad: new Date().toISOString() }
            : item
        ),
      };
 
    // Archivar (activo = false) sin borrar
    case ACCIONES.ARCHIVAR:
      return {
        ...estado,
        items: estado.items.map((item) =>
          item.id === accion.payload.id
            ? { ...item, activo: false }
            : item
        ),
      };
 
    // Solo cambiar el campo "estado" del juego
    case ACCIONES.CAMBIAR_ESTADO:
      return {
        ...estado,
        items: estado.items.map((item) =>
          item.id === accion.payload.id
            ? { ...item, estado: accion.payload.nuevoEstado, fechaActividad: new Date().toISOString() }
            : item
        ),
      };
 
    // Actualizar uno o varios filtros a la vez
    case ACCIONES.FILTRAR:
      return {
        ...estado,
        filtros: { ...estado.filtros, ...accion.payload },
      };
 
    // Resetear todos los filtros
    case ACCIONES.LIMPIAR_FILTROS:
      return {
        ...estado,
        filtros: { categoria: '', estado: '', busqueda: '' },
      };
 
    // Agregar un registro de actividad diaria
    case ACCIONES.REGISTRAR_ACTIVIDAD: {
      const nuevoRegistro = accion.payload; // { id, itemId, fecha, valor, notas }
      return {
        ...estado,
        registros: [nuevoRegistro, ...estado.registros],
        // Actualizar fechaActividad del juego relacionado
        items: estado.items.map((item) =>
          item.id === nuevoRegistro.itemId
            ? { ...item, fechaActividad: nuevoRegistro.fecha }
            : item
        ),
      };
    }
 
    default:
      return estado;
  }
}