import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

import { NasaService } from '../core/services/nasa';
import { ApodActions } from './apod.actions';

@Injectable()
export class ApodEffects {
  private readonly actions$ = inject(Actions);
  private readonly nasaService = inject(NasaService);

  cargarDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApodActions.cargarDashboard),
      switchMap(({ count }) =>
        this.nasaService.getLastImageApods(count ?? 6).pipe(
          map((apods) => ApodActions.cargarDashboardExito({ apods })),
          catchError(() =>
            of(ApodActions.cargarDashboardError({ error: 'Error al cargar el dashboard' }))
          )
        )
      )
    )
  );

  cargarDetalle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApodActions.cargarDetalle),
      switchMap(({ date }) =>
        this.nasaService.getApodByDate(date).pipe(
          map((apod) => ApodActions.cargarDetalleExito({ apod })),
          catchError(() =>
            of(ApodActions.cargarDetalleError({ error: 'Error al cargar el detalle' }))
          )
        )
      )
    )
  );
}
