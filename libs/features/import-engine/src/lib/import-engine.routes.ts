import { Routes } from '@angular/router';

export const importEngineRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/agency-creation/agency-creation.component').then(
        (m) => m.AgencyCreationComponent,
      ),
  },
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
];