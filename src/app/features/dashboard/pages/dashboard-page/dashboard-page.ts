import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ApodItem } from '../../../../core/model/apod-item.model';
import { NasaService } from '../../../../core/services/nasa';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css'
})
export class DashboardPage implements OnInit {
  private readonly nasaService = inject(NasaService);

  apods = signal<ApodItem[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  ngOnInit(): void {
    this.nasaService.getLastImageApods(6).subscribe({
      next: (data) => {
        this.apods.set(this.sortByDateDesc(data));
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al cargar los datos');
        this.loading.set(false);
      }
    });
  }

  handleImageError(item: ApodItem): void {
    const currentDates = this.apods().map((apod) => apod.date);

    this.nasaService.getReplacementImage(currentDates).subscribe({
      next: (replacement) => {
        this.apods.update((items) =>
          this.sortByDateDesc(
            items.map((apod) =>
              apod.date === item.date ? replacement : apod
            )
          )
        );
      },
      error: () => {
        this.apods.update((items) =>
          items.filter((apod) => apod.date !== item.date)
        );
      }
    });
  }

  private sortByDateDesc(items: ApodItem[]): ApodItem[] {
    return [...items].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }
}