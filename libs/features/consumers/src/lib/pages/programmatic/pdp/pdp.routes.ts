import { Routes } from '@angular/router';

export const PDP_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pdp-shell.page').then(m => m.PdpShellPage),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'summary' },

      {
        path: 'summary',
        loadComponent: () =>
          import('./steps/pdp-summary.step').then(m => m.PdpSummaryStep),
      },
      {
        path: 'participants',
        loadComponent: () =>
          import('./steps/pdp-participants.step').then(m => m.PdpParticipantsStep),
      },
      {
        path: 'outcomes',
        loadComponent: () =>
          import('./steps/pdp-outcomes.step').then(m => m.PdpOutcomesStep),
      },
      {
        path: 'documents',
        loadComponent: () =>
          import('./steps/pdp-documents.step').then(m => m.PdpDocumentsStep),
      },
    ],
  },
];
