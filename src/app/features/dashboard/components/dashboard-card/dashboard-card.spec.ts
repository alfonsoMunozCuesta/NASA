import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ApodItem } from '../../../../core/model/apod-item.model';
import { DashboardCard } from './dashboard-card';

describe('DashboardCard', () => {
  let component: DashboardCard;
  let fixture: ComponentFixture<DashboardCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCard, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardCard);
    component = fixture.componentInstance;
    component.item = {
      date: '2024-01-01',
      title: 'Test APOD',
      url: 'https://example.com/image.jpg',
      explanation: 'Test explanation',
      media_type: 'image'
    } satisfies ApodItem;

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería renderizar el título de la tarjeta', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Test APOD');
  });
});
