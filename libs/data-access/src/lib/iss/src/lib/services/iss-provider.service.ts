// libs/data-access/src/lib/iss/src/lib/services/iss-provider.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Provider } from '@hhsc-compliance/shared-models'; // or your actual model

import { BaseApiService } from '../../../../api-core/base-api.service';


@Injectable({ providedIn: 'root' })
export class IssProviderService extends BaseApiService {
  private readonly providersPath = '/iss/providers';

  getProviders(): Observable<Provider[]> {
    const url = this.buildUrl(this.providersPath);
    return this.get<Provider[]>(url);
  }

  createProvider(payload: Partial<Provider>): Observable<Provider> {
    const url = this.buildUrl(this.providersPath);
    return this.post<Provider>(url, payload);
  }
}
