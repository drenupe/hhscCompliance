import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private isMobileSubject = new BehaviorSubject<boolean>(window.innerWidth < 768);
  private sidebarOpenSubject = new BehaviorSubject<boolean>(false);
  private isCollapsedSubject = new BehaviorSubject<boolean>(false);

  isMobile$ = this.isMobileSubject.asObservable();
  sidebarOpen$ = this.sidebarOpenSubject.asObservable();
  isCollapsed$ = this.isCollapsedSubject.asObservable();

  setMobile(value: boolean) {
    this.isMobileSubject.next(value);
  }

  toggleSidebar() {
    const isMobile = this.isMobileSubject.getValue();
    if (isMobile) {
      this.sidebarOpenSubject.next(!this.sidebarOpenSubject.getValue());
    } else {
      this.isCollapsedSubject.next(!this.isCollapsedSubject.getValue());
    }
  }

  closeSidebar() {
    this.sidebarOpenSubject.next(false);
  }
}
