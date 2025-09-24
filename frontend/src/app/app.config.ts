// apps/<app>/src/app/app.config.ts
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { appRoutes } from './app.routes';
import { authInterceptor } from '@hhsc/auth/data-access';

import {
  LucideAngularModule,
  LayoutDashboard, MapPin, Users, Stethoscope, Brain,
  CalendarRange, IdCard, GraduationCap, ChevronLeft, ChevronRight,
} from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),

    // HTTP + auth
    provideHttpClient(withInterceptors([authInterceptor])),

    // Icons (pick only those you use)
    importProvidersFrom(
      LucideAngularModule.pick({
        LayoutDashboard, MapPin, Users, Stethoscope, Brain,
        CalendarRange, IdCard, GraduationCap, ChevronLeft, ChevronRight,
      })
    ),
  ],
};
