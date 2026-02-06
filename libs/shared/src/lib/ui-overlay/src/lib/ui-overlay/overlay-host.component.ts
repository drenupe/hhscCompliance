// libs/shared/src/lib/ui-overlay/src/lib/overlay/overlay-host.component.ts
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EnvironmentInjector,
  HostListener,
  Injector,
  ViewChild,
  ViewEncapsulation,
  computed,
  effect,
  inject,
} from '@angular/core';
import { CommonModule, NgComponentOutlet } from '@angular/common';

import { OverlayService } from './overlay.service';
import { OVERLAY_REF, OVERLAY_SHEET_DATA } from './overlay.tokens';
import { trapFocus } from './focus-trap';
import { OverlayRef } from './overlay-ref';
import { OverlayEntry } from './overlay.types';

@Component({
  selector: 'lib-overlay-host',
  standalone: true,
  imports: [CommonModule, NgComponentOutlet],
  templateUrl: './overlay-host.component.html',
  styleUrls: ['./overlay-host.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverlayHostComponent {
  private readonly overlay = inject(OverlayService);
  private readonly envInjector = inject(EnvironmentInjector);

  /** signal<OverlayEntry[]> */
  readonly stack = this.overlay.stack;

  readonly top = computed((): OverlayEntry | null => {
    const s = this.stack();
    return s.length ? s[s.length - 1] : null;
  });

  @ViewChild('sheetEl') sheetEl?: ElementRef<HTMLElement>;

  // ✅ Cache injectors per overlay id (prevents NgComponentOutlet churn / NG0103 loops)
  private readonly injectorCache = new Map<string, Injector>();

  readonly topInjector = computed(() => {
    const t = this.top();
    if (!t) return null;

    const cached = this.injectorCache.get(t.id);
    if (cached) return cached;

    const inj = Injector.create({
      parent: this.envInjector,
      providers: [
        { provide: OVERLAY_SHEET_DATA, useValue: t.data },
        { provide: OVERLAY_REF, useValue: t.ref },
      ],
    });

    this.injectorCache.set(t.id, inj);
    return inj;
  });

  constructor() {
    // focus when opened
    effect(() => {
      const t = this.top();
      if (!t) return;

      queueMicrotask(() => this.sheetEl?.nativeElement?.focus());
    });

    // cleanup cache when overlays pop
    effect(() => {
      const ids = new Set(this.stack().map((x) => x.id));
      for (const key of this.injectorCache.keys()) {
        if (!ids.has(key)) this.injectorCache.delete(key);
      }
    });
  }

  onBackdropClick(): void {
    const t = this.top();
    if (t?.closeOnBackdrop) t.ref.close();
  }

  @HostListener('document:keydown', ['$event'])
  onDocKeydown(e: KeyboardEvent): void {
    const t = this.top();
    if (!t) return;

    if (e.key === 'Escape' && t.closeOnEscape) {
      e.preventDefault();
      t.ref.close();
      return;
    }

    const el = this.sheetEl?.nativeElement;
    if (el) trapFocus(el, e);
  }
}
