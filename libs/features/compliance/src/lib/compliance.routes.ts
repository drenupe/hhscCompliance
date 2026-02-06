import { Routes } from '@angular/router';

export const COMPLIANCE_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'message-center' },

  {
    path: 'message-center',
    loadComponent: () =>
      import('./pages/compliance-message-center.page').then(
        (m) => m.ComplianceMessageCenterPage,
      ),
  },

  // later:
  // { path: 'results', loadComponent: () => import('./pages/location-compliance-results.page').then(m => m.LocationComplianceResultsPage) },
];
