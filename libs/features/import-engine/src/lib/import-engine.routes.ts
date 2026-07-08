import { Routes } from '@angular/router';

export const importEngineRoutes: Routes = [
  // Agency Setup
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/agency-creation/agency-creation.component').then(
        (m) => m.AgencyCreationComponent,
      ),
  },

  // Workflow
  {
    path: 'csv-import',
    loadComponent: () =>
      import('./components/csv-import-wizard/csv-import-wizard.component').then(
        (m) => m.CsvImportWizardComponent,
      ),
  },
  {
    path: 'validation',
    loadComponent: () =>
      import('./components/import-validation/import-validation.component').then(
        (m) => m.ImportValidationComponent,
      ),
  },
  {
    path: 'review',
    loadComponent: () =>
      import('./pages/review/review.component').then(
        (m) => m.ReviewComponent,
      ),
  },
  {
    path: 'build',
    loadComponent: () =>
      import('./pages/build/build.component').then(
        (m) => m.BuildComponent,
      ),
  },
  {
    path: 'complete',
    loadComponent: () =>
      import('./pages/complete/complete.component').then(
        (m) => m.CompleteComponent,
      ),
  },

  // Fallback
  {
    path: '**',
    redirectTo: '',
  },
];