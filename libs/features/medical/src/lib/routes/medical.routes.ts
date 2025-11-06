import { Routes } from '@angular/router';

export const MEDICAL_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'nursing',
  },
  {
    path: 'nursing',
    loadComponent: () =>
      import('../pages/nursing/nursing.page').then(m => m.NursingPage),
    // canMatch: [raciGuard('medical')] // if you’re using your RACI guard
  },
  {
    path: 'med-admin',
    loadComponent: () =>
      import('../pages/med-admin/med-admin.page').then(m => m.MedAdminPage),
  },
];
