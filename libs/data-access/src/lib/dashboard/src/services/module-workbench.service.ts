import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ModuleWorkbench } from '../../../../../../shared-models/src/lib/dashboard/models/module-workbench.model';
import { EntityWorkbenchView, ModuleCorrectionEntityType } from './compliance-dashboard.service';

@Injectable({
  providedIn: 'root',
})
export class ModuleWorkbenchService {
  private readonly http = inject(HttpClient);

  getModuleWorkbench(module: string): Observable<ModuleWorkbench> {
    return this.http.get<ModuleWorkbench>(
      `/api/v1/dashboard/modules/${encodeURIComponent(module)}`,
    );
  }

  getEntityWorkbench(
    module: string,
    entityType: ModuleCorrectionEntityType,
    entityId: string,
  ): Observable<EntityWorkbenchView> {
    return this.http.get<EntityWorkbenchView>(
      `/api/v1/dashboard/modules/${encodeURIComponent(
        module,
      )}/entities/${encodeURIComponent(entityType)}/${encodeURIComponent(
        entityId,
      )}`,
    );
  }
}