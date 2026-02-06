import { Routes } from '@angular/router';

export const RESIDENTIAL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/residential-locations.page').then((m) => m.ResidentialLocationsPage),
  },
  {
    path: 'location',
    loadComponent: () =>
      import('./pages/residential-shell.page').then((m) => m.ResidentialShellPage),
    children: [
  { path: '', pathMatch: 'full', redirectTo: 'overview' },

  { path: 'overview', loadComponent: () => import('./pages/residential-overview.page').then(m => m.ResidentialOverviewPage) },

  // ✅ TAC §565.23 sections
  { path: 'home', loadComponent: () => import('./pages/home/home.page').then(m => m.ResidentialHomePage) },            // (b)
  { path: 'hot-water', loadComponent: () => import('./pages/hot-water/hot-water.page').then(m => m.ResidentialHotWaterPage) }, // (c)
  { path: 'life-safety', loadComponent: () => import('./pages/life-safety/life-safety.page').then(m => m.ResidentialLifeSafetyPage) }, // (d)

  {
    path: 'emergency',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'plans' },
      { path: 'plans', loadComponent: () => import('./pages/emergency/emergency-plans.page').then(m => m.EmergencyPlansPage) }, // (f)
      { path: 'fire-drills', loadComponent: () => import('./pages/emergency/fire-drills.page').then(m => m.FireDrillsPage) },  // (e)
    ],
  },

  { path: 'infection-control', loadComponent: () => import('./pages/infection-control/infection-control.page').then(m => m.ResidentialInfectionControlPage) }, // (g)
  { path: 'medication', loadComponent: () => import('./pages/medication/medication.page').then(m => m.ResidentialMedicationPage) }, // (h)
  { path: 'four-person', loadComponent: () => import('./pages/four-person/four-person.page').then(m => m.ResidentialFourPersonPage) }, // (i)
]},
];
