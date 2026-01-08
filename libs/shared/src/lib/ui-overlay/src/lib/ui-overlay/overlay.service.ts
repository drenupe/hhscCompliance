// libs/shared/src/lib/ui-overlay/src/lib/overlay/overlay.service.ts

import { Injectable, signal } from '@angular/core';
import { OverlayEntry, OverlayOpenOptions, OverlaySize } from './overlay.types';
import { OverlayRef } from './overlay-ref';

let _seq = 0;
function nextId() {
  _seq += 1;
  return `ovl_${Date.now()}_${_seq}`;
}

@Injectable({ providedIn: 'root' })
export class OverlayService {
  readonly stack = signal<OverlayEntry[]>([]);

  open<TData = unknown>(
    component: any,
    opts: OverlayOpenOptions<TData> = {}
  ): OverlayRef {
    const id = nextId();
    const ref = new OverlayRef(this, id);

    const entry: OverlayEntry<TData> = {
      id,
      component,
      ref,
      size: (opts.size ?? 'md') as OverlaySize,
      ariaLabel: opts.ariaLabel,
      data: opts.data,
      closeOnBackdrop: opts.closeOnBackdrop ?? true,
      closeOnEscape: opts.closeOnEscape ?? true,
    };

    this.stack.update((s) => [...s, entry]);

    // Lock body scroll when first overlay opens
    if (this.stack().length === 1) {
      document.body.style.overflow = 'hidden';
    }

    return ref;
  }

  close(id?: string): void {
    const before = this.stack();

    // close top if id not provided
    const targetId = id ?? (before.length ? before[before.length - 1].id : undefined);
    if (!targetId) return;

    const after = before.filter((e) => e.id !== targetId);
    this.stack.set(after);

    // Restore scroll when last overlay closes
    if (after.length === 0) {
      document.body.style.overflow = '';
    }
  }

  closeAll(): void {
    this.stack.set([]);
    document.body.style.overflow = '';
  }
}
