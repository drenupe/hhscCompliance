import { Injectable } from '@angular/core';

type ThemeName = 'light' | 'dark' | 'hc';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private current: ThemeName = 'light';
  private storageKey = 'app-theme';

  constructor() {
    const saved = (localStorage.getItem(this.storageKey) as ThemeName | null);
    this.set(saved ?? this.detectPreferred());
  }

  get value(): ThemeName { return this.current; }

  set(theme: ThemeName) {
    this.current = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.storageKey, theme);
  }

  toggle() {
    const order: ThemeName[] = ['light', 'dark', 'hc'];
    const idx = order.indexOf(this.current);
    const next = order[(idx + 1) % order.length];
    this.set(next);
  }

  private detectPreferred(): ThemeName {
    try {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch { /* empty */ }
    return 'light';
  }
}