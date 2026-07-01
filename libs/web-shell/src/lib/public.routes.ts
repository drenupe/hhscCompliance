import { Routes } from '@angular/router';

export const publicRoutes: Routes = [
  {
    path: 'provider-onboarding',
    loadComponent: () =>
      import('@hhsc-compliance/provider-onboarding').then(
        (m) => m.ProviderOnboardingPage,
      ),
  },
];