// libs/features/consumers/src/lib/pages/programmatic/assessments/assessments.routes.ts
import { Routes } from '@angular/router';

export const ASSESSMENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./assessments-home.page').then((m) => m.AssessmentsHomePage),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview' },

      {
        path: 'overview',
        loadComponent: () =>
          import('./assessments-overview.step').then((m) => m.AssessmentsOverviewStep),
      },
      {
        path: 'idrc',
        loadComponent: () =>
          import('./assessments-idrc.step').then((m) => m.AssessmentsIdrcStep),
      },
      {
        path: 'risk',
        loadComponent: () =>
          import('./assessments-risk.step').then((m) => m.AssessmentsRiskStep),
      },

      // ✅ NEW: Functional Assessment (inside Assessments)
     // {
     //   path: 'functional-assessment',
     //   loadChildren: () =>
     //     import('./functional-assessment/functional-assessment.routes').then(
     //       (m) => m.FUNCTIONAL_ASSESSMENT_ROUTES
     //     ),
     // },

      {
        path: 'documents',
        loadComponent: () =>
          import('./assessments-documents.step').then((m) => m.AssessmentsDocumentsStep),
      },
    ],
  },
];
