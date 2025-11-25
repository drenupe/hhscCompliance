// libs/data-access/src/lib/iss/src/lib/services/consumers.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../base-api.service';
import { Consumer } from '@hhsc-compliance/shared-models'; // or your actual model path

@Injectable({ providedIn: 'root' })
export class ConsumersService extends BaseApiService {
  private readonly consumersPath = '/consumers';

  getConsumers(issProviderId?: number): Observable<Consumer[]> {
    const url = this.buildUrl(this.consumersPath);
    const params = issProviderId ? { issProviderId } : undefined;
    return this.get<Consumer[]>(url, params);
  }

  getConsumer(id: number): Observable<Consumer> {
    const url = this.buildUrl(`${this.consumersPath}/${id}`);
    return this.get<Consumer>(url);
  }

  createConsumer(payload: Partial<Consumer>): Observable<Consumer> {
    const url = this.buildUrl(this.consumersPath);
    return this.post<Consumer>(url, payload);
  }

  updateConsumer(id: number, payload: Partial<Consumer>): Observable<Consumer> {
    const url = this.buildUrl(`${this.consumersPath}/${id}`);
    return this.patch<Consumer>(url, payload);
  }
}
