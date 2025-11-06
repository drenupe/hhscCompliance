// libs/data-access/src/lib/auth/auth-http.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { TokenStorageService } from './token-storage.service';
import { AppUser, AuthStateService } from '../auth-state/auth-state.service';

type LoginDto  = { email: string; password: string };
type LoginResp = { accessToken: string; refreshToken: string; user: AppUser };
type MeResp    = AppUser;

@Injectable({ providedIn: 'root' })
export class AuthHttpService {
  private http   = inject(HttpClient);
  private tokens = inject(TokenStorageService);
  private state  = inject(AuthStateService);

  /** POST /auth/login → persists tokens + user state */
  login(dto: LoginDto): Observable<AppUser> {
    return this.http.post<LoginResp>('/api/auth/login', dto).pipe(
      tap((r) => this.tokens.set(r.accessToken, r.refreshToken)),
      map((r) => r.user),
      tap((user) => this.state.setUser(user)),
      catchError((err) => {
        // surface or map as needed
        console.warn('[Auth] login failed', err);
        throw err;
      })
    );
  }

  /** GET /auth/me → refreshes current user in state */
  me(): Observable<AppUser> {
    return this.http.get<MeResp>('/api/auth/me').pipe(
      tap((user) => this.state.setUser(user)),
      catchError((err) => {
        console.warn('[Auth] me failed; clearing user', err);
        this.state.clear();
        return EMPTY; // or: throw err;  depending on caller expectations
      })
    );
  }

  /** POST /auth/logout → clears tokens + state */
  logout(): Observable<void> {
    return this.http.post<void>('/api/auth/logout', {}).pipe(
      tap(() => this.tokens.clear()),
      tap(() => this.state.clear()),
      catchError((err) => {
        console.warn('[Auth] logout failed; still clearing client state', err);
        this.tokens.clear();
        this.state.clear();
        return EMPTY;
      })
    );
  }
}
