import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResidentialLocationDto, UpsertResidentialLocationInput } from '@hhsc-compliance/shared-models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ResidentialLocationsApi {
  private http = inject(HttpClient);
  private base = '/api/v1/residential-locations';

  list(): Observable<ResidentialLocationDto[]> {
    return this.http.get<ResidentialLocationDto[]>(this.base);
  }

  get(id: string): Observable<ResidentialLocationDto> {
    return this.http.get<ResidentialLocationDto>(`${this.base}/${id}`);
  }

  create(payload: UpsertResidentialLocationInput): Observable<ResidentialLocationDto> {
    return this.http.post<ResidentialLocationDto>(this.base, payload);
  }

  update(id: string, payload: Partial<UpsertResidentialLocationInput>): Observable<ResidentialLocationDto> {
    return this.http.patch<ResidentialLocationDto>(`${this.base}/${id}`, payload);
  }

  remove(id: string): Observable<{ id: string }> {
    return this.http.delete<{ id: string }>(`${this.base}/${id}`);
  }
}
