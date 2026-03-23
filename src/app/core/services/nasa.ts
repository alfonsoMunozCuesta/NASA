import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApodItem } from '../model/apod-item.model';

@Injectable({
  providedIn: 'root'
})
export class NasaService {
  private readonly apiUrl = 'https://api.nasa.gov/planetary/apod';
  private readonly apiKey = 'zdUP8ElJv1cehFM0rsZVSQN7uBVxlDnu4diHlLSb';

  constructor(private http: HttpClient) {}

  getApodByDate(date: string): Observable<ApodItem> {
    return this.http.get<ApodItem>(
      `${this.apiUrl}?api_key=${this.apiKey}&date=${date}`
    );
  }

  // Devuelve solo imágenes, nunca vídeos
  getLastImageApods(count: number = 6): Observable<ApodItem[]> {
    return new Observable<ApodItem[]>((observer) => {
      const results: ApodItem[] = [];

      const fetchNext = (daysBack: number) => {
        const date = this.formatDate(this.subtractDays(new Date(), daysBack));

        this.getApodByDate(date).subscribe({
          next: (data) => {
            if (data.media_type === 'image') {
              results.push(data);
            }

            if (results.length === count) {
              observer.next(results);
              observer.complete();
            } else {
              fetchNext(daysBack + 1);
            }
          },
          error: () => {
            // Si falla una fecha, seguir con la siguiente
            fetchNext(daysBack + 1);
          }
        });
      };

      fetchNext(1);
    });
  }

  // Busca una imagen válida más antigua que NO esté ya en pantalla
  getReplacementImage(excludedDates: string[]): Observable<ApodItem> {
    return new Observable<ApodItem>((observer) => {
      const fetchNext = (daysBack: number) => {
        const date = this.formatDate(this.subtractDays(new Date(), daysBack));

        this.getApodByDate(date).subscribe({
          next: (data) => {
            const isImage = data.media_type === 'image';
            const isExcluded = excludedDates.includes(data.date);

            if (isImage && !isExcluded) {
              observer.next(data);
              observer.complete();
            } else {
              fetchNext(daysBack + 1);
            }
          },
          error: () => {
            // Si falla una fecha, seguir con la siguiente
            fetchNext(daysBack + 1);
          }
        });
      };

      fetchNext(1);
    });
  }

  private subtractDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
