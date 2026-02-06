// libs/.../compliance-results.api.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApiService } from '../../../../api-core/base-api.service';
import {
  ComplianceResultDto,
  CreateComplianceResultInput,
  UpdateComplianceResultInput,
} from '@hhsc-compliance/shared-models';

export type ComplianceResultsStatusFilter = 'ALL' | 'COMPLIANT' | 'NON_COMPLIANT' | 'UNKNOWN';

export type ComplianceResultsListParams = {
  locationId?: string;
  module?: string;
  subcategory?: string;
  status?: ComplianceResultsStatusFilter | string;
};

@Injectable({ providedIn: 'root' })
export class ComplianceResultsApi extends BaseApiService {
  private readonly path = '/compliance-results';

list(params: ComplianceResultsListParams = {}): Observable<ComplianceResultDto[]> {
  const url = this.buildUrl(this.path);

  // Record<string, any> => MUST use ['x'] for noPropertyAccessFromIndexSignature
  const qp: Record<string, any> = {};

  const loc = String(params.locationId ?? '').trim();
  if (loc) qp['locationId'] = loc;

  const mod = String(params.module ?? '').trim();
  if (mod) qp['module'] = mod;

  const sub = String(params.subcategory ?? '').trim();
  // ✅ only include if it's a real value (prevents subcategory=undefined)
  if (sub) qp['subcategory'] = sub;

  // ✅ bracket access for index-signature-safe reads
  const st = String(params['status'] ?? '').trim().toUpperCase();

  // ✅ Only send real DB statuses; "ALL" or blank => omit entirely
  if (st === 'COMPLIANT' || st === 'NON_COMPLIANT' || st === 'UNKNOWN') {
    qp['status'] = st;
  }

  return this.get<ComplianceResultDto[]>(url, qp);
}

  create(payload: CreateComplianceResultInput): Observable<ComplianceResultDto> {
    const url = this.buildUrl(this.path);
    return this.post<ComplianceResultDto>(url, payload);
  }

  update(id: string, payload: UpdateComplianceResultInput): Observable<ComplianceResultDto> {
    const url = this.buildUrl(`${this.path}/${id}`);
    return this.patch<ComplianceResultDto>(url, payload);
  }

  remove(id: string): Observable<{ id: string }> {
    const url = this.buildUrl(`${this.path}/${id}`);
    return this.delete<{ id: string }>(url);
  }
}
