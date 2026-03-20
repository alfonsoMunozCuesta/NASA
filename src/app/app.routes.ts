import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }, // Redirige la ruta raíz a 'dashboard'
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/pages/dashboard-page/dashboard-page')
        .then((m) => m.DashboardPage)
  },// Ruta para la página principal del dashboard
  {
    path: 'detail/:date',
    loadComponent: () =>
      import('./features/detail/pages/detail-page/detail-page')
        .then((m) => m.DetailPage)
  }, // Ruta para la página de detalle, con un parámetro de fecha
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];