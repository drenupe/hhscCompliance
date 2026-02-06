// libs/shared/src/lib/ui-overlay/src/lib/overlay/overlay.types.ts
import { Type } from '@angular/core';
import { OverlayRef } from './overlay-ref';

export type OverlaySize = 'sm' | 'md' | 'lg' | 'full';

export interface OverlayOpenOptions<TData = unknown> {
  size?: OverlaySize;
  ariaLabel?: string;
  data?: TData;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
}

/**
 * One entry in the overlay stack
 */
export interface OverlayEntry<TData = unknown, TResult = unknown> {
  id: string;
  component: Type<unknown> | any;
  ref: OverlayRef<TResult>;
  size: OverlaySize;
  ariaLabel?: string;
  data?: TData;
  closeOnBackdrop: boolean;
  closeOnEscape: boolean;
}
