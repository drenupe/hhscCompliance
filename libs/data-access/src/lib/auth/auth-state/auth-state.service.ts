// libs/data-access/src/lib/auth-state/auth-state.service.ts
import { Injectable, InjectionToken, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map, shareReplay } from 'rxjs/operators';

import type { AppRole } from '@hhsc-compliance/shared-models';

export interface AppUser {
  id: string;
  email: string;
  roles: AppRole[];
}

/**
 * Optional DI config so environments can enable persistence without code edits.
 * Provide it in appConfig providers if desired.
 */
export interface AuthStateOptions {
  persistence: 'none' | 'localStorage';
  storageKey: string;

  /**
   * Role when no user/roles exist.
   * Enterprise tip: never default to Admin.
   */
  defaultRole: AppRole;
}

/** Provide this token optionally; defaults are applied if missing. */
export const AUTH_STATE_OPTIONS = new InjectionToken<AuthStateOptions>(
  'AUTH_STATE_OPTIONS',
);

const DEFAULT_OPTIONS: AuthStateOptions = {
  persistence: 'none',
  storageKey: 'app_user',
  // ⚠️ Set to your least-privileged role that exists in AppRole (e.g. 'Viewer' or 'None')
  defaultRole: 'Viewer' as AppRole,
};

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly options =
    inject(AUTH_STATE_OPTIONS, { optional: true }) ?? DEFAULT_OPTIONS;

  private readonly storageKey = this.options.storageKey;

  // ✅ Initialize _user$ safely in a field initializer (no "used before init")
  private readonly _user$ = new BehaviorSubject<AppUser | null>(this.initialUser());

  /** Stream of current user (nullable). */
  readonly user$: Observable<AppUser | null> = this._user$.asObservable();

  /** Stream of current roles (empty array when no user). */
  readonly roles$: Observable<AppRole[]> = this.user$.pipe(
    map((u) => u?.roles ?? []),
    distinctUntilChanged(sameRoles),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  /** Logged-in? */
  readonly isAuthenticated$: Observable<boolean> = this.user$.pipe(
    map((u) => !!u),
    distinctUntilChanged(),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  /** First role (fallback to defaultRole when none). */
  readonly role$: Observable<AppRole> = this.roles$.pipe(
    map((roles) => roles[0] ?? this.options.defaultRole),
    distinctUntilChanged(),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  /** Write the whole user (null to clear). */
  setUser(u: AppUser | null): void {
    this._user$.next(u);

    if (!this.isBrowser) return;
    if (this.options.persistence !== 'localStorage') return;

    try {
      if (u) localStorage.setItem(this.storageKey, JSON.stringify(u));
      else localStorage.removeItem(this.storageKey);
    } catch {
      // ignore storage errors (quota, privacy mode, etc.)
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
    const roles = this._user$.value?.roles ?? [];
    return roles[0] ?? this.options.defaultRole;
  }

  /** Convenience: does the current user have any of the given roles? (observable) */
  hasAnyRole$(roles: readonly AppRole[]): Observable<boolean> {
    return this.roles$.pipe(map((mine) => mine.some((r) => roles.includes(r))));
  }

  /** Convenience: is the current user in the given role? (observable) */
  isInRole$(role: AppRole): Observable<boolean> {
    return this.roles$.pipe(map((mine) => mine.includes(role)));
  }

  // ---- init + persistence helpers ----

  private initialUser(): AppUser | null {
    if (!this.isBrowser) return null;
    if (this.options.persistence !== 'localStorage') return null;
    return this.hydrateFromStorage();
  }

  private hydrateFromStorage(): AppUser | null {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as unknown;
      return isUser(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }
}

/** Order-insensitive, stable compare for roles arrays. */
function sameRoles(a: AppRole[], b: AppRole[]): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  const as = [...a].sort().join('|');
  const bs = [...b].sort().join('|');
  return as === bs;
}

function isUser(v: unknown): v is AppUser {
  if (!v || typeof v !== 'object') return false;
  const u = v as AppUser;
  return (
    typeof u.id === 'string' &&
    typeof u.email === 'string' &&
    Array.isArray(u.roles) &&
    u.roles.every((r) => typeof r === 'string')
  );
}
