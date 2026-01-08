// libs/features/consumers/src/lib/components/left-nav/consumer-left-nav.component.ts

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

export type NavBadge = number | string;

export interface ConsumerNavItem {
  label: string;
  link: ReadonlyArray<string | number>;
  disabled?: boolean;
  badge?: NavBadge;
  ariaLabel?: string;
}

export interface ConsumerNavGroup {
  label: string;
  items: ConsumerNavItem[];
}

@Component({
  standalone: true,
  selector: 'lib-consumer-left-nav',
  imports: [NgFor, NgIf, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="left" aria-label="Consumer sections">
      <section class="group" *ngFor="let g of groups; trackBy: trackByGroup">
        <div class="label">{{ g.label }}</div>

        <a
          *ngFor="let item of g.items; trackBy: trackByItem"
          class="link"
          [class.is-disabled]="!!item.disabled"
          [routerLink]="item.disabled ? null : linkFor(item)"
          routerLinkActive="is-active"
          [routerLinkActiveOptions]="{ exact: false }"
          [attr.aria-disabled]="item.disabled ? 'true' : null"
          [attr.aria-label]="item.ariaLabel ?? item.label"
          [attr.tabindex]="item.disabled ? -1 : 0"
          (click)="onLinkClick(item, $event)"
        >
          <span class="link__text">{{ item.label }}</span>

          <span *ngIf="item.badge !== undefined" class="badge" aria-hidden="true">
            {{ item.badge }}
          </span>
        </a>
      </section>
    </nav>
  `,
  styles: [`
    :host { display: block; }

    /* ✅ critical for mobile sheets: allow it to actually render and scroll */
    .left {
      display: flex;
      flex-direction: column;
      gap: var(--sp-5);
      min-width: 0;
      min-height: 0;
    }

    .group { display:flex; flex-direction:column; gap:.35rem; }

    .label {
      font-size:.75rem;
      letter-spacing:.06em;
      opacity:.85;
      text-transform:uppercase;
      margin-bottom:.25rem;
      color: var(--clr-text-muted);
    }

    .link {
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:.6rem;
      padding:.7rem .75rem;
      border-radius:.8rem;
      text-decoration:none;
      color: var(--clr-text);
      border: 1px solid transparent;
      transition: background .12s ease, border-color .12s ease;
      user-select:none;
      outline: none;
    }

    .link:hover {
      border-color: color-mix(in srgb, var(--clr-line) 65%, transparent);
      background: var(--clr-hover);
    }

    .link:focus-visible {
      outline: var(--ring);
      outline-offset: 2px;
    }

    .link.is-active {
      border-color: color-mix(in srgb, var(--clr-line) 85%, transparent);
      background: color-mix(in srgb, var(--clr-card) 88%, var(--clr-accent) 12%);
    }

    .link.is-disabled {
      opacity:.55;
      cursor:not-allowed;
      pointer-events:none;
      background: transparent !important;
      border-color: transparent !important;
    }

    .badge {
      display:inline-flex;
      align-items:center;
      justify-content:center;
      min-width:18px;
      height:18px;
      padding:0 6px;
      border-radius:999px;
      font-size:12px;
      font-weight:800;
      border:1px solid color-mix(in srgb, var(--clr-line) 70%, transparent);
      background: color-mix(in srgb, var(--clr-card) 80%, var(--clr-accent) 20%);
      color: var(--clr-text-strong, var(--clr-text));
      flex: 0 0 auto;
      margin-left: .5rem;
    }

    .link__text {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    @media (max-width: 959px) {
      .left { gap: var(--sp-4); }
    }
  `],
})
export class ConsumerLeftNavComponent {
  /**
   * IMPORTANT:
   * On mobile, your sheet lives outside the consumer route context.
   * So we MUST build an ABSOLUTE link that includes consumerId.
   *
   * Example base:
   *   ['/', 'consumers', consumerId]
   */
  @Input() base: ReadonlyArray<string | number> = [];

  /** Emits when a (non-disabled) link is clicked so the mobile overlay/sheet can close. */
  @Output() navigate = new EventEmitter<void>();

  readonly groups: ConsumerNavGroup[] = [
    {
      label: 'Programmatic',
      items: [
        { label: 'IPC', link: ['programmatic', 'ipc', 'details'] },
        { label: 'PDP', link: ['programmatic', 'pdp', 'summary'] },
        { label: 'IMP', link: ['programmatic',  'imp', 'summary'] },
        { label: 'Assessments', link: ['programmatic', 'assessments', 'overview'] },  
      ],
    },
    {
      label: 'Chapter 565',
      items: [{ label: 'Individual Compliance', link: ['chapter-565'], disabled: true }],
    },
    {
      label: 'Policies & Docs',
      items: [
        { label: 'Policies', link: ['policies'], disabled: true },
        { label: 'Documents', link: ['documents'], disabled: true },
      ],
    },
  ];

  trackByGroup = (_: number, g: ConsumerNavGroup) => g.label;
  trackByItem = (_: number, i: ConsumerNavItem) => i.label;

  /**
   * ✅ Angular-template-safe: NO spreads, NO array literals in the template.
   * ✅ Also guarantees ABSOLUTE path when base is provided.
   */
  linkFor(item: ConsumerNavItem): ReadonlyArray<string | number> {
    // If no base is provided, treat links as relative (desktop aside)
    if (!this.base || this.base.length === 0) return item.link;

    // If base exists, build absolute link: base + item.link
    return (this.base as Array<string | number>).concat(item.link as Array<string | number>);
  }

  onLinkClick(item: ConsumerNavItem, ev: MouseEvent): void {
    if (item.disabled) {
      ev.preventDefault();
      ev.stopPropagation();
      return;
    }
    this.navigate.emit();
  }
}
