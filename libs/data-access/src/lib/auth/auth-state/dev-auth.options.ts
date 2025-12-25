// libs/data-access/src/lib/auth-state/dev-auth.options.ts
import { InjectionToken } from '@angular/core';
import type { AppRole } from '@hhsc-compliance/shared-models';
import type { AppUser } from './auth-state.service';

export type DevAuthOptions = {
  enabled: boolean;
  /**
   * If set, the app will behave as if this user is logged in.
   * Keep it NON-sensitive.
   */
  user?: AppUser;
  /**
   * Convenience: if user not provided, you can specify roles here.
   */
  roles?: AppRole[];
};

export const DEV_AUTH_OPTIONS = new InjectionToken<DevAuthOptions>(
  'DEV_AUTH_OPTIONS',
);
