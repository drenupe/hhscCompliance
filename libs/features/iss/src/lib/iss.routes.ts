import { Routes } from '@angular/router';

// If you use a guard, uncomment and import it.
// import { raciGuard } from '@hhsc-compliance/web-shell'; // example

export const ISS_ROUTES: Routes = [
       { path: '', pathMatch: 'full', redirectTo: 'iis-home' },

  {
    path: 'iis-home',
    loadComponent: () =>
      import('./pages/iss-home/iss-home.page').then(m => m.IssHomePage),
    // canMatch: [raciGuard('iss')] // optional
  }
];
