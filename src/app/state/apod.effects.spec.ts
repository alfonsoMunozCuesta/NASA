import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { firstValueFrom, Observable, of, Subject, take, throwError } from 'rxjs';

import { ApodItem } from '../core/model/apod-item.model';
import { NasaService } from '../core/services/nasa';
import { ApodActions } from './apod.actions';
import { ApodEffects } from './apod.effects';

describe('ApodEffects', () => {
  let actions$: Subject<Action>;
  let effects: ApodEffects;
  let nasaServiceMock: {
    getLastImageApods: (count: number) => Observable<ApodItem[]>;
    getApodByDate: (date: string) => Observable<ApodItem>;
  };

  const sampleApods: ApodItem[] = [
    {
      date: '2024-01-01',
      title: 'First',
      url: 'https://example.com/1.jpg',
      explanation: 'First explanation',
      media_type: 'image'
    },
    {
      date: '2024-01-02',
      title: 'Second',
      url: 'https://example.com/2.jpg',
      explanation: 'Second explanation',
      media_type: 'image'
    }
  ];

  const sampleApod: ApodItem = {
    date: '2024-01-03',
    title: 'Detail',
    url: 'https://example.com/detail.jpg',
    explanation: 'Detail explanation',
    media_type: 'image'
  };

  beforeEach(() => {
    actions$ = new Subject<Action>();
    nasaServiceMock = {
      getLastImageApods: () => of(sampleApods),
      getApodByDate: () => of(sampleApod)
    };

    TestBed.configureTestingModule({
      providers: [
        ApodEffects,
        {
          provide: Actions,
          useFactory: () => new Actions(actions$)
        },
        {
          provide: NasaService,
          useValue: nasaServiceMock
        }
      ]
    });

    effects = TestBed.inject(ApodEffects);
  });

  it('debería mapear correctamente la carga exitosa del dashboard', async () => {
    nasaServiceMock.getLastImageApods = (count: number) => {
      expect(count).toBe(4);
      return of(sampleApods);
    };

    const resultPromise = firstValueFrom(effects.cargarDashboard$.pipe(take(1)));
    actions$.next(ApodActions.cargarDashboard({ count: 4 }));

    await expect(resultPromise).resolves.toEqual(
      ApodActions.cargarDashboardExito({ apods: sampleApods })
    );
  });

  it('debería mapear correctamente el error de carga del dashboard', async () => {
    nasaServiceMock.getLastImageApods = () => throwError(() => new Error('boom'));

    const resultPromise = firstValueFrom(effects.cargarDashboard$.pipe(take(1)));
    actions$.next(ApodActions.cargarDashboard({ count: 4 }));

    await expect(resultPromise).resolves.toEqual(
      ApodActions.cargarDashboardError({ error: 'Error al cargar el dashboard' })
    );
  });

  it('debería mapear correctamente la carga exitosa del detalle', async () => {
    nasaServiceMock.getApodByDate = (date: string) => {
      expect(date).toBe('2024-01-03');
      return of(sampleApod);
    };

    const resultPromise = firstValueFrom(effects.cargarDetalle$.pipe(take(1)));
    actions$.next(ApodActions.cargarDetalle({ date: '2024-01-03' }));

    await expect(resultPromise).resolves.toEqual(
      ApodActions.cargarDetalleExito({ apod: sampleApod })
    );
  });

  it('debería mapear correctamente el error de carga del detalle', async () => {
    nasaServiceMock.getApodByDate = () => throwError(() => new Error('boom'));

    const resultPromise = firstValueFrom(effects.cargarDetalle$.pipe(take(1)));
    actions$.next(ApodActions.cargarDetalle({ date: '2024-01-03' }));

    await expect(resultPromise).resolves.toEqual(
      ApodActions.cargarDetalleError({ error: 'Error al cargar el detalle' })
    );
  });
});
