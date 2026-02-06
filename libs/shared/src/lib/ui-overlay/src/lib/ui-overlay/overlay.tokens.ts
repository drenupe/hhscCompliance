import { InjectionToken } from '@angular/core';
import { OverlayRef } from './overlay-ref';

export const OVERLAY_SHEET_DATA = new InjectionToken<unknown>('OVERLAY_SHEET_DATA');
export const OVERLAY_REF = new InjectionToken<OverlayRef<any>>('OVERLAY_REF');
