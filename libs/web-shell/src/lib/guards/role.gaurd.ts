import { inject } from '@angular/core';
import { CanMatchFn, Router, UrlTree } from '@angular/router';
import { AuthStateService, AppRole } from '@hhsc-compliance/data-access';
import { map } from 'rxjs/operators';

export const roleGuard: CanMatchFn = (route) => {
  const required = (route.data?.['roles'] as AppRole[] | undefined) ?? [];
  const auth = inject(AuthStateService);
  const router = inject(Router);

  return auth.role$.pipe(
    map(role => required.length === 0 || required.includes(role) ? true : router.parseUrl('/unauthorized'))
  );
};
