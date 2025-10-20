import { NgModule } from '@angular/core';
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

@NgModule({
  // wrap the ModuleWithProviders inside a real NgModule
  imports: [
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
  ],
  exports: [LucideAngularModule],
})
export class UiKitIconsModule {}
