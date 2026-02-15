import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApiService } from '../../../api-core/base-api.service';// adjust if your data-access has api-core elsewhere

import {
  CreateFireDrillInput,
  FireDrillDto,
  UpdateFireDrillInput,
} from '@hhsc-compliance/shared-models';

@Injectable({ providedIn: 'root' })
export class FireDrillsApi extends BaseApiService {
  private readonly path = 'v1/fire-drills';

  list(locationId: string): Observable<FireDrillDto[]> {
    const url = this.buildUrl(this.path);
    return this.get<FireDrillDto[]>(url, { locationId });
  }

  getById(id: string): Observable<FireDrillDto> {
    const url = this.buildUrl(`${this.path}/${id}`);
    return this.get<FireDrillDto>(url);
  }

  create(payload: CreateFireDrillInput): Observable<FireDrillDto> {
    const url = this.buildUrl(this.path);
    return this.post<FireDrillDto>(url, payload);
  }

  update(id: string, payload: UpdateFireDrillInput): Observable<FireDrillDto> {
    const url = this.buildUrl(`${this.path}/${id}`);
    return this.patch<FireDrillDto>(url, payload);
  }

  remove(id: string): Observable<{ id: string }> {
    const url = this.buildUrl(`${this.path}/${id}`);
    return this.delete<{ id: string }>(url);
  }
}
