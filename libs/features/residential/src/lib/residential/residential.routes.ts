import { Routes } from '@angular/router';

export const RESIDENTIAL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/residential-locations.page').then((m) => m.ResidentialLocationsPage),
  },
];