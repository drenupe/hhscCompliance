import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../base-api.service';
import { Consumer } from '@hhsc-compliance/shared-models'; // adjust alias

@Injectable({
  providedIn: 'root',
})
export class ConsumersService extends BaseApiService {
  private readonly consumersPath = '/consumers';

  getConsumers(): Observable<Consumer[]> {
    const url = this.buildUrl(this.consumersPath);
    return this.get<Consumer[]>(url);
  }

  getConsumer(id: string): Observable<Consumer> {
    const url = this.buildUrl(`${this.consumersPath}/${id}`);
    return this.get<Consumer>(url);
  }

  getConsumersByProvider(providerId: string): Observable<Consumer[]> {
    const url = this.buildUrl(this.consumersPath);
    return this.get<Consumer[]>(url, { providerId });
  }

  createConsumer(payload: Partial<Consumer>): Observable<Consumer> {
    const url = this.buildUrl(this.consumersPath);
    return this.post<Consumer>(url, payload);
  }

  updateConsumer(id: string, payload: Partial<Consumer>): Observable<Consumer> {
    const url = this.buildUrl(`${this.consumersPath}/${id}`);
    return this.patch<Consumer>(url, payload);
  }

  deleteConsumer(id: string): Observable<void> {
    const url = this.buildUrl(`${this.consumersPath}/${id}`);
    return this.delete<void>(url);
  }
}
