// libs/data-access/src/lib/auth/token-storage.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  private mem = new Map<string, string>();

  set(accessToken: string, refreshToken: string) {
    this.safeSet('access_token', accessToken);
    this.safeSet('refresh_token', refreshToken);
  }

  getAccess(): string | null {
    return this.safeGet('access_token');
  }
  getRefresh(): string | null {
    return this.safeGet('refresh_token');
  }

  clear() {
    this.safeRemove('access_token');
    this.safeRemove('refresh_token');
  }

  // ---- helpers
  private safeSet(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn(`[TokenStorage] set(${key}) fell back to memory`, e);
      this.mem.set(key, value);
    }
  }
  private safeGet(key: string): string | null {
    try {
      return localStorage.getItem(key) ?? this.mem.get(key) ?? null;
    } catch (e) {
      // localStorage blocked; memory fallback
      return this.mem.get(key) ?? null;
    }
  }
  private safeRemove(key: string) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`[TokenStorage] remove(${key}) failed`, e);
    } finally {
      this.mem.delete(key);
    }
  }
}
