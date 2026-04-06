import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { ApodActions } from '../../../../state/apod.actions';
import {
  selectDashboardError,
  selectDashboardLoading,
  selectFilteredApods,
  selectSearchText
} from '../../../../state/apod.selectors';
import { DashboardCard } from '../../components/dashboard-card/dashboard-card';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, DashboardCard, TranslateModule],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css'
})
export class DashboardPage implements OnInit {
  private readonly store = inject(Store);

  protected readonly apods = this.store.selectSignal(selectFilteredApods);
  protected readonly loading = this.store.selectSignal(selectDashboardLoading);
  protected readonly errorMessage = this.store.selectSignal(selectDashboardError);
  protected readonly searchText = this.store.selectSignal(selectSearchText);

  ngOnInit(): void {
    this.store.dispatch(ApodActions.cargarDashboard({ count: 6 }));
  }

  onSearchTextChange(searchText: string): void {
    this.store.dispatch(ApodActions.cambiarBusqueda({ searchText }));
  }
}