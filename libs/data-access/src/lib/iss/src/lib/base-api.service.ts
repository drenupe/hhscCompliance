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
   *
   * NOTE:
   * - In production (Vercel), prefer a RELATIVE base like "/api/v1"
   *   so Vercel rewrites can proxy to Render (no CORS).
   * - Never default to localhost in shared/browser code.
   */
  protected buildUrl(path: string): string {
    const baseFromEnv = (this.env?.apiBaseUrl ?? '').trim();

    // ✅ Safe default for browser deployments (works with Vercel rewrites)
    const base = (baseFromEnv || '/api/v1').replace(/\/+$/, ''); // strip trailing slashes

    const normalizedPath = String(path ?? '')
      .trim()
      .replace(/^\/+/, ''); // strip leading slashes

    // If caller passes "" or "/", return base
    if (!normalizedPath) return base;

    return `${base}/${normalizedPath}`;
  }

  protected get<T>(url: string, params?: Record<string, any>) {
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
