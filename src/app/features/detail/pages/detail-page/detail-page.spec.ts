import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { provideTranslateService } from '@ngx-translate/core';

import { ApodItem } from '../../../../core/model/apod-item.model';
import { ApodActions } from '../../../../state/apod.actions';
import {
  selectDetailError,
  selectDetailLoading,
  selectSelectedApod
} from '../../../../state/apod.selectors';
import { DetailPage } from './detail-page';

describe('DetailPage', () => {
  let component: DetailPage;
  let fixture: ComponentFixture<DetailPage>;
  let dispatchCalls: unknown[];
  let backCalls = 0;

  const sampleApod: ApodItem = {
    date: '2024-01-03',
    title: 'Moon mission detail',
    url: 'https://example.com/moon-detail.jpg',
    explanation: 'Detail explanation',
    media_type: 'image'
  };

  const selectedApodSignal = signal<ApodItem | null>(sampleApod);
  const loadingSignal = signal(false);
  const errorSignal = signal<string | null>(null);

  const storeMock = {
    selectSignal: (selector: unknown) => {
      if (selector === selectSelectedApod) {
        return selectedApodSignal;
      }

      if (selector === selectDetailLoading) {
        return loadingSignal;
      }

      if (selector === selectDetailError) {
        return errorSignal;
      }

      return signal(undefined);
    },
    dispatch: (action: unknown) => {
      dispatchCalls.push(action);
    }
  };

  const routeMock = {
    snapshot: {
      paramMap: {
        get: () => '2024-01-03'
      }
    }
  };

  const locationMock = {
    back: () => {
      backCalls += 1;
    }
  };

  beforeEach(async () => {
    dispatchCalls = [];
    backCalls = 0;

    await TestBed.configureTestingModule({
      imports: [DetailPage],
      providers: [
        provideTranslateService({
          fallbackLang: 'en',
          lang: 'en'
        }),
        {
          provide: Store,
          useValue: storeMock
        },
        {
          provide: ActivatedRoute,
          useValue: routeMock
        },
        {
          provide: Location,
          useValue: locationMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería despachar la carga del detalle al iniciar', () => {
    expect(dispatchCalls).toContainEqual(ApodActions.cargarDetalle({ date: '2024-01-03' }));
  });

  it('debería volver atrás usando Location', () => {
    component.goBack();

    expect(backCalls).toBe(1);
  });

  it('debería marcar el fallo de la imagen', () => {
    expect(component.imageFailed()).toBe(false);

    component.handleDetailImageError();

    expect(component.imageFailed()).toBe(true);
  });

  it('debería renderizar el detalle del APOD', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Moon mission detail');
    expect(compiled.textContent).toContain('Detail explanation');
  });
});
