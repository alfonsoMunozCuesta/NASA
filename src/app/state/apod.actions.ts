import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { ApodItem } from '../core/model/apod-item.model';

export const ApodActions = createActionGroup({
  source: 'Apod',
  events: {
    'Cargar Dashboard': props<{ count?: number }>(),
    'Cargar Dashboard Exito': props<{ apods: ApodItem[] }>(),
    'Cargar Dashboard Error': props<{ error: string }>(),
    'Cargar Detalle': props<{ date: string }>(),
    'Cargar Detalle Exito': props<{ apod: ApodItem }>(),
    'Cargar Detalle Error': props<{ error: string }>(),
    'Cambiar Busqueda': props<{ searchText: string }>(),
    'Cambiar Idioma': props<{ language: string }>()
  }
});
