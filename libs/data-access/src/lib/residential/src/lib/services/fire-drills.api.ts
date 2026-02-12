import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApiService } from '../../../../api-core/base-api.service';
import {
  FireDrillLogDto,
  CreateFireDrillLogInput,
  UpdateFireDrillLogInput,
  FireDrillsListParams,
} from '@hhsc-compliance/shared-models';

@Injectable({ providedIn: 'root' })
export class FireDrillsApi extends BaseApiService {
  // pick a consistent backend path; example:
  private readonly path = '/residential/fire-drills';

  list(params: FireDrillsListParams = {}): Observable<FireDrillLogDto[]> {
    const url = this.buildUrl(this.path);
    const qp: Record<string, any> = {};

    const loc = String(params.locationId ?? '').trim();
    if (loc) qp['locationId'] = loc;

    const from = String(params.from ?? '').trim();
    if (from) qp['from'] = from;

    const to = String(params.to ?? '').trim();
    if (to) qp['to'] = to;

    return this.get<FireDrillLogDto[]>(url, qp);
  }

  create(payload: CreateFireDrillLogInput): Observable<FireDrillLogDto> {
    const url = this.buildUrl(this.path);
    return this.post<FireDrillLogDto>(url, payload);
  }

  update(id: string, payload: UpdateFireDrillLogInput): Observable<FireDrillLogDto> {
    const url = this.buildUrl(`${this.path}/${id}`);
    return this.patch<FireDrillLogDto>(url, payload);
  }

  remove(id: string): Observable<{ id: string }> {
    const url = this.buildUrl(`${this.path}/${id}`);
    return this.delete<{ id: string }>(url);
  }
}
