// sidebar.component.ts
import { Component, HostListener, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter, Subject, takeUntil, firstValueFrom } from 'rxjs';

// IMPORTANT: import lucide-angular so <lucide-icon> is recognized
import {
  LucideAngularModule,
  ChevronLeft, ChevronRight, // used by the toggle button
} from 'lucide-angular';
import { LayoutService } from '../../data-access/layout.service';

@Component({
  selector: 'lib-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  readonly layout = inject(LayoutService);
  private readonly router = inject(Router);

  // Your nav. (If you have a registry helper, you can replace with that.)
  ROUTES_CONFIG = [
    { label: 'Dashboard', icon: 'layout-dashboard', path: '/dashboard' },
    { label: 'Locations', icon: 'map-pin-house', path: '/residents' },
    { label: 'Consumers', icon: 'users-round', path: '/consumers' },
    { label: 'Medicals', icon: 'stethoscope', path: '/medicals' },
    { label: 'Behavior Support', icon: 'brain', path: '/behaviors' },
    { label: 'Day Hab', icon: 'calendar-range', path: '/dayhabs' },
    { label: 'Staff', icon: 'id-card', path: '/program-requirements/staff' },
    { label: 'Training', icon: 'school', path: '/program-requirements/training' }
  ];

  ngOnInit(): void {
    // Auto-close mobile drawer after navigation
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd), takeUntil(this.destroy$))
      .subscribe(async () => {
        const isMobile = await firstValueFrom(this.layout.isMobile$);
        if (isMobile) this.layout.closeSidebar();
      });
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    this.layout.closeSidebar();
  }

  onToggle(): void {
    this.layout.toggleSidebar();
  }

  /** For overlay keyboard support (Enter/Space). */
  onOverlayActivate(): void {
    this.layout.closeSidebar();
  }

  onOverlayClick(): void {
    this.layout.closeSidebar();
  }

  trackByPath = (_: number, item: { path: string }) => item.path;

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
