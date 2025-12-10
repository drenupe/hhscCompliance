// libs/features/iss/src/lib/iss.routes.ts (where ISS_ROUTES lives)

import { Routes } from '@angular/router';

export const ISS_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },

  {
    path: 'home',
    loadComponent: () =>
      import('./pages/iss-home/iss-home.page').then(
        (m) => m.IssHomePage
      ),
  },

  // Year-at-a-glance for one consumer
  {
    path: 'provider/:providerId/consumer/:consumerId/year',
    loadComponent: () =>
      import('./pages/iss-consumer-year/iss-consumer-year.page').then(
        (m) => m.IssConsumerYearPageComponent
      ),
  },

  // ✅ NEW: print-friendly year summary
  {
    path: 'provider/:providerId/consumer/:consumerId/year/print',
    loadComponent: () =>
      import(
        './pages/iss-consumer-year-print/iss-consumer-year-print.page'
      ).then((m) => m.IssConsumerYearPrintPageComponent),
  },

  // Week (8615) for one consumer / date
  {
    path: 'provider/:providerId/consumer/:consumerId/week/:serviceDate',
    loadComponent: () =>
      import('./pages/iss-week/iss-week.page').then(
        (m) => m.IssWeekPageComponent
      ),
  },
];
