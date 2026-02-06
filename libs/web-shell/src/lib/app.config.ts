// libs/web-shell/src/lib/app.config.ts
import {
  ApplicationConfig,
  provideZoneChangeDetection,
  provideBrowserGlobalErrorListeners,
  importProvidersFrom,
} from '@angular/core';

import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';

import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { appRoutes } from './app.routes';

import {
  AUTH_STATE_OPTIONS,
  DEV_AUTH_OPTIONS,
  ENVIRONMENT,
  EnvironmentConfig,

  // ISS
  ISS_FEATURE_KEY,
  issReducer,
  IssEffects,

  // Providers
  PROVIDERS_FEATURE_KEY,
  providersReducer,
  ProvidersEffects,

  // ✅ Compliance Results (ADD THESE EXPORTS IN @hhsc-compliance/data-access index.ts)
  COMPLIANCE_RESULTS_FEATURE_KEY,
  complianceResultsReducer,
  ComplianceResultsEffects,

  // Interceptor
  RequestIdInterceptor,
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

const environment: EnvironmentConfig = {
  apiBaseUrl: '/api/v1',
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

    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: RequestIdInterceptor, multi: true },

    // 🧠 NgRx (root registration)
    provideStore({
      [ISS_FEATURE_KEY]: issReducer,
      [PROVIDERS_FEATURE_KEY]: providersReducer,

      // ✅ add compliance results
      [COMPLIANCE_RESULTS_FEATURE_KEY]: complianceResultsReducer,
    }),
    provideEffects([
      IssEffects,
      ProvidersEffects,

      // ✅ add compliance results effects
      ComplianceResultsEffects,
    ]),
    provideRouterStore(),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false,
      trace: true,
      traceLimit: 25,
    }),

    { provide: ENVIRONMENT, useValue: environment },

    {
      provide: AUTH_STATE_OPTIONS,
      useValue: {
        persistence: 'none',
        storageKey: 'app_user',
        defaultRole: 'DirectCareStaff',
      },
    },
    {
      provide: DEV_AUTH_OPTIONS,
      useValue: {
        enabled: true,
        roles: ['Admin'],
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
      }),
    ),
  ],
};
