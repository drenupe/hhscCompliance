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


  {
  path: 'provider/workspace',
  loadChildren: () =>
    import('@hhsc-compliance/provider-workspace').then(
      (module) => module.providerWorkspaceRoutes,
    ),
},

  
];