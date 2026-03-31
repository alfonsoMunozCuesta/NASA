import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { ApodItem } from '../../../../core/model/apod-item.model';
import { NasaService } from '../../../../core/services/nasa';
import { DashboardCard } from '../../components/dashboard-card/dashboard-card';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, DashboardCard, FormsModule, TranslateModule],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css'
})
export class DashboardPage implements OnInit {
  private readonly nasaService = inject(NasaService);

  apods = signal<ApodItem[]>([]);
  loading = signal(true);
  errorMessage = signal('');
  searchText = signal('');

  // Signal computado que filtra los APODs según el texto de búsqueda
  filteredApods = computed(() => {
    const search = this.searchText().toLowerCase();
    if (!search) {
      return this.apods();
    }
    return this.apods().filter((apod) =>
      apod.title.toLowerCase().includes(search)
    );
  });

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
  } // Ordena los APODs por fecha descendente

  private sortByDateDesc(items: ApodItem[]): ApodItem[] {
    return [...items].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } // Método para actualizar los APODs, por ejemplo, después de eliminar un APOD
}