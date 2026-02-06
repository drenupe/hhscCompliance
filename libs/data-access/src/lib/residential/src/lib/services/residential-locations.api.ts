import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  ResidentialLocationDto,
  UpsertResidentialLocationInput,
} from '@hhsc-compliance/shared-models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ResidentialLocationsApi {
  private readonly http = inject(HttpClient);

  private readonly apiPrefix = '/api';
  private readonly v1 = 'v1';
  private readonly resource = 'residential-locations';

  private buildUrl(...parts: Array<string | number | null | undefined>): string {
    const cleaned = parts
      .filter((p): p is string | number => p !== null && p !== undefined)
      .map((p) => String(p).trim())
      .filter(Boolean)
      .map((p) => p.replace(/^\/+|\/+$/g, ''));

    const prefix = this.apiPrefix.startsWith('/') ? this.apiPrefix : `/${this.apiPrefix}`;
    const prefixClean = prefix.replace(/\/+$/g, '');

    return `${prefixClean}/${cleaned.join('/')}`;
  }

  private base(): string {
    return this.buildUrl(this.v1, this.resource);
  }

  list(): Observable<ResidentialLocationDto[]> {
    return this.http.get<ResidentialLocationDto[]>(this.base());
  }

  get(id: string): Observable<ResidentialLocationDto> {
    return this.http.get<ResidentialLocationDto>(this.buildUrl(this.v1, this.resource, id));
  }

  create(payload: UpsertResidentialLocationInput): Observable<ResidentialLocationDto> {
    return this.http.post<ResidentialLocationDto>(this.base(), payload);
  }

  update(id: string, payload: Partial<UpsertResidentialLocationInput>): Observable<ResidentialLocationDto> {
    return this.http.patch<ResidentialLocationDto>(this.buildUrl(this.v1, this.resource, id), payload);
  }

  remove(id: string): Observable<{ id: string }> {
    return this.http.delete<{ id: string }>(this.buildUrl(this.v1, this.resource, id));
  }
}
