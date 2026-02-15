// libs/data-access/src/lib/iss/src/lib/services/consumers.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApiService } from '../../../api-core/base-api.service';

import { Consumer } from '@hhsc-compliance/shared-models';

@Injectable({ providedIn: 'root' })
export class ConsumersService extends BaseApiService {
  /** Base path for consumers on the API (maps to /api/v1/consumers) */
  private readonly consumersPath = '/consumers';

  /**
   * Get all consumers, optionally filtered by ISS provider id.
   * GET /api/v1/consumers?issProviderId=123
   */
  getConsumers(issProviderId?: number): Observable<Consumer[]> {
    const url = this.buildUrl(this.consumersPath);
    const params = issProviderId != null ? { issProviderId } : undefined;
    return this.get<Consumer[]>(url, params);
  }

  /**
   * Get a single consumer by numeric id.
   * GET /api/v1/consumers/:id
   */
  getConsumer(id: number): Observable<Consumer> {
    const url = this.buildUrl(`${this.consumersPath}/${id}`);
    return this.get<Consumer>(url);
  }

  /**
   * Create a consumer.
   * POST /api/v1/consumers
   */
  createConsumer(payload: Partial<Consumer>): Observable<Consumer> {
    const url = this.buildUrl(this.consumersPath);
    return this.post<Consumer>(url, payload);
  }

  /**
   * Patch a consumer.
   * PATCH /api/v1/consumers/:id
   */
  updateConsumer(id: number, payload: Partial<Consumer>): Observable<Consumer> {
    const url = this.buildUrl(`${this.consumersPath}/${id}`);
    return this.patch<Consumer>(url, payload);
  }
}
