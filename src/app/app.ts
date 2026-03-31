import { Component, OnInit, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LayoutComponent } from './shared/layout/layout';

@Component({
  selector: 'app-root',
  imports: [LayoutComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly translate = inject(TranslateService);

  ngOnInit(): void {
    this.translate.use('es');
  }
}

