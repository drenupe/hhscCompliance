import { Routes } from '@angular/router';
import { raciGuard } from './guards/raci.guard';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  
  {
    path: 'dashboard',
    loadComponent: () =>
      import('@hhsc-compliance/dashboard').then(m => m.Dashboard),
  },
 

  {
    path: 'compliance/residential',
    // canMatch: [raciGuard('residential')], // optional
    loadComponent: () =>
      import('@hhsc-compliance/residential').then(
        (m) => m.Residential
      ),
  },


  { path: 'compliance/programmatic',
   // canMatch: [raciGuard('programmatic')],
    loadComponent: () => import('@hhsc-compliance/programmatic').then(m => m.Programmatic),
  },

  { path: 'compliance/finance',
   // canMatch: [raciGuard('finance')],
    loadComponent: () => import('@hhsc-compliance/finance').then(m => m.Finance),
  },
  { path: 'compliance/behavior',
    //canMatch: [raciGuard('behavior')],
    loadComponent: () => import('@hhsc-compliance/behavior').then(m => m.Behavior),
  },
  { path: 'compliance/ane',
  //  canMatch: [raciGuard('ane')],
    loadComponent: () => import('@hhsc-compliance/ane').then(m => m.Ane),
  },
  { path: 'compliance/restraints',
  //  canMatch: [raciGuard('restraints')],
    loadComponent: () => import('@hhsc-compliance/restraints').then(m => m.Restraints),
  },
  { path: 'compliance/enclosed-beds',
   // canMatch: [raciGuard('enclosedBeds')],
    loadComponent: () => import('@hhsc-compliance/enclosed-beds').then(m => m.EnclosedBeds),
  },
  {
     path: 'compliance/protective',
   // canMatch: [raciGuard('protectiveDevices')],
    // eslint-disable-next-line @nx/enforce-module-boundaries
    loadComponent: () => import('@hhsc-compliance/protective-devices').then(m => m.ProtectiveDevices),
  },
  { path: 'compliance/prohibitions',
   // canMatch: [raciGuard('prohibitions')],
    loadComponent: () => import('@hhsc-compliance/prohibitions').then(m => m.Prohibitions),
  },


 {
    path: 'medical',
    loadChildren: () =>
      import('@hhsc-compliance/medical').then(
        (m: typeof import('@hhsc-compliance/medical')) => m.MEDICAL_ROUTES
      ),
  },

  {
    path: 'iss',
    loadChildren: () =>
      import('@hhsc-compliance/iss').then(
        (m: typeof import('@hhsc-compliance/iss')) => m.ISS_ROUTES
      ),
  },
   {
    path: 'consumers',
    loadChildren: () =>
      import('@hhsc-compliance/consumers').then(
        (m: typeof import('@hhsc-compliance/consumers')) => m.CONSUMER_ROUTES
      ),
  },
// // Staff
 // { path: 'staff',
 //   canMatch: [raciGuard('staff')],
 //   loadComponent: () => import('@hhsc-compliance/staff').then(m => m.Staff),
 // },
// // ISS
 // { path: 'iss/attendance',
 //   canMatch: [raciGuard('issAttendance')],
 //   loadComponent: () => import('@features/iss-attendance').then(m => m.IssAttendance),
 // },
 // { path: 'iss/service-plans',
 //   canMatch: [raciGuard('issServicePlans')],
 //   loadComponent: () => import('@features/iss-service-plans').then(m => m.IssServicePlans),
 // },
 // { path: 'iss/transportation',
 //   canMatch: [raciGuard('issTransportation')],
 //   loadComponent: () => import('@features/iss-transportation').then(m => m.IssTransportation),
 // },
 // { path: 'iss/incidents',
 //   canMatch: [raciGuard('issIncidents')],
 //   loadComponent: () => import('@features/iss-incidents').then(m => m.IssIncidents),
 // },
 //// Admin
 // { path: 'admin/policies',
 //   canMatch: [raciGuard('policies')],
 //   loadComponent: () => import('@features/policies').then(m => m.PoliciesComponent),
 // },
 // { path: 'admin/users',
 //   canMatch: [raciGuard('users')],
 //   loadComponent: () => import('@features/users').then(m => m.UsersComponent),
 // },
 // { path: 'admin/cost-report',
 //   canMatch: [raciGuard('costReport')],
 //   loadComponent: () => import('@features/cost-report').then(m => m.CostReport),
 // },
//
  
  
   { path: '**', redirectTo: '' },
];
