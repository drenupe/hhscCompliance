import { Routes } from '@angular/router';

import { AppShellComponent } from './layout/app-shell';

export const operationsRoutes: Routes = [
  {
    path: '',
    component: AppShellComponent,
    children: [
      {
        path: 'operations/executive',
        loadComponent: () =>
          import('@hhsc-compliance/operations').then(
            (m) => m.ExecutiveDashboardComponent,
          ),
      },

      {
        path: 'operations',
        loadComponent: () =>
          import('@hhsc-compliance/dashboard').then(
            (m) => m.OperationsCommandCenterComponent,
          ),
      },

      {
        path: 'dashboard',
        loadComponent: () =>
          import('@hhsc-compliance/dashboard').then((m) => m.Dashboard),
      },

      {
        path: 'dashboard/modules/:module',
        loadComponent: () =>
          import('@hhsc-compliance/dashboard').then(
            (m) => m.ModuleWorkbenchComponent,
          ),
      },

      {
        path: 'dashboard/modules/:module/entities/:entityType/:entityId',
        loadComponent: () =>
          import('@hhsc-compliance/dashboard').then(
            (m) => m.EntityWorkbenchComponent,
          ),
      },

      {
        path: 'remediation/findings/:findingId',
        loadComponent: () =>
          import('@hhsc-compliance/remediation').then(
            (m) => m.FindingWorkspaceComponent,
          ),
      },

      {
        path: 'consumers',
        loadChildren: () =>
          import('@hhsc-compliance/consumers').then((m) => m.CONSUMER_ROUTES),
      },

      {
        path: 'providers',
        loadChildren: () =>
          import('@hhsc-compliance/providers').then((m) => m.PROVIDERS_ROUTES),
      },

      {
        path: 'compliance',
        loadChildren: () =>
          import('@hhsc-compliance/compliance').then(
            (m) => m.COMPLIANCE_ROUTES,
          ),
      },

      {
        path: 'compliance/residential',
        loadChildren: () =>
          import('@hhsc-compliance/residential').then(
            (m) => m.RESIDENTIAL_ROUTES,
          ),
      },

      {
        path: 'compliance/programmatic',
        loadComponent: () =>
          import('@hhsc-compliance/programmatic').then(
            (m) => m.Programmatic,
          ),
      },

      {
        path: 'compliance/finance',
        loadComponent: () =>
          import('@hhsc-compliance/finance').then((m) => m.Finance),
      },

      {
        path: 'compliance/behavior',
        loadComponent: () =>
          import('@hhsc-compliance/behavior').then((m) => m.Behavior),
      },

      {
        path: 'compliance/ane',
        loadComponent: () =>
          import('@hhsc-compliance/ane').then((m) => m.Ane),
      },

      {
        path: 'compliance/restraints',
        loadComponent: () =>
          import('@hhsc-compliance/restraints').then((m) => m.Restraints),
      },

      {
        path: 'compliance/enclosed-beds',
        loadComponent: () =>
          import('@hhsc-compliance/enclosed-beds').then(
            (m) => m.EnclosedBeds,
          ),
      },

      {
        path: 'compliance/protective',
        loadComponent: () =>
          import('@hhsc-compliance/protective-devices').then(
            (m) => m.ProtectiveDevices,
          ),
      },

      {
        path: 'compliance/prohibitions',
        loadComponent: () =>
          import('@hhsc-compliance/prohibitions').then(
            (m) => m.Prohibitions,
          ),
      },

      {
        path: 'medical',
        loadChildren: () =>
          import('@hhsc-compliance/medical').then((m) => m.MEDICAL_ROUTES),
      },

      {
        path: 'iss',
        loadChildren: () =>
          import('@hhsc-compliance/iss').then((m) => m.ISS_ROUTES),
      },
    ],
  },
];