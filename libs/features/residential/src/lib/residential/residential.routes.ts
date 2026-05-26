import { Routes } from '@angular/router';

export const RESIDENTIAL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/residential-locations.page').then(
        (m) => m.ResidentialLocationsPage,
      ),
  },
  {
    path: 'location/:locationId',
    loadComponent: () =>
      import('./pages/residential-shell.page').then(
        (m) => m.ResidentialShellPage,
      ),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview' },

      {
        path: 'overview',
        loadComponent: () =>
          import('./pages/residential-compliance.page').then(
            (m) => m.ResidentialCompliancePage,
          ),
      },

      // TAC §565.23 sections
      {
        path: 'home-environment',
        loadComponent: () =>
          import('./pages/home/home-environment-page.component').then(
            (m) => m.HomeEnvironmentPageComponent,
          ),
      }, // §565.23(b)`

      {
        path: 'hot-water',
        loadComponent: () =>
          import('./pages/hot-water/hot-water.page').then(
            (m) => m.ResidentialHotWaterPage,
          ),
      }, // §565.23(c)

      {
        path: 'life-safety',
        loadComponent: () =>
          import('./pages/life-safety/life-safety.page').then(
            (m) => m.ResidentialLifeSafetyPage,
          ),
      }, // §565.23(d)

      {
        path: 'emergency',
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'plans' },
          {
            path: 'plans',
            loadComponent: () =>
              import('./pages/emergency/emergency-plans.page').then(
                (m) => m.EmergencyPlansPage,
              ),
          }, // §565.23(f)
          {
            path: 'fire-drills',
            loadComponent: () =>
              import('./pages/emergency/fire-drills/fire-drills.page').then(
                (m) => m.FireDrillsPage,
              ),
          }, // §565.23(e)
        ],
      },

      {
        path: 'infection-control',
        loadComponent: () =>
          import('./pages/infection-control/infection-control.page').then(
            (m) => m.ResidentialInfectionControlPage,
          ),
      }, // §565.23(g)

      {
        path: 'medication',
        loadComponent: () =>
          import('./pages/medication/medication.page').then(
            (m) => m.ResidentialMedicationPage,
          ),
      }, // §565.23(h)

      {
        path: 'four-person',
        loadComponent: () =>
          import('./pages/four-person/four-person.page').then(
            (m) => m.ResidentialFourPersonPage,
          ),
      }, // §565.23(i)
    ],
  },
];