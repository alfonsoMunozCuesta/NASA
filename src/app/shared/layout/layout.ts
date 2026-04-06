import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { ApodActions } from '../../state/apod.actions';
import { selectLanguage } from '../../state/apod.selectors';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, TranslateModule],
  templateUrl: './layout.html', 
  styleUrl: './layout.css'
})
export class LayoutComponent implements OnInit {
  private readonly translate = inject(TranslateService);
  private readonly store = inject(Store);
  protected readonly currentLanguage = this.store.selectSignal(selectLanguage);

  ngOnInit(): void {
    const initialLanguage = (this.translate.currentLang as 'es' | 'en') || 'es';
    this.translate.use(initialLanguage).subscribe();
  }

  toggleLanguage(): void {
    const newLang = (this.currentLanguage() === 'es' ? 'en' : 'es') as 'es' | 'en';
    this.translate.use(newLang).subscribe();
    this.store.dispatch(ApodActions.cambiarIdioma({ language: newLang }));
  }
}
