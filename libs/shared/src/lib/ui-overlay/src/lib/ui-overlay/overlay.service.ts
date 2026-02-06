// libs/shared/src/lib/ui-overlay/src/lib/overlay/overlay.service.ts
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OverlayEntry, OverlayOpenOptions, OverlaySize } from './overlay.types';
import { OverlayRef } from './overlay-ref';

let _seq = 0;
function nextId() {
  _seq += 1;
  return `ovl_${Date.now()}_${_seq}`;
}

@Injectable({ providedIn: 'root' })
export class OverlayService {
  /** source of truth */
  readonly stack = signal<OverlayEntry[]>([]);

  /** backwards compatible observable */
  private readonly _stack$ = new BehaviorSubject<OverlayEntry[]>([]);
  readonly stack$ = this._stack$.asObservable();

  private sync$(): void {
    this._stack$.next(this.stack());
  }

  open<TData = unknown, TResult = unknown>(
    component: any,
    opts: OverlayOpenOptions<TData> = {}
  ): OverlayRef<TResult> {
    const id = nextId();
    const ref = new OverlayRef<TResult>(this, id);

    const entry: OverlayEntry<TData, TResult> = {
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
    this.sync$();

    if (this.stack().length === 1) document.body.style.overflow = 'hidden';
    return ref;
  }

  close<TResult = unknown>(id?: string, result?: TResult): void {
    const before = this.stack();
    const targetId = id ?? (before.length ? before[before.length - 1].id : undefined);
    if (!targetId) return;

    const entry = before.find((e) => e.id === targetId);
    const after = before.filter((e) => e.id !== targetId);

    this.stack.set(after);
    this.sync$();

    // notify after removal
    (entry?.ref as OverlayRef<TResult> | undefined)?._notifyClosed(result);

    if (after.length === 0) document.body.style.overflow = '';
  }

  closeAll(): void {
    const before = this.stack();
    this.stack.set([]);
    this.sync$();

    for (const e of before) e.ref._notifyClosed(undefined);
    document.body.style.overflow = '';
  }
}
