// libs/data-access/src/lib/iss/src/lib/tokens/environment.token.ts
import { InjectionToken } from '@angular/core';

export interface EnvironmentConfig {
  apiBaseUrl: string;
  // add more if you like
}

export const ENVIRONMENT = new InjectionToken<EnvironmentConfig>('ENVIRONMENT');
