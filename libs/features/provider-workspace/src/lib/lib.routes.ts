import { Routes } from '@angular/router';

export const providerWorkspaceRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './pages/provider-workspace/provider-workspace.component'
      ).then((module) => module.ProviderWorkspaceComponent),
  },
];