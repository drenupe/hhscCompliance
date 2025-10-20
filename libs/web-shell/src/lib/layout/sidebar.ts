import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LayoutService } from '@hhsc-compliance/shared';
import { IconComponent } from '@hhsc-compliance/ui-kit';

import { IconName } from '@hhsc-compliance/ui-kit'; // or wherever IconName lives

type Badge = string | number;

export interface RouteItem {
  label: string;
  icon: IconName;
  path: string;
  title?: string;
  badge?: Badge; // ← optional
}

@Component({
  selector: 'lib-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  layout = inject(LayoutService);

  readonly ROUTES_CONFIG: RouteItem[] = [
   { label: 'Dashboard', icon: 'layout-dashboard', path: '/dashboard' },
    { label: 'Locations', icon: 'home', path: '/residents', badge: 3 },
    { label: 'Consumers', icon: 'users', path: '/consumers' },
    { label: 'Medicals', icon: 'stethoscope', path: '/medicals', badge: '2' },
    { label: 'Behavior', icon: 'activity', path: '/behaviors' },
    { label: 'DayHab', icon: 'briefcase', path: '/dayhabs' },
    { label: 'Training', icon: 'graduation-cap', path: '/program-requirements/training' },
  ];

  onToggle() {
    this.layout.toggleCollapsed();
  }
}
