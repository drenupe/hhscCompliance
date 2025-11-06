// libs/web-shell/src/lib/layout/sidebar.ts
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

import { AuthStateService } from '@hhsc-compliance/data-access';
import { AppRole, MenuGroup, menuForRole } from '@hhsc-compliance/shared-models';

import { Observable, isObservable, of } from 'rxjs';
import { switchMap, map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'lib-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  template: `
<nav class="sidebar" role="navigation" aria-label="Primary">
  <div class="logo">HHSC</div>

  <ng-container *ngIf="menuGroups$ | async as groups">
    <div class="group" *ngFor="let group of groups; trackBy: trackGroup">
      <div class="group-label">{{ group.label }}</div>

      <ul class="list" role="list">
        <li *ngFor="let item of group.items; trackBy: trackItem">
          <a [routerLink]="item.path" routerLinkActive="active" [attr.aria-label]="item.label">
            <lucide-icon class="i" [name]="item.icon"></lucide-icon>
            <span class="t">{{ item.label }}</span>
            <span *ngIf="item.badge !== undefined" class="badge" aria-hidden="true">{{ item.badge }}</span>
          </a>
        </li>
      </ul>
    </div>
  </ng-container>
</nav>
  `,
  styles: [`
/* container */
.sidebar{
  position:sticky;top:0;height:100dvh;width:260px;
  background:var(--clr-base);border-right:1px solid var(--clr-line);
  padding:12px;overflow:auto
}

/* header */
.logo{font-weight:700;color:var(--clr-accent);margin:4px 8px 10px}
.group{margin:12px 0}
.group-label{margin:8px 8px 6px;color:var(--clr-muted);font-size:.8rem;text-transform:uppercase}

/* list */
.list{list-style:none;margin:0;padding:0}
.list li a{
  display:flex;gap:.6rem;align-items:center; /* text sits close to icon */
  padding:.5rem .75rem;border-radius:8px;
  color:var(--clr-text);text-decoration:none
}
.list li a .i{opacity:.9}             /* remove margin-right:auto to keep icon+text tight */
.list li a .t{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.list li a .badge{
  margin-left:auto; /* badge floats to end without separating icon+text */
  padding:.1rem .4rem;border-radius:999px;
  background:var(--clr-accent-weak);color:var(--clr-accent);font-size:.72rem
}
.list li a:hover{background:var(--clr-hover)}
.list li a.active{background:var(--clr-accent-weak);color:var(--clr-accent)}
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  private auth = inject(AuthStateService);

  // Works whether menuForRole returns MenuGroup[] or Observable<MenuGroup[] | MenuGroup>
  readonly menuGroups$: Observable<MenuGroup[]> = this.auth.role$.pipe(
    switchMap((role: AppRole) => {
      const out = menuForRole(role);
      return isObservable(out) ? out : of(out);
    }),
    map((groups) => Array.isArray(groups) ? groups : [groups]),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  // Stable trackBys without requiring an id on MenuGroup
  trackGroup = (_: number, g: MenuGroup) => g.label;
  trackItem  = (_: number, i: MenuGroup['items'][number]) => i.path;
}
