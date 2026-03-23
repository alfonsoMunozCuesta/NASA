import { CommonModule, Location } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { ApodItem } from '../../../../core/model/apod-item.model';
import { NasaService } from '../../../../core/services/nasa';

@Component({
  selector: 'app-detail-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-page.html',
  styleUrl: './detail-page.css'
})
export class DetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly nasaService = inject(NasaService);
  private readonly location = inject(Location);
  private readonly sanitizer = inject(DomSanitizer);

  apod = signal<ApodItem | null>(null);
  loading = signal(true);
  errorMessage = signal('');
  imageFailed = signal(false);

  ngOnInit(): void {
    const date = this.route.snapshot.paramMap.get('date');

    if (!date) {
      this.errorMessage.set('No se ha recibido ninguna fecha');
      this.loading.set(false);
      return;
    }

    this.nasaService.getApodByDate(date).subscribe({
      next: (data) => {
        this.apod.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al cargar el detalle');
        this.loading.set(false);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  handleDetailImageError(): void {
    this.imageFailed.set(true);
  }

  safeVideoUrl(): SafeResourceUrl | null {
    const url = this.apod()?.url;

    if (!url) {
      return null;
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
