import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsumerLeftNavComponent } from '../components/left-nav/consumer-left-nav.component';
import { OVERLAY_REF, OVERLAY_SHEET_DATA } from '@hhsc-compliance/ui-overlay';
import { OverlayRef } from '@hhsc-compliance/ui-overlay';

type ConsumerNavData = {
  consumerId: string;
  consumerName?: string;
  base: ReadonlyArray<string | number>;
};

@Component({
  standalone: true,
  selector: 'lib-consumer-nav-sheet',
  imports: [CommonModule, ConsumerLeftNavComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sheet">
      <div class="handle" aria-hidden="true"></div>

      <header class="hdr">
        <div>
          <div class="title">Sections</div>
          <div class="sub">ID: {{ data.consumerId }}</div>
        </div>

        <button type="button" class="btn btn--ghost" (click)="close()">
          Close
        </button>
      </header>

      <div class="body">
        <lib-consumer-left-nav
          [base]="data.base"
          (navigate)="closeAfterNav()"
        />
      </div>
    </div>
  `,
  styles: [`
    :host { display:block; }

    .sheet {
      display:flex;
      flex-direction:column;
      gap:12px;
      min-height: 0;
    }

    .handle {
      width:44px; height:5px; border-radius:999px;
      background: color-mix(in srgb, var(--clr-line, #1f2937) 70%, transparent);
      margin: 6px auto 2px;
      flex: 0 0 auto;
    }

    .hdr {
      display:flex;
      align-items:flex-start;
      justify-content:space-between;
      gap:12px;
      padding-bottom:12px;
      border-bottom: 1px solid color-mix(in srgb, var(--clr-line, #1f2937) 55%, transparent);
      flex: 0 0 auto;
    }

    .title { font-size:1.05rem; font-weight:750; color: var(--clr-text-strong, #f9fafb); }
    .sub { font-size:.85rem; opacity:.8; margin-top:2px; }

    /* ✅ critical: allow nav to scroll inside overlay */
    .body {
      flex: 1 1 auto;
      min-height: 0;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      padding-right: 2px;
    }
  `],
})
export class ConsumerNavSheet {
  readonly data = inject(OVERLAY_SHEET_DATA) as ConsumerNavData;
  private readonly ref = inject(OVERLAY_REF) as OverlayRef;

  close(): void {
    this.ref.close();
  }

  /**
   * ✅ prevents "freeze" / navigation race on mobile:
   * routerLink handles navigation, then we close overlay next microtask.
   */
  closeAfterNav(): void {
    queueMicrotask(() => this.ref.close());
  }
}