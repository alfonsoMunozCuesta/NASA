import { CommonModule, Location } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { ApodActions } from '../../../../state/apod.actions';
import {
  selectDetailError,
  selectDetailLoading,
  selectSelectedApod
} from '../../../../state/apod.selectors';
import { SpanishDatePipe } from '../../../../shared/pipes/spanish-date.pipe';

@Component({
  selector: 'app-detail-page',
  standalone: true,
  imports: [CommonModule, SpanishDatePipe, TranslateModule],
  templateUrl: './detail-page.html',
  styleUrl: './detail-page.css'
})
export class DetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);
  private readonly location = inject(Location);
  
  protected readonly apod = this.store.selectSignal(selectSelectedApod);
  protected readonly loading = this.store.selectSignal(selectDetailLoading);
  protected readonly errorMessage = this.store.selectSignal(selectDetailError);
  imageFailed = signal(false);

  ngOnInit(): void {
    const date = this.route.snapshot.paramMap.get('date');

    if (!date) {
      this.store.dispatch(
        ApodActions.cargarDetalleError({ error: 'No se ha recibido ninguna fecha' })
      );
      return;
    }

    this.store.dispatch(ApodActions.cargarDetalle({ date }));
  }

  goBack(): void {
    this.location.back();
  }

  handleDetailImageError(): void {
    this.imageFailed.set(true);
  }
}
