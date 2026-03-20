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
    this.nasaService.getLastDaysApods(6).subscribe({
      next: (data) => {
        this.apods.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al cargar los datos');
        this.loading.set(false);
      }
    });
  }
}