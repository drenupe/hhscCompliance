// libs/shared/src/lib/ui-overlay/src/lib/overlay/overlay.service.ts

import { Injectable, signal, Type } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import {
  OverlayEntry,
  OverlayOpenOptions,
} from './overlay.types';

import { OverlayRef } from './overlay-ref';

let sequence = 0;

function nextId(): string {
  sequence += 1;
  return `ovl_${Date.now()}_${sequence}`;
}

@Injectable({
  providedIn: 'root',
})
export class OverlayService {
  /**
   * Internal stack uses any/any to avoid generic variance
   * issues between OverlayRef<TResult> instances.
   */
  private readonly _stack = signal<OverlayEntry<any, any>[]>([]);

  /**
   * Public readonly signal
   */
  readonly stack = this._stack.asReadonly();

  /**
   * Backwards-compatible observable API
   */
  private readonly _stack$ = new BehaviorSubject<OverlayEntry<any, any>[]>([]);

  readonly stack$ = this._stack$.asObservable();

  private syncStack(): void {
    this._stack$.next(this._stack());
  }

  open<TData = unknown, TResult = unknown>(
    component: Type<unknown>,
    options: OverlayOpenOptions<TData> = {},
  ): OverlayRef<TResult> {
    const id = nextId();

    const ref = new OverlayRef<TResult>(this, id);

    const entry: OverlayEntry<TData, TResult> = {
      id,
      component,
      ref,
      size: options.size ?? 'md',
      ariaLabel: options.ariaLabel,
      data: options.data,
      closeOnBackdrop: options.closeOnBackdrop ?? true,
      closeOnEscape: options.closeOnEscape ?? true,
    };

    this._stack.update((current) => [
      ...current,
      entry as OverlayEntry<any, any>,
    ]);

    this.syncStack();

    if (this._stack().length === 1) {
      document.body.style.overflow = 'hidden';
    }

    return ref;
  }

  close<TResult = unknown>(
    id?: string,
    result?: TResult,
  ): void {
    const current = this._stack();

    const targetId =
      id ??
      (current.length > 0
        ? current[current.length - 1].id
        : undefined);

    if (!targetId) {
      return;
    }

    const entry = current.find(
      (item) => item.id === targetId,
    );

    const next = current.filter(
      (item) => item.id !== targetId,
    );

    this._stack.set(next);
    this.syncStack();

    (entry?.ref as OverlayRef<TResult> | undefined)
      ?._notifyClosed(result);

    if (next.length === 0) {
      document.body.style.overflow = '';
    }
  }

  closeAll(): void {
    const current = this._stack();

    this._stack.set([]);
    this.syncStack();

    for (const entry of current) {
      entry.ref._notifyClosed(undefined);
    }

    document.body.style.overflow = '';
  }

  get top(): OverlayEntry<any, any> | undefined {
    const current = this._stack();
    return current[current.length - 1];
  }

  hasOpenOverlays(): boolean {
    return this._stack().length > 0;
  }
}