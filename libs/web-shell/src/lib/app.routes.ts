import { Routes } from '@angular/router';

import { publicRoutes } from './public.routes';
import { operationsRoutes } from './operations.routes';

export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'provider-onboarding',
  },

  ...publicRoutes,
  ...operationsRoutes,

  {
    path: '**',
    redirectTo: 'provider-onboarding',
  },
];