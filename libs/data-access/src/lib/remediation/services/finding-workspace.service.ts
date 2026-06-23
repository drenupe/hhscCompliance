import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApiService } from '../../api-core/base-api.service';
import { FindingWorkspaceView } from '../models/finding-workspace.model';

@Injectable({ providedIn: 'root' })
export class FindingWorkspaceService extends BaseApiService {
  private readonly remediationPath = 'v1/remediation';

  getFindingWorkspace(findingId: string): Observable<FindingWorkspaceView> {
    const url = this.buildUrl(
      `${this.remediationPath}/findings/${findingId}/workspace`,
    );

    return this.get<FindingWorkspaceView>(url);
  }
}