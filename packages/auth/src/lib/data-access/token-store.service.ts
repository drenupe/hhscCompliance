import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export const ACCESS_TOKEN_KEY = 'access_token';
type Token = string | null;

export interface SetTokenOptions {
  persist?: boolean;
  forceEmit?: boolean;
}

export interface DecodedJwt {
  exp?: number;
  iat?: number;
  sub?: string;
  [k: string]: unknown;
}

@Injectable({ providedIn: 'root' })
export class TokenStore {
  private access$ = new BehaviorSubject<Token>(null);
  private readonly hasWindow = typeof window !== 'undefined';
  private readonly hasStorage = this.hasWindow && !!window.localStorage;

  constructor() {
    const saved = this.safeGet(ACCESS_TOKEN_KEY);
    if (saved) this.access$.next(saved);

    if (this.hasWindow) {
      window.addEventListener('storage', (e: StorageEvent) => {
        if (e.key === ACCESS_TOKEN_KEY) {
          const next = this.safeGet(ACCESS_TOKEN_KEY);
          if (next !== this.access$.value) this.access$.next(next);
        }
      });
    }
  }

  accessTokenChanges(): Observable<Token> {
    return this.access$.asObservable();
  }

  getAccessToken(): Token {
    return this.access$.value;
  }

  setAccessToken(token: Token, options: SetTokenOptions = {}): void {
    const { persist = true, forceEmit = false } = options;

    if (persist) {
      if (token) this.safeSet(ACCESS_TOKEN_KEY, token);
      else this.safeRemove(ACCESS_TOKEN_KEY);
    }

    if (forceEmit || token !== this.access$.value) {
      this.access$.next(token);
    }
  }

  clear(): void {
    this.setAccessToken(null, { persist: true });
  }

  refreshFromStorage(): void {
    const saved = this.safeGet(ACCESS_TOKEN_KEY);
    this.setAccessToken(saved ?? null);
  }

  hasToken(): boolean {
    return !!this.getAccessToken();
  }

  decode(token: string = this.getAccessToken() ?? ''): DecodedJwt | null {
    try {
      if (!token) return null;
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const payload = parts[1];

      const json = base64UrlToUtf8(payload);
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  getExpiry(token: string = this.getAccessToken() ?? ''): number | null {
    const decoded = this.decode(token);
    return decoded?.exp ?? null;
    }

  isExpired(safetySeconds = 0, token: string = this.getAccessToken() ?? ''): boolean {
    const exp = this.getExpiry(token);
    if (!exp) return false;
    const now = Math.floor(Date.now() / 1000) + Math.max(0, safetySeconds);
    return now >= exp;
  }

  msUntilExpiry(token: string = this.getAccessToken() ?? ''): number | null {
    const exp = this.getExpiry(token);
    if (!exp) return null;
    return exp * 1000 - Date.now();
  }

  private safeGet(key: string): string | null {
    try {
      if (!this.hasStorage) return null;
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private safeSet(key: string, value: string): void {
    try {
      if (!this.hasStorage) return;
      window.localStorage.setItem(key, value);
    } catch {}
  }

  private safeRemove(key: string): void {
    try {
      if (!this.hasStorage) return;
      window.localStorage.removeItem(key);
    } catch {}
  }
}

/** Decode base64url → UTF-8 without requiring Node types */
function base64UrlToUtf8(b64url: string): string {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(b64url.length / 4) * 4, '=');

  // Prefer browser atob
  const hasAtob = typeof atob === 'function';
  if (hasAtob) {
    // atob returns Latin1; JWT payloads are ASCII JSON so this is fine
    return atob(b64);
  }

  // Node fallback without importing Node types
  const Buf: any = (globalThis as any).Buffer;
  if (Buf?.from) {
    return Buf.from(b64, 'base64').toString('utf8');
  }

  throw new Error('No base64 decoder available in this environment.');
}
