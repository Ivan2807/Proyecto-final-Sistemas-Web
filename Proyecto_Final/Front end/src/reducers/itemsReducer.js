export const initialState = {
  lista: [],
  filtroCategoria: 'todas',
  filtroEstado: 'todos',
  busqueda: '',
  historial: [],
}

export function itemsReducer(state, action) {
  switch (action.type) {
    case 'HIDRATAR':
      return {
        ...state,
        lista: Array.isArray(action.payload) ? action.payload : state.lista,
      }

    case 'AGREGAR':
      return {
        ...state,
        lista: [action.payload.item, ...state.lista],
        historial: [action.payload.registro, ...state.historial],
      }

    case 'ELIMINAR':
      return {
        ...state,
        lista: state.lista.map((item) =>
          item.id === action.payload.id
            ? { ...item, activo: false, fechaActividad: action.payload.fechaActividad }
            : item
        ),
        historial: [action.payload.registro, ...state.historial],
      }

    case 'CAMBIAR_ESTADO':
      return {
        ...state,
        lista: state.lista.map((item) =>
          item.id === action.payload.id
            ? { ...item, estado: action.payload.estado, fechaActividad: action.payload.fechaActividad }
            : item
        ),
        historial: [action.payload.registro, ...state.historial],
      }

    case 'FILTRAR':
      return {
        ...state,
        filtroCategoria: action.payload.categoria ?? state.filtroCategoria,
        filtroEstado: action.payload.estado ?? state.filtroEstado,
        busqueda: action.payload.busqueda ?? state.busqueda,
      }

    case 'LIMPIAR_FILTROS':
      return {
        ...state,
        filtroCategoria: 'todas',
        filtroEstado: 'todos',
        busqueda: '',
      }

    case 'REGISTRAR_ACTIVIDAD':
      return {
        ...state,
        historial: [action.payload, ...state.historial],
      }

    default:
      return state
  }
}
