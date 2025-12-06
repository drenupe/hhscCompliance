"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const rxjs_1 = require("rxjs");
let LayoutService = class LayoutService {
    constructor() {
        this.isMobileSubject = new rxjs_1.BehaviorSubject(window.innerWidth < 768);
        this.sidebarOpenSubject = new rxjs_1.BehaviorSubject(false);
        this.isCollapsedSubject = new rxjs_1.BehaviorSubject(false);
        this.isMobile$ = this.isMobileSubject.asObservable();
        this.sidebarOpen$ = this.sidebarOpenSubject.asObservable();
        this.isCollapsed$ = this.isCollapsedSubject.asObservable();
    }
    setMobile(value) {
        this.isMobileSubject.next(value);
    }
    toggleSidebar() {
        const isMobile = this.isMobileSubject.getValue();
        if (isMobile) {
            this.sidebarOpenSubject.next(!this.sidebarOpenSubject.getValue());
        }
        else {
            this.isCollapsedSubject.next(!this.isCollapsedSubject.getValue());
        }
    }
    closeSidebar() {
        this.sidebarOpenSubject.next(false);
    }
};
exports.LayoutService = LayoutService;
exports.LayoutService = LayoutService = tslib_1.__decorate([
    (0, core_1.Injectable)({ providedIn: 'root' })
], LayoutService);
//# sourceMappingURL=layout.service.js.map