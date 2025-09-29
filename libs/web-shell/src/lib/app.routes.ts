import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@hhsc-compliance/home').then(m => m.Home),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('@hhsc-compliance/dashboard').then(m => m.Dashboard),
  },
  { path: '**', redirectTo: '' },
];
