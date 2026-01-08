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

export interface OverlayEntry<TData = unknown> {
  id: string;
  component: Type<unknown>;
  ref: OverlayRef;

  size: OverlaySize;
  ariaLabel?: string;
  data?: TData;

  closeOnBackdrop: boolean;
  closeOnEscape: boolean;
}