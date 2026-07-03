import { Routes } from '@angular/router';

export const publicRoutes: Routes = [
  {
    path: 'provider-onboarding',
    loadChildren: () =>
      import('@hhsc-compliance/provider-onboarding').then(
        (m) => m.providerOnboardingRoutes,
      ),
  },
  
  {
    path: 'provider-onboarding/agency-creation/csv-import',
    loadComponent: () =>
      import('@hhsc-compliance/import-engine').then(
        (m) => m.CsvImportWizardComponent,
      ),
  },
];