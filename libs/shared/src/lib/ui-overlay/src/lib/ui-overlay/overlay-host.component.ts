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

  readonly stack = this.overlay.stack;
  readonly top = computed(() => {
    const s = this.stack();
    return s.length ? s[s.length - 1] : null;
  });

  @ViewChild('sheetEl') sheetEl?: ElementRef<HTMLElement>;

  constructor() {
    effect(() => {
      const t = this.top();
      if (!t) return;

      // Focus after render
      queueMicrotask(() => this.sheetEl?.nativeElement?.focus());
    });
  }

  makeInjector(data: unknown, ref: OverlayRef): Injector {
    return Injector.create({
      parent: this.envInjector,
      providers: [
        { provide: OVERLAY_SHEET_DATA, useValue: data },
        { provide: OVERLAY_REF, useValue: ref },
      ],
    });
  }

  onBackdropClick(): void {
    const t = this.top();
    if (t?.closeOnBackdrop) t.ref.close();
  }

  /** Single source of truth for keyboard handling */
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
