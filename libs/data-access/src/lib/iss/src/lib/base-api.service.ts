// libs/data-access/src/lib/iss/src/lib/base-api.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ENVIRONMENT, EnvironmentConfig } from './tokens/environment.token';

@Injectable({ providedIn: 'root' })
export abstract class BaseApiService {
  protected readonly env = inject<EnvironmentConfig>(ENVIRONMENT);
  protected readonly http = inject(HttpClient);

  /**
   * Safely joins apiBaseUrl + path (removes double /)
   * apiBaseUrl: http://localhost:3000/api/v1
   * path:       /consumers  -> http://localhost:3000/api/v1/consumers
   */
  protected buildUrl(path: string): string {
    const base = this.env.apiBaseUrl.replace(/\/$/, '');   // strip trailing /
    const normalizedPath = path.replace(/^\//, '');        // strip leading /
    return `${base}/${normalizedPath}`;
  }

  protected get<T>(url: string, params?: any) {
    return this.http.get<T>(url, { params });
  }

  protected post<T>(url: string, body: unknown) {
    return this.http.post<T>(url, body);
  }

  protected patch<T>(url: string, body: unknown) {
    return this.http.patch<T>(url, body);
  }

  protected delete<T>(url: string) {
    return this.http.delete<T>(url);
  }
}
