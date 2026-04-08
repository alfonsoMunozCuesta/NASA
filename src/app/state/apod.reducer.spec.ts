import { apodReducer } from './apod.reducer';
import { ApodActions } from './apod.actions';
import { apodFeatureKey, initialApodState } from './apod.state';
import { ApodItem } from '../core/model/apod-item.model';

describe('apodReducer', () => {
  const firstApod: ApodItem = {
    date: '2024-01-01',
    title: 'First',
    url: 'https://example.com/1.jpg',
    explanation: 'First explanation',
    media_type: 'image'
  };

  const secondApod: ApodItem = {
    date: '2024-01-03',
    title: 'Second',
    url: 'https://example.com/2.jpg',
    explanation: 'Second explanation',
    media_type: 'image'
  };

  const thirdApod: ApodItem = {
    date: '2024-01-02',
    title: 'Third',
    url: 'https://example.com/3.jpg',
    explanation: 'Third explanation',
    media_type: 'image'
  };

  it('debería devolver el estado inicial', () => {
    expect(apodReducer(undefined, { type: '[Unknown] Action' })).toEqual(initialApodState);
  });

  it('debería iniciar la carga del dashboard', () => {
    const state = apodReducer(initialApodState, ApodActions.cargarDashboard({ count: 6 }));

    expect(state.dashboardLoading).toBe(true);
    expect(state.dashboardError).toBeNull();
  });

  it('debería guardar los resultados del dashboard ordenados por fecha descendente', () => {
    const state = apodReducer(
      initialApodState,
      ApodActions.cargarDashboardExito({ apods: [firstApod, secondApod, thirdApod] })
    );

    expect(state.apods).toEqual([secondApod, thirdApod, firstApod]);
    expect(state.dashboardLoading).toBe(false);
    expect(state.dashboardError).toBeNull();
  });

  it('debería guardar el error del dashboard', () => {
    const state = apodReducer(
      initialApodState,
      ApodActions.cargarDashboardError({ error: 'Dashboard failed' })
    );

    expect(state.dashboardLoading).toBe(false);
    expect(state.dashboardError).toBe('Dashboard failed');
  });

  it('debería iniciar la carga del detalle y mantener la fecha seleccionada', () => {
    const state = apodReducer(initialApodState, ApodActions.cargarDetalle({ date: '2024-01-02' }));

    expect(state.detailLoading).toBe(true);
    expect(state.detailError).toBeNull();
    expect(state.selectedDate).toBe('2024-01-02');
  });

  it('debería guardar el detalle correctamente', () => {
    const state = apodReducer(initialApodState, ApodActions.cargarDetalleExito({ apod: secondApod }));

    expect(state.detailLoading).toBe(false);
    expect(state.detailError).toBeNull();
    expect(state.selectedApod).toBe(secondApod);
    expect(state.selectedDate).toBe('2024-01-03');
  });

  it('debería guardar el error del detalle', () => {
    const state = apodReducer(
      initialApodState,
      ApodActions.cargarDetalleError({ error: 'Detail failed' })
    );

    expect(state.detailLoading).toBe(false);
    expect(state.detailError).toBe('Detail failed');
  });

  it('debería actualizar el texto de búsqueda', () => {
    const state = apodReducer(initialApodState, ApodActions.cambiarBusqueda({ searchText: 'moon' }));

    expect(state.searchText).toBe('moon');
  });

  it('debería actualizar el idioma', () => {
    const state = apodReducer(initialApodState, ApodActions.cambiarIdioma({ language: 'en' }));

    expect(state.language).toBe('en');
  });
});
