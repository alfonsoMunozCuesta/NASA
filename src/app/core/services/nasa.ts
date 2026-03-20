import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
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
  } // hace una peticion para un dia concreto

  getLastDaysApods(days: number = 6): Observable<ApodItem[]> {
    const dates = this.getLastNDates(days);
    const requests = dates.map((date) => this.getApodByDate(date));
    return forkJoin(requests);
  } // Obtiene los datos de los últimos 6 días, genera 6 fechas

  private getLastNDates(days: number): string[] {
    const dates: string[] = [];

    for (let i = 1; i <= days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(this.formatDate(date));
    }

    return dates;
  } // Genera un array de fechas en formato 'YYYY-MM-DD' para los últimos N días

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
} // convierte la fecha a formato