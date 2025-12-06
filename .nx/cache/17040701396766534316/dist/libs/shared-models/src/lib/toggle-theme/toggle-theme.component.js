"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeToggleComponent = void 0;
const tslib_1 = require("tslib");
// theme-toggle.component.ts
const core_1 = require("@angular/core");
let ThemeToggleComponent = class ThemeToggleComponent {
    constructor() {
        this.isDark = true;
    }
    ngOnInit() {
        const savedTheme = localStorage.getItem('hhsc-theme');
        this.isDark = savedTheme !== 'light';
        this.applyTheme();
    }
    toggleTheme() {
        this.applyTheme();
    }
    applyTheme() {
        const theme = this.isDark ? 'dark' : 'light';
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('hhsc-theme', theme);
    }
};
exports.ThemeToggleComponent = ThemeToggleComponent;
exports.ThemeToggleComponent = ThemeToggleComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-theme-toggle',
        templateUrl: './theme-toggle.component.html',
        styleUrls: ['./theme-toggle.component.scss']
    })
], ThemeToggleComponent);
//# sourceMappingURL=toggle-theme.component.js.map