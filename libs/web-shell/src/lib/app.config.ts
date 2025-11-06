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

import { IssNotesFeature } from '@hhsc-compliance/iss';       // re-exported in your index.ts
import { IssNotesEffects } from '@hhsc-compliance/iss';

import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';

import {
  LucideAngularModule,
  // core / nav
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
  // newly required by your sidebar/menu
  Shield,           // "shield"
  ShieldCheck,      // "shield-check"
  Ban,              // "ban"
  Pill,             // "pill"
  UserRound,        // "user-round"
  UserCog,          // "user-cog"
  FileSpreadsheet,  // "file-spreadsheet"

  ListChecks,   // "list-checks"
  Wallet,       // "wallet"
  ShieldAlert,  // "shield-alert"
  Hand,         // "hand"
  Bed,          // "bed"
  FileText,
  Images,
  } from 'lucide-angular';

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

    provideStore({ [IssNotesFeature.name]: IssNotesFeature.reducer }),
    provideEffects([IssNotesEffects]),
    provideRouterStore(),

    // Register ONLY the icons you actually use (tree-shaken)
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

        // Additions for your errors
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
