export declare class LayoutService {
    private isMobileSubject;
    private sidebarOpenSubject;
    private isCollapsedSubject;
    isMobile$: import("rxjs").Observable<boolean>;
    sidebarOpen$: import("rxjs").Observable<boolean>;
    isCollapsed$: import("rxjs").Observable<boolean>;
    setMobile(value: boolean): void;
    toggleSidebar(): void;
    closeSidebar(): void;
}
