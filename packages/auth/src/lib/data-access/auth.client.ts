import { Injectable, InjectionToken, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay, tap, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TokenStore } from './token-store.service';

/** Configure if you need a different base (defaults to '/api'). */
export const AUTH_API_BASE = new InjectionToken<string>('AUTH_API_BASE', {
  providedIn: 'root',
  factory: () => '/api',
});

/** DTOs */
export interface Tokens {
  accessToken: string;
  /** Optional if your API also returns it in the body; usually the refresh token is a cookie. */
  refreshToken?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  /** Optional TOTP code if MFA is enabled */
  otp?: string;
}

export interface Me {
  id: number | string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
}

/**
 * AuthClient
 * - POST /auth/login -> stores accessToken
 * - GET  /auth/me
 * - POST /auth/refresh (cookie) -> stores new accessToken
 * - POST /auth/logout (optional)
 *
 * NOTE: The interceptor will attach Authorization and handle 401->refresh.
 * We still expose refresh() for manual triggers (e.g., app bootstrap).
 */
@Injectable({ providedIn: 'root' })
export class AuthClient {
  private readonly http = inject(HttpClient);
  private readonly base = inject(AUTH_API_BASE);
  private readonly store = inject(TokenStore);

  /** Convenience getter if you need the raw token synchronously. */
  get accessToken(): string | null {
    return this.store.getAccessToken();
  }

  /** True if a token exists and isn’t expired (with small safety window). */
  get isAuthenticated(): boolean {
    return !!this.store.getAccessToken() && !this.store.isExpired(5);
  }

  /** Login and persist the access token. Also carries cookies (refresh). */
  login(dto: LoginRequest): Observable<Tokens> {
    return this.http
      .post<Tokens>(`${this.base}/auth/login`, dto, { withCredentials: true })
      .pipe(
        tap((t) => this.store.setAccessToken(t.accessToken)),
        shareReplay(1)
      );
  }

  /** Fetch current user profile. Authorization is added by the interceptor. */
  me(): Observable<Me> {
    return this.http.get<Me>(`${this.base}/auth/me`).pipe(shareReplay(1));
  }

  /**
   * Manually refresh the access token using the refresh cookie.
   * Usually the interceptor does this for you on 401, but this is handy at app start.
   */
  refresh(): Observable<Tokens> {
    return this.http
      .post<Tokens>(`${this.base}/auth/refresh`, {}, { withCredentials: true })
      .pipe(
        tap((t) => this.store.setAccessToken(t.accessToken)),
        shareReplay(1),
        catchError((e) => {
          this.store.clear();
          return throwError(() => e);
        })
      );
  }

  /** Optional: backend logout endpoint; clears token locally either way. */
  logout(): Observable<void> {
    this.store.clear();
    return this.http
      .post<void>(`${this.base}/auth/logout`, {}, { withCredentials: true })
      .pipe(
        catchError(() => of(void 0)) // ignore network errors on logout
      );
  }

  /**
   * Optional helper: ensure a fresh token before doing something sensitive.
   * Returns the valid token (or null if not logged in).
   */
  ensureFreshToken(safetySeconds = 10): Observable<string | null> {
    const token = this.store.getAccessToken();
    if (!token) return of(null);
    if (this.store.isExpired(safetySeconds, token)) {
      return this.refresh().pipe(map((t) => t.accessToken ?? null));
    }
    return of(token);
  }
}
