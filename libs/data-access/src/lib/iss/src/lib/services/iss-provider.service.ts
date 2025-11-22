import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../base-api.service';
import { Provider } from '@hhsc-compliance/shared-models';

@Injectable({
  providedIn: 'root',
})
export class IssProviderService extends BaseApiService {
  private readonly providersPath = '/providers';

  getProviders(): Observable<Provider[]> {
    const url = this.buildUrl(this.providersPath);
    return this.get<Provider[]>(url);
  }

  getProvider(id: string): Observable<Provider> {
    const url = this.buildUrl(`${this.providersPath}/${id}`);
    return this.get<Provider>(url);
  }

  createProvider(payload: Partial<Provider>): Observable<Provider> {
    const url = this.buildUrl(this.providersPath);
    return this.post<Provider>(url, payload);
  }

  updateProvider(id: string, payload: Partial<Provider>): Observable<Provider> {
    const url = this.buildUrl(`${this.providersPath}/${id}`);
    return this.patch<Provider>(url, payload);
  }

  deleteProvider(id: string): Observable<void> {
    const url = this.buildUrl(`${this.providersPath}/${id}`);
    return this.delete<void>(url);
  }
}
