import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'provider-onboarding',
  },
     
  {
    path: 'provider-onboarding',
    loadChildren: () =>
      import('@hhsc-compliance/provider-onboarding').then(
        (m) => m.providerOnboardingRoutes,
      ),
  },
];