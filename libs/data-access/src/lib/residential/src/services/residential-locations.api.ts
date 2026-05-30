import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ResidentialLocationDto,
  UpsertResidentialLocationInput,
} from '@hhsc-compliance/shared-models';

import { BaseApiService } from '../../../api-core/base-api.service';

@Injectable({ providedIn: 'root' })
export class ResidentialLocationsApi extends BaseApiService {
  /**
   * Maps to:
   * /api/v1/residential/locations
   */
  private readonly base = 'v1/residential';

  list(): Observable<ResidentialLocationDto[]> {
    const url = this.buildUrl(`${this.base}/locations`);
    return this.get<ResidentialLocationDto[]>(url);
  }

  getOne(id: string): Observable<ResidentialLocationDto> {
    const url = this.buildUrl(`${this.base}/locations/${id}`);
    return this.get<ResidentialLocationDto>(url);
  }

  create(
    payload: UpsertResidentialLocationInput,
  ): Observable<ResidentialLocationDto> {
    const url = this.buildUrl(`${this.base}/locations`);
    return this.post<ResidentialLocationDto>(url, payload);
  }

  update(
    id: string,
    payload: Partial<UpsertResidentialLocationInput>,
  ): Observable<ResidentialLocationDto> {
    const url = this.buildUrl(`${this.base}/locations/${id}`);
    return this.patch<ResidentialLocationDto>(url, payload);
  }

  remove(id: string): Observable<{ id: string }> {
    const url = this.buildUrl(`${this.base}/locations/${id}`);
    return this.delete<{ id: string }>(url);
  }
}