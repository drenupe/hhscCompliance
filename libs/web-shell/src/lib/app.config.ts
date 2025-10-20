import { ApplicationConfig,importProvidersFrom } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { appRoutes } from './app.routes';

import { UiKitIconsModule } from '@hhsc-compliance/ui-kit';



// ✅ Lucide: import module + icons from 'lucide-angular'
import {
  LucideAngularModule,
  LayoutDashboard,
  Home,
  Users,
  Stethoscope,
  Activity,
  Briefcase,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Menu,
} from 'lucide-angular';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      appRoutes,
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })
    ),
    provideHttpClient(),
    importProvidersFrom(UiKitIconsModule),

    // 👇 Register the icons (tree-shaken)
    importProvidersFrom(
      LucideAngularModule.pick({
        LayoutDashboard,
        Home,
        Users,
        Stethoscope,
        Activity,
        Briefcase,
        GraduationCap,
        ChevronLeft,
        ChevronRight,
        Menu,
      }),
    ),
  ],
};
