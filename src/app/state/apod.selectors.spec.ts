import { apodFeatureKey, ApodState, initialApodState } from './apod.state';
import {
  selectApodState,
  selectApods,
  selectDashboardError,
  selectDashboardLoading,
  selectDetailError,
  selectDetailLoading,
  selectFilteredApods,
  selectHasSelection,
  selectLanguage,
  selectLoading,
  selectSearchText,
  selectSelectedApod,
  selectSelectedDate
} from './apod.selectors';
import { ApodItem } from '../core/model/apod-item.model';

describe('apodSelectors', () => {
  const selectedApod: ApodItem = {
    date: '2024-01-03',
    title: 'Moon landing',
    url: 'https://example.com/selected.jpg',
    explanation: 'The moon landing explanation',
    media_type: 'image'
  };

  const firstApod: ApodItem = {
    date: '2024-01-01',
    title: 'Sun rise',
    url: 'https://example.com/1.jpg',
    explanation: 'Blue sky and sunrise',
    media_type: 'image'
  };

  const secondApod: ApodItem = {
    date: '2024-01-02',
    title: 'Space walk',
    url: 'https://example.com/2.jpg',
    explanation: 'Astronaut on the moon',
    media_type: 'image'
  };

  const state: ApodState = {
    ...initialApodState,
    apods: [firstApod, secondApod],
    selectedApod,
    dashboardLoading: true,
    dashboardError: 'Dashboard error',
    detailLoading: false,
    detailError: 'Detail error',
    searchText: 'moon',
    language: 'en',
    selectedDate: '2024-01-03'
  };

  const rootState = {
    [apodFeatureKey]: state
  };

  it('debería seleccionar el estado de la feature', () => {
    expect(selectApodState(rootState as any)).toBe(state);
  });

  it('debería seleccionar la lista de APODs', () => {
    expect(selectApods(rootState as any)).toEqual([firstApod, secondApod]);
  });

  it('debería seleccionar el APOD actual y sus banderas derivadas', () => {
    expect(selectSelectedApod(rootState as any)).toBe(selectedApod);
    expect(selectHasSelection(rootState as any)).toBe(true);
    expect(selectSelectedDate(rootState as any)).toBe('2024-01-03');
  });

  it('debería seleccionar los estados de carga y error', () => {
    expect(selectLoading(rootState as any)).toBe(true);
    expect(selectDashboardLoading(rootState as any)).toBe(true);
    expect(selectDashboardError(rootState as any)).toBe('Dashboard error');
    expect(selectDetailLoading(rootState as any)).toBe(false);
    expect(selectDetailError(rootState as any)).toBe('Detail error');
  });

  it('debería seleccionar el texto de búsqueda y el idioma', () => {
    expect(selectSearchText(rootState as any)).toBe('moon');
    expect(selectLanguage(rootState as any)).toBe('en');
  });

  it('debería filtrar los APODs por el texto de búsqueda', () => {
    expect(selectFilteredApods(rootState as any)).toEqual([secondApod]);

    const emptySearchState = {
      ...state,
      searchText: ''
    };
    const emptySearchRootState = {
      [apodFeatureKey]: emptySearchState
    };

    expect(selectFilteredApods(emptySearchRootState as any)).toEqual([firstApod, secondApod]);
  });
});
