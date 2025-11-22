import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ENVIRONMENT, EnvironmentConfig } from './tokens/environment.token';

@Injectable({ providedIn: 'root' })
export abstract class BaseApiService {
  protected readonly env = inject<EnvironmentConfig>(ENVIRONMENT);
  protected readonly http = inject(HttpClient);

  protected buildUrl(path: string): string {
    return `${this.env.apiBaseUrl}${path}`;
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
