// libs/data-access/src/lib/auth-state/auth-state.service.ts
import { Injectable, InjectionToken, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map, shareReplay } from 'rxjs/operators';

import type { AppRole } from '@hhsc-compliance/shared-models';
import { DEV_AUTH_OPTIONS } from './dev-auth.options';

export interface AppUser {
  id: string;
  email: string;
  roles: AppRole[];
}

export interface AuthStateOptions {
  persistence: 'none' | 'localStorage';
  storageKey: string;
  defaultRole: AppRole; // MUST be real AppRole
}

export const AUTH_STATE_OPTIONS = new InjectionToken<AuthStateOptions>(
  'AUTH_STATE_OPTIONS',
);

const DEFAULT_OPTIONS: AuthStateOptions = {
  persistence: 'none',
  storageKey: 'app_user',
  defaultRole: 'DirectCareStaff' as AppRole,
};

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly options =
    inject(AUTH_STATE_OPTIONS, { optional: true }) ?? DEFAULT_OPTIONS;

  private readonly devAuth = inject(DEV_AUTH_OPTIONS, { optional: true });

  private readonly _user$ = new BehaviorSubject<AppUser | null>(this.initialUser());

  /** Stream of current user (nullable). */
  readonly user$: Observable<AppUser | null> = this._user$.asObservable();

  /** Stream of current roles (empty when no user). */
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

  /** First role with safe fallback. */
  readonly role$: Observable<AppRole> = this.roles$.pipe(
    map((roles) => roles[0] ?? this.options.defaultRole),
    distinctUntilChanged(),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  setUser(u: AppUser | null): void {
    this._user$.next(u);
    this.persist(u);
  }

  clear(): void {
    this.setUser(null);
  }

  setRoles(roles: AppRole[]): void {
    const cur = this._user$.value;
    if (!cur) return;
    this.setUser({ ...cur, roles: roles.slice() });
  }

  userSnapshot(): AppUser | null {
    return this._user$.value;
  }

  roleSnapshot(): AppRole {
    const roles = this._user$.value?.roles ?? [];
    return roles[0] ?? this.options.defaultRole;
  }

  // ---- init helpers ----

  private initialUser(): AppUser | null {
    // ✅ dev mode: seed a fake user so you never log in during dev
    const seeded = this.seedDevUser();
    if (seeded) return seeded;

    // ✅ normal mode: optionally hydrate from localStorage
    if (!this.isBrowser) return null;
    if (this.options.persistence !== 'localStorage') return null;
    return this.hydrateFromStorage();
  }

  private seedDevUser(): AppUser | null {
    if (!this.isBrowser) return null; // avoid SSR surprises later
    if (!this.devAuth?.enabled) return null;

    // if full user provided, use it
    if (this.devAuth.user) return this.devAuth.user;

    // else create one from roles (or defaultRole)
    const roles = (this.devAuth.roles?.length ? this.devAuth.roles : [this.options.defaultRole]) as AppRole[];

    return {
      id: 'dev-user',
      email: 'dev@local',
      roles,
    };
  }

  private hydrateFromStorage(): AppUser | null {
    try {
      const raw = localStorage.getItem(this.options.storageKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as unknown;
      return isUser(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  private persist(u: AppUser | null) {
    if (!this.isBrowser) return;
    if (this.options.persistence !== 'localStorage') return;

    try {
      if (u) localStorage.setItem(this.options.storageKey, JSON.stringify(u));
      else localStorage.removeItem(this.options.storageKey);
    } catch {
      /* ignore */
    }
  }
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
