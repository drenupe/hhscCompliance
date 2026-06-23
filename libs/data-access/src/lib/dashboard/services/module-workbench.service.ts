import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApiService } from '../../api-core/base-api.service';
import { ModuleCorrectionView } from '../models/module-workbench.model';
import { EntityWorkbenchView } from '../models/entity-workbench.model';

@Injectable({ providedIn: 'root' })
export class ModuleWorkbenchService extends BaseApiService {
  private readonly dashboardPath = 'v1/dashboard';

  getModuleCorrection(module: string): Observable<ModuleCorrectionView> {
    const url = this.buildUrl(`${this.dashboardPath}/modules/${module}`);
    return this.get<ModuleCorrectionView>(url);
  }

  getEntityWorkbench(
    module: string,
    entityId: string,
  ): Observable<EntityWorkbenchView> {
    const url = this.buildUrl(
      `${this.dashboardPath}/modules/${module}/entities/${entityId}`,
    );

    return this.get<EntityWorkbenchView>(url);
  }
}