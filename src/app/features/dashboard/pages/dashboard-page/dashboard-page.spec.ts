import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { provideTranslateService } from '@ngx-translate/core';

import { ApodItem } from '../../../../core/model/apod-item.model';
import { ApodActions } from '../../../../state/apod.actions';
import {
  selectDashboardError,
  selectDashboardLoading,
  selectFilteredApods,
  selectSearchText
} from '../../../../state/apod.selectors';import { DashboardPage } from './dashboard-page';

describe('DashboardPage', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;
  let dispatchCalls: unknown[];

  const sampleApod: ApodItem = {
    date: '2024-01-03',
    title: 'Moon mission',
    url: 'https://example.com/moon.jpg',
    explanation: 'The moon mission explanation',
    media_type: 'image'
  };

  const filteredApodsSignal = signal<ApodItem[]>([sampleApod]);
  const loadingSignal = signal(false);
  const errorSignal = signal<string | null>(null);
  const searchTextSignal = signal('');

  const storeMock = {
    selectSignal: (selector: unknown) => {
      if (selector === selectFilteredApods) {
        return filteredApodsSignal;
      }

      if (selector === selectDashboardLoading) {
        return loadingSignal;
      }

      if (selector === selectDashboardError) {
        return errorSignal;
      }

      if (selector === selectSearchText) {
        return searchTextSignal;
      }

      return signal(undefined);
    },
    dispatch: (action: unknown) => {
      dispatchCalls.push(action);
    }
  };

  beforeEach(async () => {
    dispatchCalls = [];

    await TestBed.configureTestingModule({
      imports: [DashboardPage, RouterTestingModule],
      providers: [
        provideTranslateService({
          fallbackLang: 'en',
          lang: 'en'
        }),
        {
          provide: Store,
          useValue: storeMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  }); 

  it('debería despachar la carga del dashboard al iniciar', () => {
    expect(dispatchCalls).toContainEqual(ApodActions.cargarDashboard({ count: 6 }));
  });

  it('debería despachar los cambios de búsqueda', () => {
    component.onSearchTextChange('moon');

    expect(dispatchCalls).toContainEqual(ApodActions.cambiarBusqueda({ searchText: 'moon' }));
  });

  it('debería renderizar la lista filtrada de APODs', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelectorAll('app-dashboard-card').length).toBe(1);
    expect(compiled.textContent).toContain('Moon mission');
  }); 
});
