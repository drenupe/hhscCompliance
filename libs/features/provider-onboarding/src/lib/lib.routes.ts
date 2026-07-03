import { Routes } from '@angular/router';

export const providerOnboardingRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./provider-onboarding/provider-onboarding').then(
        (m) => m.ProviderOnboardingPage,
      ),
  },

{
  path: 'agency-creation',
  loadChildren: () =>
    import('@hhsc-compliance/import-engine').then(
      (m) => m.importEngineRoutes,
    ),
},
 
];