import { Routes } from '@angular/router';

export const PROVIDERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./providers/pages/providers.page').then((m) => m.ProvidersPage),
  },
];