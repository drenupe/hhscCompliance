// libs/data-access/src/lib/iss/src/lib/services/consumers.api.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApiService } from '../../../api-core/base-api.service';
import { Consumer } from '@hhsc-compliance/shared-models';

@Injectable({ providedIn: 'root' })
export class ConsumersApi extends BaseApiService {
  private readonly path = 'v1/consumers';

  list(issProviderId?: number): Observable<Consumer[]> {
    const url = this.buildUrl(this.path);
    const params = issProviderId != null ? { issProviderId } : undefined;
    return this.get<Consumer[]>(url, params);
  }

  getById(id: number): Observable<Consumer> {
    const url = this.buildUrl(`${this.path}/${id}`);
    return this.get<Consumer>(url);
  }

  create(payload: Partial<Consumer>): Observable<Consumer> {
    const url = this.buildUrl(this.path);
    return this.post<Consumer>(url, payload);
  }

  update(id: number, payload: Partial<Consumer>): Observable<Consumer> {
    const url = this.buildUrl(`${this.path}/${id}`);
    return this.patch<Consumer>(url, payload);
  }
}