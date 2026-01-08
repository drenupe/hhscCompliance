import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

export type TabBadge = number | string;

export interface HorizontalTab {
  label: string;
  link: ReadonlyArray<string | number>; // relative routerLink segments

  /** Disable navigation + show disabled styling */
  disabled?: boolean;

  /** Badge for errors/counts/status (e.g., 2, "!", "NEW") */
  badge?: TabBadge;

  /** Optional aria-label override (useful if label is short) */
  ariaLabel?: string;
}

export type TabsVariant = 'tabs' | 'stepper';

@Component({
  standalone: true,
  selector: 'lib-horizontal-tabs',
  imports: [NgFor, NgIf, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="tabs" [attr.data-variant]="variant" aria-label="Section steps">
      <a
        *ngFor="let t of tabs; let i = index; trackBy: trackByLabel"
        class="tab"
        [class.is-disabled]="!!t.disabled"
        [routerLink]="t.disabled ? null : t.link"
        routerLinkActive="is-active"
        [routerLinkActiveOptions]="{ exact: true }"
        [attr.aria-disabled]="t.disabled ? 'true' : null"
        [attr.tabindex]="t.disabled ? -1 : 0"
        [attr.aria-label]="t.ariaLabel ?? t.label"
      >
        <!-- Stepper marker -->
        <span *ngIf="variant === 'stepper'" class="step" aria-hidden="true">
          {{ i + 1 }}
        </span>

        <span class="label">{{ t.label }}</span>

        <!-- Badge -->
        <span *ngIf="t.badge !== undefined" class="badge" aria-hidden="true">
          {{ t.badge }}
        </span>
      </a>
    </nav>
  `,
  styles: [`
    .tabs {
      display: flex;
      gap: .5rem;
      flex-wrap: wrap;
      padding: .25rem 0;
      border-bottom: 1px solid color-mix(in srgb, var(--clr-line) 60%, transparent);
      margin-bottom: .75rem;
    }

    .tab {
      text-decoration: none;
      color: var(--clr-text);

      /* ✅ Mobile tap target tweak */
      padding: .6rem .85rem;

      border-radius: var(--radius-pill, 999px);
      border: 1px solid color-mix(in srgb, var(--clr-line) 55%, transparent);
      background: transparent;
      display: inline-flex;
      align-items: center;
      gap: .5rem;
      transition: background .12s ease, border-color .12s ease, transform .08s ease, opacity .12s ease;
      user-select: none;
      position: relative;
      line-height: 1;
      min-height: 40px; /* helps mobile touch */
    }

    .tab:hover {
      background: var(--clr-hover);
      border-color: color-mix(in srgb, var(--clr-line) 75%, transparent);
      transform: translateY(-1px);
    }

    .tab:focus-visible {
      outline: var(--ring);
      outline-offset: 2px;
    }

    .tab.is-active {
      border-color: color-mix(in srgb, var(--clr-line) 90%, transparent);
      background: color-mix(in srgb, var(--clr-card) 88%, var(--clr-accent) 12%);
    }

    /* Disabled */
    .tab.is-disabled {
      opacity: .55;
      cursor: not-allowed;
      pointer-events: none;
      transform: none !important;
      background: transparent !important;
    }

    .label {
      display: inline-block;
      padding-top: 1px; /* tiny optical align */
    }

    /* Badge */
    .badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 18px;
      height: 18px;
      padding: 0 6px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      border: 1px solid color-mix(in srgb, var(--clr-line) 70%, transparent);
      background: color-mix(in srgb, var(--clr-card) 80%, var(--clr-accent) 20%);
      color: var(--clr-text-strong, var(--clr-text));
    }

    /* Stepper variant */
    .tabs[data-variant="stepper"] .tab {
      border-radius: 14px; /* less pill-like, more "step card" */
      padding: .6rem .85rem; /* keep mobile-friendly in stepper too */

      /* ✅ Mobile wrapping tweak */
      flex: 1 1 auto;
    }

    .step {
      width: 22px;
      height: 22px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 800;
      border: 1px solid color-mix(in srgb, var(--clr-line) 70%, transparent);
      background: color-mix(in srgb, var(--clr-card) 85%, var(--clr-accent) 15%);
      color: var(--clr-text-strong, var(--clr-text));
    }

    .tabs[data-variant="stepper"] .tab.is-active .step {
      border-color: color-mix(in srgb, var(--clr-line) 90%, transparent);
      background: color-mix(in srgb, var(--clr-card) 75%, var(--clr-accent) 25%);
    }
  `],
})
export class HorizontalTabsComponent {
  @Input({ required: true }) tabs: HorizontalTab[] = [];

  /** 'tabs' (default) or 'stepper' (shows 1..N) */
  @Input() variant: TabsVariant = 'tabs';

  trackByLabel = (_: number, t: HorizontalTab) => t.label;
}
