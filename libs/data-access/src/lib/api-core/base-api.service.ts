// libs/data-access/src/lib/iss/src/lib/base-api.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ENVIRONMENT, EnvironmentConfig } from './tokens/environment.token';

@Injectable({ providedIn: 'root' })
export abstract class BaseApiService {
  protected readonly env = inject<EnvironmentConfig>(ENVIRONMENT);
  protected readonly http = inject(HttpClient);

  protected buildUrl(path: string): string {
    const baseFromEnv = (this.env?.apiBaseUrl ?? '').trim();
    const base = (baseFromEnv || '/api/v1').replace(/\/+$/, '');
    const normalizedPath = String(path ?? '').trim().replace(/^\/+/, '');
    if (!normalizedPath) return base;
    return `${base}/${normalizedPath}`;
  }

  /** ✅ remove undefined/null/empty/"undefined"/"null" and build HttpParams */
  protected sanitizeParams(params?: Record<string, any>): HttpParams | undefined {
    if (!params) return undefined;

    const cleaned: Record<string, string | string[]> = {};

    for (const [key, raw] of Object.entries(params)) {
      if (raw === undefined || raw === null) continue;

      // arrays (allow multi query params)
      if (Array.isArray(raw)) {
        const arr = raw
          .map((v) => String(v).trim())
          .filter((v) => v !== '' && v.toLowerCase() !== 'undefined' && v.toLowerCase() !== 'null');
        if (arr.length) cleaned[key] = arr;
        continue;
      }

      // primitives
      const v = String(raw).trim();
      if (!v) continue;
      if (v.toLowerCase() === 'undefined' || v.toLowerCase() === 'null') continue;

      cleaned[key] = v;
    }

    // If everything got removed, don't send params at all
    if (!Object.keys(cleaned).length) return undefined;

    // HttpClient will serialize HttpParams correctly
    return new HttpParams({ fromObject: cleaned });
  }

  protected get<T>(url: string, params?: Record<string, any>) {
    const httpParams = this.sanitizeParams(params);
    return this.http.get<T>(url, httpParams ? { params: httpParams } : {});
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
