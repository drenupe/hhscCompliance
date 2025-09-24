// libs/layout/data-access/src/lib/layout.service.ts
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, merge, fromEvent } from 'rxjs';
import { auditTime, distinctUntilChanged, map, startWith, tap } from 'rxjs/operators';

const MOBILE_QUERY = '(max-width: 768px)';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private isMobileSubject = new BehaviorSubject<boolean>(this.computeIsMobile());
  private sidebarOpenSubject = new BehaviorSubject<boolean>(false);  // mobile drawer
  private isCollapsedSubject = new BehaviorSubject<boolean>(false);  // desktop rail

  readonly isMobile$ = this.isMobileSubject.asObservable();
  readonly sidebarOpen$ = this.sidebarOpenSubject.asObservable();
  readonly isCollapsed$ = this.isCollapsedSubject.asObservable();

  constructor() {
    if (!this.isBrowser) return;

    const resize$ = fromEvent(window, 'resize').pipe(auditTime(100));
    const mql$ = createMediaQueryChange$(MOBILE_QUERY);

    merge(resize$, mql$)
      .pipe(
        startWith(null),
        map(() => this.computeIsMobile()),
        distinctUntilChanged(),
        tap((isMobile) => {
          this.isMobileSubject.next(isMobile);
          if (!isMobile) this.sidebarOpenSubject.next(false); // leaving mobile -> close drawer
        })
      )
      .subscribe();
  }

  toggleSidebar(): void {
    const isMobile = this.isMobileSubject.getValue();
    if (isMobile) this.sidebarOpenSubject.next(!this.sidebarOpenSubject.getValue());
    else this.isCollapsedSubject.next(!this.isCollapsedSubject.getValue());
  }

  openSidebar(): void { this.sidebarOpenSubject.next(true); }
  closeSidebar(): void { this.sidebarOpenSubject.next(false); }
  collapse(): void { this.isCollapsedSubject.next(true); }
  expand(): void { this.isCollapsedSubject.next(false); }

  private computeIsMobile(): boolean {
    if (!this.isBrowser) return false;
    const mql = window.matchMedia(MOBILE_QUERY);
    return typeof mql.matches === 'boolean' ? mql.matches : window.innerWidth < 768;
  }
}

/** Cross-browser Observable for matchMedia changes (change/addListener) */
function createMediaQueryChange$(query: string): Observable<unknown> {
  return new Observable<unknown>((subscriber) => {
    const mql = window.matchMedia(query);
    const handler = (ev: unknown) => subscriber.next(ev);

    // Modern browsers
    if ((mql as any).addEventListener) {
      (mql as any).addEventListener('change', handler);
    }
    // Legacy Safari/old DOM typings
    else if ((mql as any).addListener) {
      (mql as any).addListener(handler);
    }

    // Emit initial state so consumers get a value immediately
    subscriber.next(mql);

    // Cleanup
    return () => {
      if ((mql as any).removeEventListener) {
        (mql as any).removeEventListener('change', handler);
      } else if ((mql as any).removeListener) {
        (mql as any).removeListener(handler);
      }
    };
  });
}

