// libs/web-shell/src/lib/layout/sidebar.ts

import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

import { AuthStateService } from '@hhsc-compliance/data-access';
import { AppRole, MenuGroup, menuForRole } from '@hhsc-compliance/shared-models';
import { LayoutService } from '@hhsc-compliance/shared';

import { Observable, isObservable, of } from 'rxjs';
import { switchMap, map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'lib-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  template: `
    <div
      class="sidebar-shell"
      [class.mobile]="(layout.isMobile$ | async) === true"
      [class.open]="(layout.sidebarOpen$ | async) === true"
    >
      <!-- Mobile overlay (inside sidebar component) -->
      <button
        type="button"
        class="sidebar-overlay"
        *ngIf="
          (layout.isMobile$ | async) === true &&
          (layout.sidebarOpen$ | async) === true
        "
        aria-label="Close menu"
        (click)="layout.closeSidebar()"
        (keydown.enter)="layout.closeSidebar()"
        (keydown.space)="layout.closeSidebar()"
      ></button>

      <!-- Actual sidebar nav -->
      <nav class="sidebar" role="navigation" aria-label="Primary">
        <div class="logo">HHSC</div>

        <!-- Scrollable nav area -->
        <div class="sidebar__scroll">
          <ng-container *ngIf="menuGroups$ | async as groups">
            <div class="group" *ngFor="let group of groups; trackBy: trackGroup">
              <div class="group-label">{{ group.label }}</div>

              <ul class="list" role="list">
                <li *ngFor="let item of group.items; trackBy: trackItem">
                  <a
                    [routerLink]="item.path"
                    routerLinkActive="active"
                    [attr.aria-label]="item.label"
                    (click)="handleItemClick()"
                  >
                    <lucide-icon class="i" [name]="item.icon"></lucide-icon>
                    <span class="t">{{ item.label }}</span>
                    <span
                      *ngIf="item.badge !== undefined"
                      class="badge"
                      aria-hidden="true"
                    >
                      {{ item.badge }}
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </ng-container>
        </div>
      </nav>
    </div>
  `,
  styles: [`
:host {
  display: block;
  /* inherits --sidebar-w and --header-h from lib-app-shell */
}

/* ==========================
   SIDEBAR CONTAINER
   ========================== */

.sidebar-shell {
  position: relative;
}

/* ==========================
   SIDEBAR NAV (DESKTOP BASE)
   ========================== */

.sidebar {
  position: relative;                    /* desktop: lives in the column */
  top: 0;
  height: 100dvh;
  width: var(--sidebar-w, 220px);
  background: var(--clr-base, #020617);
  padding: 10px 10px 8px;
  display: flex;
  flex-direction: column;
  overflow: visible;                     /* inner scroll handles overflow */
  z-index: 60;
  pointer-events: auto;
}

/* header */
.logo {
  font-weight: 700;
  color: var(--clr-accent, #22c55e);
  margin: 4px 8px 8px;
  font-size: 0.9rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  flex-shrink: 0;
}

/* scrollable nav area */
.sidebar__scroll {
  flex: 1 1 auto;
  min-height: 0;                         /* 🔑 flex + scroll */
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 4px;
  -webkit-overflow-scrolling: touch;
}

/* groups */
.group {
  margin: 10px 0;
}

.group-label {
  margin: 6px 8px 4px;
  color: var(--clr-muted, #9ca3af);
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

/* list */
.list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.list li a {
  display: flex;
  gap: 0.6rem;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  color: var(--clr-text, #e5e7eb);
  text-decoration: none;
  font-size: 0.82rem;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    transform 0.05s ease;
}

.list li a .i {
  opacity: 0.9;
  flex: 0 0 18px;
}

.list li a .t {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.list li a .badge {
  margin-left: auto;
  padding: 0.1rem 0.4rem;
  border-radius: 999px;
  background: var(--clr-accent-weak, rgba(34, 197, 94, 0.18));
  color: var(--clr-accent, #22c55e);
  font-size: 0.72rem;
}

.list li a:hover {
  background: var(--clr-hover, rgba(34, 197, 94, 0.16));
  transform: translateY(-0.5px);
}

.list li a.active {
  background: var(--clr-accent-weak, rgba(34, 197, 94, 0.24));
  color: var(--clr-accent, #22c55e);
}

/* ==========================
   MOBILE DRAWER + OVERLAY
   ========================== */

.sidebar-overlay {
  display: none; /* default: no overlay on desktop */
}

/* Mobile styles */
@media (max-width: 768px) {
  /* Drawer */
  .sidebar-shell.mobile .sidebar {
    position: fixed;
    top: var(--header-h, 56px);
    bottom: 0;
    left: 0;
    width: var(--sidebar-w, 220px);
    height: auto;                        /* defined by top/bottom */
    z-index: 1000;
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.8);
    transform: translateX(-100%);
    transition: transform 200ms ease-out;
  }

  .sidebar-shell.mobile.open .sidebar {
    transform: translateX(0);
  }

  /* Overlay lives INSIDE sidebar-shell now */
  .sidebar-shell.mobile .sidebar-overlay {
    display: block;
    position: fixed;
    top: var(--header-h, 56px);
    right: 0;
    bottom: 0;
    left: var(--sidebar-w, 220px);       /* 🔑 never cover the menu strip */
    z-index: 900;                        /* below menu (1000), above content */
    background: rgba(15, 23, 42, 0.55);
    pointer-events: auto;                /* clickable to close */
  }
}
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  private auth = inject(AuthStateService);
  readonly layout = inject(LayoutService);

  readonly menuGroups$: Observable<MenuGroup[]> = this.auth.role$.pipe(
    switchMap((role: AppRole) => {
      const out = menuForRole(role);
      return isObservable(out) ? out : of(out);
    }),
    map((groups) => Array.isArray(groups) ? groups : [groups]),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  trackGroup = (_: number, g: MenuGroup) => g.label;
  trackItem  = (_: number, i: MenuGroup['items'][number]) => i.path;

  handleItemClick(): void {
    // On mobile, close the drawer after navigation.
    // On desktop, sidebar stays open; LayoutService can decide behavior.
    this.layout.closeSidebar();
  }
}
