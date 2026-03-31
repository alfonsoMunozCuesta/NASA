import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'spanishDate',
  standalone: true
})
export class SpanishDatePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    // Espera formato yyyy-mm-dd y lo convierte a dd/mm/yyyy
    const parts = value.split('-');
    if (parts.length !== 3) {
      return value;
    }

    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }
}
