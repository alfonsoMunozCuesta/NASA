import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, TranslateModule],
  templateUrl: './layout.html', 
  styleUrl: './layout.css'
})
export class LayoutComponent implements OnInit {
  private readonly translate = inject(TranslateService);
  protected currentLanguage = signal<'es' | 'en'>('es');

  ngOnInit(): void {
    // Detectar idioma actual
    this.currentLanguage.set(this.translate.currentLang as 'es' | 'en' || 'es');
  }

  toggleLanguage(): void {
    const newLang = this.currentLanguage() === 'es' ? 'en' : 'es';
    this.translate.use(newLang).subscribe();
    this.currentLanguage.set(newLang);
  }
}
