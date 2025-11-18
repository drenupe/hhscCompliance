import { inject } from '@angular/core';
import { CanMatchFn, Route, UrlSegment, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {
  allowedRolesFor,
  type ModuleKey,
  type RaciRole,
  type AppRole,
} from '@hhsc-compliance/shared-models';
import { AuthStateService } from '@hhsc-compliance/data-access';

// Map fine-grained AppRole titles into coarse RaciRole buckets
function mapAppRoleToRaciRole(role: AppRole): RaciRole {
  switch (role) {
    case 'Admin':
    case 'ProgramDirector':
    case 'ComplianceOfficer':
      return 'ADMIN';

    case 'ISSManager':
    case 'BehaviorSupportLead':
    case 'FinanceOfficer':
    case 'MedicalDirector':
      return 'MANAGER';

    case 'ISSStaff':
    case 'CaseManager':
    case 'Nurse':
    case 'DirectCareStaff':
    case 'Finance':
      return 'STAFF';

    default:
      return 'READONLY';
  }
}

export const raciGuard: (moduleKey: ModuleKey) => CanMatchFn =
  (moduleKey) =>
  async (_route: Route, _segments: UrlSegment[]) => {
    const auth = inject(AuthStateService);
    const router = inject(Router);

    const appRole: AppRole = await firstValueFrom(auth.role$);
    const raciRole = mapAppRoleToRaciRole(appRole);

    const ok = allowedRolesFor(moduleKey).includes(raciRole);

    if (!ok) {
      router.navigate(['/dashboard'], { queryParams: { denied: moduleKey } });
    }

    return ok;
  };
