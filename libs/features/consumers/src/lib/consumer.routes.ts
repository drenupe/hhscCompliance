import { Routes } from '@angular/router';

import { ConsumerShellPage } from './pages/consumer-shell/consumer-shell.page';
import { IpcShellPage } from './pages/programmatic/ipc/ipc-shell.page';
import { IpcDetailsStep } from './pages/programmatic/ipc/steps/ipc-details.step';
import { IpcServicesStep } from './pages/programmatic/ipc/steps/ipc-services.step';
import { IpcApprovalsStep } from './pages/programmatic/ipc/steps/ipc-approvals.step';
import { IpcDocumentsStep } from './pages/programmatic/ipc/steps/ipc-documents.step';

// Optional: add a ConsumersListPage later
// import { ConsumersListPage } from './pages/consumers-list/consumers-list.page';

export const CONSUMER_ROUTES: Routes = [
  // /consumers
  {
    path: '',
    pathMatch: 'full',
    // Option A (recommended): redirect to a list page when you create it
    // redirectTo: 'list',

    // Option B (temporary): jump into a test consumer shell
    redirectTo: 'TEST123/programmatic/ipc/details',
  },

  // /consumers/:consumerId/...
  {
    path: ':consumerId',
    component: ConsumerShellPage,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'programmatic/ipc/details' },

      // IPC multi-step
      {
        path: 'programmatic/ipc',
        component: IpcShellPage,
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'details' },
          { path: 'details', component: IpcDetailsStep },
          { path: 'services', component: IpcServicesStep },
          { path: 'approvals', component: IpcApprovalsStep },
          { path: 'documents', component: IpcDocumentsStep },
        ],
      },
    
{
  path: 'programmatic/pdp',
  loadChildren: () =>
    import('./pages/programmatic/pdp/pdp.routes').then(m => m.PDP_ROUTES),
},

{
  path: 'programmatic/imp',
  loadChildren: () =>
    import('./pages/programmatic/imp/imp.routes').then((m) => m.IMP_ROUTES),
},
{
  path: 'programmatic/assessments',
  loadChildren: () =>
    import('./pages/programmatic/assessments/assessments.routes').then(
      (m) => m.ASSESSMENTS_ROUTES
    ),
},



      // Next placeholders:
      // { path: 'programmatic/pdp', component: PdpShellPage, children: [...] },
      // { path: 'programmatic/imp', component: ImpShellPage, children: [...] },
      // { path: 'programmatic/assessments', component: AssessmentsShellPage, children: [...] },
      // { path: 'chapter-565', component: Chapter565ShellPage, children: [...] },
      // { path: 'policies', component: PoliciesShellPage, children: [...] },
      // { path: 'documents', component: DocumentsShellPage, children: [...] },
    ],
  },
];
