import { CommonModule } from '@angular/common';
import { Component, Input, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ApodItem } from '../../../../core/model/apod-item.model';
import { NasaService } from '../../../../core/services/nasa';
import { SpanishDatePipe } from '../../../../shared/pipes/spanish-date.pipe';

@Component({
  selector: 'app-dashboard-card',
  standalone: true,
  imports: [CommonModule, RouterLink, SpanishDatePipe],
  templateUrl: './dashboard-card.html',
  styleUrl: './dashboard-card.css',
})
export class DashboardCard {
  @Input() item!: ApodItem;
  private readonly nasaService = inject(NasaService);

  imageFailed = signal(false);

  handleImageError(): void {
    this.imageFailed.set(true);
  }
}
