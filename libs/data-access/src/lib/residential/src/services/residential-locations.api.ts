import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ResidentialLocationDto,
  UpsertResidentialLocationInput,
} from '@hhsc-compliance/shared-models';

import { BaseApiService } from '../../../api-core/base-api.service';

@Injectable({ providedIn: 'root' })
export class ResidentialLocationsApi extends BaseApiService {
  private readonly resource = 'v1/residential-locations';

  list(): Observable<ResidentialLocationDto[]> {
    return this.get<ResidentialLocationDto[]>(this.buildUrl(this.resource));
  }

  getOne(id: string): Observable<ResidentialLocationDto> {
    return this.get<ResidentialLocationDto>(this.buildUrl(`${this.resource}/${id}`));
  }

  create(payload: UpsertResidentialLocationInput): Observable<ResidentialLocationDto> {
    return this.post<ResidentialLocationDto>(this.buildUrl(this.resource), payload);
  }

  update(id: string, payload: Partial<UpsertResidentialLocationInput>): Observable<ResidentialLocationDto> {
    return this.patch<ResidentialLocationDto>(this.buildUrl(`${this.resource}/${id}`), payload);
  }

  remove(id: string): Observable<{ id: string }> {
    return this.delete<{ id: string }>(this.buildUrl(`${this.resource}/${id}`));
  }
}
