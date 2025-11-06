import { Routes } from '@angular/router';

// If you use a guard, uncomment and import it.
// import { raciGuard } from '@hhsc-compliance/web-shell'; // example

export const ISS_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'daily-log' },

    {
    path: 'manager',
    loadComponent: () =>
      import('./pages/iss-manager.page').then(m => m.IssManagerPage),
    // canMatch: [raciGuard('iss')] // optional
  },

  {
    path: 'staff',
    loadComponent: () =>
      import('./pages/iss-staff.page').then(m => m.IssStaffPage),
    // canMatch: [raciGuard('iss')] // optional
  },

  {
    path: 'daily-log',
    loadComponent: () =>
      import('./pages/iss-daily-log.page').then(m => m.IssDailyLogPage),
    // canMatch: [raciGuard('iss')] // optional
  },
  {
    path: 'notes-review',
    loadComponent: () =>
      import('./pages/notes-review.page').then(m => m.IssNotesReviewPage),
  },
  {
    path: 'notes-gallery',
    loadComponent: () =>
      import('./ui/NotesGallery/notes-gallery.component').then(m => m.NotesGalleryComponent),
  },
];
