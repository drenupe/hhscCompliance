import type { AppRole } from '../auth/roles';
export type MenuItem = {
    label: string;
    path: string;
    icon: string;
    badge?: number;
};
export type MenuGroup = {
    id: string;
    label: string;
    items: MenuItem[];
};
export declare function menuForRole(role: AppRole): MenuGroup[];
export declare const MENU_ICON_NAMES: readonly ["layout-dashboard", "users", "home", "list-checks", "wallet", "activity", "shield-alert", "hand", "bed", "shield", "ban", "stethoscope", "pill", "briefcase", "graduation-cap", "user-round", "user-cog", "file-spreadsheet", "shield-check", "file-text", "images"];
export type MenuIconName = (typeof MENU_ICON_NAMES)[number];
