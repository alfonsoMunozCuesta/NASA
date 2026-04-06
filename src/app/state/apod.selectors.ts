import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ApodItem } from '../core/model/apod-item.model';
import { ApodState, apodFeatureKey } from './apod.state';

export const selectApodState = createFeatureSelector<ApodState>(apodFeatureKey);

export const selectApods = createSelector(
  selectApodState,
  (state) => state.apods
);

export const selectSelectedApod = createSelector(
  selectApodState,
  (state) => state.selectedApod
);

export const selectLoading = createSelector(
  selectApodState,
  (state) => state.dashboardLoading || state.detailLoading
);

export const selectDashboardLoading = createSelector(
  selectApodState,
  (state) => state.dashboardLoading
);

export const selectDetailLoading = createSelector(
  selectApodState,
  (state) => state.detailLoading
);

export const selectDashboardError = createSelector(
  selectApodState,
  (state) => state.dashboardError
);

export const selectDetailError = createSelector(
  selectApodState,
  (state) => state.detailError
);

export const selectSearchText = createSelector(
  selectApodState,
  (state) => state.searchText
);

export const selectSelectedDate = createSelector(
  selectApodState,
  (state) => state.selectedDate
);

export const selectLanguage = createSelector(
  selectApodState,
  (state) => state.language
);

export const selectHasSelection = createSelector(
  selectSelectedApod,
  (selectedApod) => selectedApod !== null
);

export const selectFilteredApods = createSelector(
  selectApods,
  selectSearchText,
  (apods: ApodItem[], searchText: string) => {
    const normalizedSearch = searchText.trim().toLowerCase();

    if (!normalizedSearch) {
      return apods;
    }

    return apods.filter(
      (apod) =>
        apod.title.toLowerCase().includes(normalizedSearch) ||
        apod.explanation.toLowerCase().includes(normalizedSearch)
    );
  }
);
