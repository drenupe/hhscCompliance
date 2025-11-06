// libs/data-access/src/lib/auth-state/auth-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map, shareReplay } from 'rxjs/operators';

import type { AppRole } from '@hhsc-compliance/shared-models';



export interface AppUser {
  id: string;
  email: string;
  roles: AppRole[];
}

/**
 * Global auth state (frontend). Keeps only non-sensitive user metadata.
 * Token storage should live elsewhere (e.g., TokenStorageService).
 */
@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private static readonly STORAGE_KEY = 'app_user';
  private static readonly ENABLE_PERSISTENCE = false; // set to true if you want localStorage hydration

  private readonly _user$ = new BehaviorSubject<AppUser | null>(
    AuthStateService.ENABLE_PERSISTENCE ? AuthStateService.hydrate() : null,
  );

  /** Stream of current user (nullable). */
  readonly user$: Observable<AppUser | null> = this._user$.asObservable();

  /** Stream of current roles (empty array when no user). */
  readonly roles$: Observable<AppRole[]> = this.user$.pipe(
    map((u) => u?.roles ?? []),
    distinctUntilChanged((a, b) => a.join('|') === b.join('|')),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  /** Logged-in? */
  readonly isAuthenticated$: Observable<boolean> = this.user$.pipe(
    map((u) => !!u),
    distinctUntilChanged(),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  /** First role (fallback to 'Admin' if none). */
  readonly role$: Observable<AppRole> = this.user$.pipe(
    map((u) => (u?.roles?.[0] ?? 'Admin') as AppRole),
    distinctUntilChanged(),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  /** Write the whole user (null to clear). */
  setUser(u: AppUser | null): void {
    this._user$.next(u);
    if (AuthStateService.ENABLE_PERSISTENCE) {
      try {
        if (u) localStorage.setItem(AuthStateService.STORAGE_KEY, JSON.stringify(u));
        else localStorage.removeItem(AuthStateService.STORAGE_KEY);
      } catch {
        /* ignore storage errors */
      }
    }
  }

  /** Clear user. */
  clear(): void {
    this.setUser(null);
  }

  /** Replace roles while keeping other fields. */
  setRoles(roles: AppRole[]): void {
    const cur = this._user$.value;
    if (!cur) return;
    this.setUser({ ...cur, roles: roles.slice() });
  }

  /** Returns a one-time snapshot (nullable). Prefer the $ streams for reactive UIs. */
  userSnapshot(): AppUser | null {
    return this._user$.value;
  }

  /** Return current first role with the same fallback logic used by role$. */
  roleSnapshot(): AppRole {
    const u = this._user$.value;
    return (u?.roles?.[0] ?? 'Admin') as AppRole;
  }

  /** Convenience: does the current user have any of the given roles? (observable) */
  hasAnyRole$(roles: AppRole[]): Observable<boolean> {
    return this.roles$.pipe(map((mine) => mine.some((r) => roles.includes(r))));
  }

  /** Convenience: is the current user in the given role? (observable) */
  isInRole$(role: AppRole): Observable<boolean> {
    return this.roles$.pipe(map((mine) => mine.includes(role)));
  }

  // ---- persistence helpers ----
  private static hydrate(): AppUser | null {
    try {
      const raw = localStorage.getItem(AuthStateService.STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as unknown;
      if (AuthStateService.isUser(parsed)) return parsed;
    } catch {
      /* ignore bad JSON */
    }
    return null;
  }

  private static isUser(v: unknown): v is AppUser {
    if (!v || typeof v !== 'object') return false;
    const u = v as AppUser;
    return (
      typeof u.id === 'string' &&
      typeof u.email === 'string' &&
      Array.isArray(u.roles) &&
      u.roles.every((r) => typeof r === 'string')
    );
  }
}
