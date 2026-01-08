import { Routes } from '@angular/router';

export const IMP_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./imp-shell.page').then((m) => m.ImpShellPage),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'summary' },

      {
        path: 'summary',
        loadComponent: () =>
          import('./imp-summary.step').then((m) => m.ImpSummaryStep),
      },
      {
        path: 'implementation',
        loadComponent: () =>
          import('./imp-implementation.step').then((m) => m.ImpImplementationStep),
      },
      {
        path: 'staffing',
        loadComponent: () =>
          import('./imp-staffing.step').then((m) => m.ImpStaffingStep),
      },
      {
        path: 'documents',
        loadComponent: () =>
          import('./imp-documents.step').then((m) => m.ImpDocumentsStep),
      },
    ],
  },
];
