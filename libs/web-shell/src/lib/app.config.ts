// libs/web-shell/src/lib/app.config.ts
import {
  ApplicationConfig,
  provideZoneChangeDetection,
  provideBrowserGlobalErrorListeners,
  importProvidersFrom,
} from '@angular/core';

import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { appRoutes } from './app.routes';

import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import { provideStoreDevtools } from '@ngrx/store-devtools'; // 👈 add this

import { AUTH_STATE_OPTIONS } from '@hhsc-compliance/data-access';
import { DEV_AUTH_OPTIONS } from '@hhsc-compliance/data-access';


// ✅ Pull ENVIRONMENT + type + ISS feature from data-access (non-lazy lib)
import {
  ENVIRONMENT,
  EnvironmentConfig,
  ISS_FEATURE_KEY,
  issReducer,
  IssEffects,
} from '@hhsc-compliance/data-access';

import {
  LucideAngularModule,
  LayoutDashboard,
  Home,
  Users,
  Briefcase,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Menu,
  Activity,
  Stethoscope,
  Shield,
  ShieldCheck,
  Ban,
  Pill,
  UserRound,
  UserCog,
  FileSpreadsheet,
  ListChecks,
  Wallet,
  ShieldAlert,
  Hand,
  Bed,
  FileText,
  Images,
} from 'lucide-angular';




// 👇 Local environment config (no external/relative import, Nx is happy)
const environment: EnvironmentConfig = {
   apiBaseUrl: '/api/v1', // 🔧 set this to your Nest ISS API base URL
  // add other fields if you put them on EnvironmentConfig
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      appRoutes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
    ),
    provideHttpClient(),

    // 🧠 NgRx
    provideStore({
      [ISS_FEATURE_KEY]: issReducer,
    }),
    provideEffects([IssEffects]),
    provideRouterStore(),
    provideStoreDevtools({
      maxAge: 25,              // how many states to keep in history
      logOnly: false,          // set true if you only want log-only mode in prod
      trace: true,             // enable stack traces for actions
      traceLimit: 25,
    }),

    // 🌍 This fixes the ENVIRONMENT NullInjectorError without importing from src/
    {
      provide: ENVIRONMENT,
      useValue: environment,
    },
    // ✅ Auth state options (optional)
{
  provide: AUTH_STATE_OPTIONS,
  useValue: {
    persistence: 'none',          // keep off during dev
    storageKey: 'app_user',
    defaultRole: 'DirectCareStaff',
  },
},

// ✅ DEV auth (optional) – enable to skip login while building
{
  provide: DEV_AUTH_OPTIONS,
  useValue: {
    enabled: true,
    roles: ['Admin'],             // pick any real AppRole(s)
    // or provide a full user:
    // user: { id: 'dev', email: 'dev@local', roles: ['Admin'] }
  },
},


    importProvidersFrom(
      LucideAngularModule.pick({
        LayoutDashboard,
        Home,
        Users,
        Briefcase,
        GraduationCap,
        ChevronLeft,
        ChevronRight,
        Menu,
        Activity,
        Stethoscope,
        Shield,
        ShieldCheck,
        Ban,
        Pill,
        UserRound,
        UserCog,
        FileSpreadsheet,
        ListChecks,
        Wallet,
        ShieldAlert,
        Hand,
        Bed,
        FileText,
        Images,
      })
    ),
  ],
};
