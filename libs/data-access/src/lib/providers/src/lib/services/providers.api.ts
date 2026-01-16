// libs/data-access/src/lib/providers/providers.api.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ProviderDto, UpsertProviderInput } from '@hhsc-compliance/shared-models'; // adjust path

@Injectable({ providedIn: 'root' })
export class ProvidersApi {
  private http = inject(HttpClient);
  private base = '/api/v1/providers';

  list(): Observable<ProviderDto[]> {
    return this.http.get<ProviderDto[]>(this.base);
  }

  get(id: string): Observable<ProviderDto> {
    return this.http.get<ProviderDto>(`${this.base}/${id}`);
  }

  create(input: UpsertProviderInput): Observable<ProviderDto> {
    return this.http.post<ProviderDto>(this.base, input);
  }

  update(id: string, input: Partial<UpsertProviderInput>): Observable<ProviderDto> {
    return this.http.patch<ProviderDto>(`${this.base}/${id}`, input);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  /** Single-provider helper: return first provider or null */
  getSingleton(): Observable<ProviderDto | null> {
    return this.list().pipe(map((rows) => rows?.[0] ?? null));
  }
}
