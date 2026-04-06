import { ApodItem } from '../core/model/apod-item.model';

export const apodFeatureKey = 'apod';

export interface ApodState {
  apods: ApodItem[];
  selectedApod: ApodItem | null;
  dashboardLoading: boolean;
  dashboardError: string | null;
  detailLoading: boolean;
  detailError: string | null;
  searchText: string;
  language: string;
  selectedDate: string | null;
}

export const initialApodState: ApodState = {
  apods: [] as ApodItem[],
  selectedApod: null,
  dashboardLoading: false,
  dashboardError: null,
  detailLoading: false,
  detailError: null,
  searchText: '',
  language: 'es',
  selectedDate: null
};
