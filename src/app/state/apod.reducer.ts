import { createReducer, on } from '@ngrx/store';

import { ApodItem } from '../core/model/apod-item.model';
import { ApodActions } from './apod.actions';
import { initialApodState } from './apod.state';

function sortByDateDesc(apods: ApodItem[]): ApodItem[] {
  return [...apods].sort(
    (left, right) => new Date(right.date).getTime() - new Date(left.date).getTime()
  );
}

export const apodReducer = createReducer(
  initialApodState,
  on(ApodActions.cargarDashboard, (state) => ({
    ...state,
    dashboardLoading: true,
    dashboardError: null
  })), // Detalle y búsqueda no afectan el estado de carga o error del dashboard
  on(ApodActions.cargarDashboardExito, (state, { apods }) => ({
    ...state,
    dashboardLoading: false,
    apods: sortByDateDesc(apods),
    dashboardError: null
  })), //
  on(ApodActions.cargarDashboardError, (state, { error }) => ({
    ...state,
    dashboardLoading: false,
    dashboardError: error
  })), // Cargar detalle no afecta el estado de carga o error del dashboard
  on(ApodActions.cargarDetalle, (state, { date }) => ({
    ...state,
    detailLoading: true,
    detailError: null,
    selectedDate: date
  })), // Cargar dashboard no afecta el estado de carga o error del detalle
  on(ApodActions.cargarDetalleExito, (state, { apod }) => ({
    ...state,
    detailLoading: false,
    selectedApod: apod,
    selectedDate: apod.date,
    detailError: null
  })), // Cargar dashboard no afecta el estado de carga o error del detalle
  on(ApodActions.cargarDetalleError, (state, { error }) => ({
    ...state,
    detailLoading: false,
    detailError: error
  })),// Cambios de búsqueda e idioma no afectan el estado de carga o error
  on(ApodActions.cambiarBusqueda, (state, { searchText }) => ({
    ...state,
    searchText
  })), // Cambios de idioma no afectan el estado de carga o error
  on(ApodActions.cambiarIdioma, (state, { language }) => ({
    ...state,
    language
  })) // Cambios de idioma no afectan el estado de carga o error
); 
