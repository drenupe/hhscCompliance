import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import {
  AUTH_STATE_OPTIONS,
  AuthTokenInterceptor,
  COMPLIANCE_RESULTS_FEATURE_KEY,
  ComplianceResultsEffects,
  complianceResultsReducer,
  DEV_AUTH_OPTIONS,
  ENVIRONMENT,
  EnvironmentConfig,
  ISS_FEATURE_KEY,
  IssEffects,
  issReducer,
  OPERATIONS_FEATURE_KEY,
  OperationsEffects,
  operationsReducer,
  PROVIDERS_FEATURE_KEY,
  ProvidersEffects,
  providersReducer,
  RequestIdInterceptor,
} from '@hhsc-compliance/data-access';

import {
  Activity,
  Ban,
  Bed,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  FileText,
  GraduationCap,
  Hand,
  Home,
  Images,
  LayoutDashboard,
  ListChecks,
  LucideAngularModule,
  Menu,
  Pill,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
  UserCog,
  UserRound,
  Users,
  Wallet,
} from 'lucide-angular';

import { appRoutes } from './app.routes';

const environment: EnvironmentConfig = {
  apiBaseUrl: '/api',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(),

    provideRouter(
      appRoutes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
    ),

    provideHttpClient(withInterceptorsFromDi()),

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthTokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestIdInterceptor,
      multi: true,
    },

    provideStore({
      [ISS_FEATURE_KEY]: issReducer,
      [PROVIDERS_FEATURE_KEY]: providersReducer,
      [OPERATIONS_FEATURE_KEY]: operationsReducer,
      [COMPLIANCE_RESULTS_FEATURE_KEY]: complianceResultsReducer,
    }),

    provideEffects([
      IssEffects,
      ProvidersEffects,
      OperationsEffects,
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
        Activity,
        Ban,
        Bed,
        Briefcase,
        ChevronLeft,
        ChevronRight,
        FileSpreadsheet,
        FileText,
        GraduationCap,
        Hand,
        Home,
        Images,
        LayoutDashboard,
        ListChecks,
        Menu,
        Pill,
        Shield,
        ShieldAlert,
        ShieldCheck,
        Stethoscope,
        UserCog,
        UserRound,
        Users,
        Wallet,
      }),
    ),
  ],
};