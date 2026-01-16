// libs/web-shell/src/lib/app.config.ts
import {
  ApplicationConfig,
  provideZoneChangeDetection,
  provideBrowserGlobalErrorListeners,
  importProvidersFrom,
} from '@angular/core';

import { provideRouter, withInMemoryScrolling } from '@angular/router';
import {
  provideHttpClient,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';

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

  // Providers (✅ add these exports in @hhsc-compliance/data-access index.ts)
  PROVIDERS_FEATURE_KEY,
  providersReducer,
  ProvidersEffects,

  // Interceptor (✅ must be exported from @hhsc-compliance/data-access)
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

// 👇 Local environment config (no external/relative import, Nx is happy)
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

    // ✅ HttpClient + DI interceptors
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestIdInterceptor,
      multi: true,
    },

    // 🧠 NgRx (root registration for ISS + Providers)
    provideStore({
      [ISS_FEATURE_KEY]: issReducer,
      [PROVIDERS_FEATURE_KEY]: providersReducer,
    }),
    provideEffects([IssEffects, ProvidersEffects]),
    provideRouterStore(),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false,
      trace: true,
      traceLimit: 25,
    }),

    // 🌍 ENV injection (prevents NullInjectorError)
    {
      provide: ENVIRONMENT,
      useValue: environment,
    },

    // ✅ Auth state options (optional)
    {
      provide: AUTH_STATE_OPTIONS,
      useValue: {
        persistence: 'none',
        storageKey: 'app_user',
        defaultRole: 'DirectCareStaff',
      },
    },

    // ✅ DEV auth (optional)
    {
      provide: DEV_AUTH_OPTIONS,
      useValue: {
        enabled: true,
        roles: ['Admin'],
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
      }),
    ),
  ],
};
