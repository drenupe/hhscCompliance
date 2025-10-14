import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LayoutService } from '@hhsc-compliance/shared';
import { Sidebar } from '../layout/sidebar';
import { MainContent } from '../layout/main-content';

@Component({
  selector: 'lib-app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Sidebar, MainContent],
  templateUrl: './app-shell.html',
  styleUrls: ['./app-shell.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellComponent {
  layout = inject(LayoutService);

  toggleSidebar() {
    this.layout.toggleSidebar();
  }
  closeSidebar() {
    this.layout.closeSidebar();
  }
}
