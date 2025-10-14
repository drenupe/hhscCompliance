import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { BehaviorSubject, fromEvent, map, startWith, Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LayoutService implements OnDestroy {
  private readonly _isCollapsed = new BehaviorSubject<boolean>(false);
  private readonly _sidebarOpen = new BehaviorSubject<boolean>(false);
  private readonly _isMobile = new BehaviorSubject<boolean>(this.computeIsMobile());

  readonly isCollapsed$ = this._isCollapsed.asObservable();
  readonly sidebarOpen$ = this._sidebarOpen.asObservable();
  readonly isMobile$ = this._isMobile.asObservable();

  private sub = new Subscription();

  constructor(private zone: NgZone) {
    // Recompute on resize (run outside Angular for perf)
    this.zone.runOutsideAngular(() => {
      const s = fromEvent(window, 'resize')
        .pipe(
          startWith(null),
          map(() => this.computeIsMobile())
        )
        .subscribe((isMobile) => {
          // Enter Angular zone to update state
          this.zone.run(() => this._isMobile.next(isMobile));
        });
      this.sub.add(s);
    });
  }

  private computeIsMobile(): boolean {
    return window.innerWidth <= 768;
  }

  toggleSidebar(): void {
    this._sidebarOpen.next(!this._sidebarOpen.value);
  }
  closeSidebar(): void {
    this._sidebarOpen.next(false);
  }

  setCollapsed(v: boolean): void {
    this._isCollapsed.next(v);
  }
  toggleCollapsed(): void {
    this._isCollapsed.next(!this._isCollapsed.value);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
