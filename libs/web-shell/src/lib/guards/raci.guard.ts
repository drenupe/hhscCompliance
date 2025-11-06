import { inject } from '@angular/core';
import { CanMatchFn, Route, UrlSegment, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { allowedRolesFor, type ModuleKey, type AppRole } from '@hhsc-compliance/shared-models';
import { AuthStateService } from '@hhsc-compliance/data-access';

export const raciGuard: (moduleKey: ModuleKey) => CanMatchFn =
  (moduleKey) =>
  async (_route: Route, _segments: UrlSegment[]) => {
    const auth = inject(AuthStateService);
    const router = inject(Router);

    const role: AppRole = await firstValueFrom(auth.role$);
    const ok = allowedRolesFor(moduleKey).includes(role);

    if (!ok) router.navigate(['/dashboard'], { queryParams: { denied: moduleKey } });
    return ok;
  };
