import { Injectable, NgZone, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  fromEvent,
  map,
  startWith,
  Subscription,
  distinctUntilChanged,
} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LayoutService implements OnDestroy {
  /**
   * True = sidebar is in "collapsed" (narrow / icon-only) mode on desktop.
   * This is mostly a desktop concern – mobile uses open/close instead.
   */
  private readonly _isCollapsed = new BehaviorSubject<boolean>(false);

  /**
   * True = sidebar drawer is open (used for mobile off-canvas,
   * can also be reused for desktop if you ever hide it entirely).
   */
  private readonly _sidebarOpen = new BehaviorSubject<boolean>(false);

  /**
   * True = we are in "mobile" layout (width <= breakpoint).
   */
  private readonly _isMobile = new BehaviorSubject<boolean>(
    LayoutService.computeIsMobile(),
  );

  /** Public streams */
  readonly isCollapsed$ = this._isCollapsed.asObservable();
  readonly sidebarCollapsed$ = this.isCollapsed$; // nicer name for templates
  readonly sidebarOpen$ = this._sidebarOpen.asObservable();
  readonly isMobile$ = this._isMobile.asObservable();

  /** For cleanup */
  private readonly sub = new Subscription();

  /** Simple breakpoint (px) – tweak as needed */
  private static readonly MOBILE_BREAKPOINT = 768;

  constructor(private zone: NgZone) {
    // Recompute mobile flag on resize – do work outside Angular for perf.
    this.zone.runOutsideAngular(() => {
      const resize$ = fromEvent(window, 'resize').pipe(
        startWith(null),
        map(() => LayoutService.computeIsMobile()),
        distinctUntilChanged(),
      );

      const s = resize$.subscribe((isMobile) => {
        this.zone.run(() => {
          const wasMobile = this._isMobile.value;

          this._isMobile.next(isMobile);

          // Transition desktop -> mobile: close drawer by default
          if (!wasMobile && isMobile) {
            this._sidebarOpen.next(false);
          }

          // Transition mobile -> desktop: reopen sidebar by default
          if (wasMobile && !isMobile) {
            this._sidebarOpen.next(true);
          }
        });
      });

      this.sub.add(s);
    });

    // Initial: if we start on desktop, sidebar should be open by default
    if (!this._isMobile.value) {
      this._sidebarOpen.next(true);
    }
  }

  /** Pure helper so it can be reused without needing instance state */
  private static computeIsMobile(): boolean {
    if (typeof window === 'undefined') {
      // SSR / tests: assume desktop
      return false;
    }
    return window.innerWidth <= LayoutService.MOBILE_BREAKPOINT;
  }

  // ===== Sidebar open/close (drawer) =====

  toggleSidebar(): void {
    this._sidebarOpen.next(!this._sidebarOpen.value);
  }

  closeSidebar(): void {
    this._sidebarOpen.next(false);
  }

  // ===== Collapsed (narrow) sidebar – desktop aesthetic control =====

  setCollapsed(value: boolean): void {
    this._isCollapsed.next(value);
  }

  toggleCollapsed(): void {
    this._isCollapsed.next(!this._isCollapsed.value);
  }

  // ===== Cleanup =====

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
