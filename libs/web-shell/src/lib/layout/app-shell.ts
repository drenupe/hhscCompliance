// libs/web-shell/src/lib/layout/app-shell.ts

import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { LayoutService } from '@hhsc-compliance/shared';
import { Sidebar } from '../layout/sidebar';

@Component({
  selector: 'lib-app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Sidebar],
  templateUrl: './app-shell.html',
  styleUrls: ['./app-shell.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellComponent {
  layout = inject(LayoutService);

  toggleSidebar(): void {
    this.layout.toggleSidebar();
  }

  closeSidebar(): void {
    this.layout.closeSidebar();
  }
}
