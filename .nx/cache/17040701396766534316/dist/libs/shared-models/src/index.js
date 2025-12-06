"use strict";
// libs/shared-models/src/index.ts
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// Canonical roles + role list
tslib_1.__exportStar(require("./lib/auth/roles"), exports);
// RACI primitives (ModuleKey, allowedRolesFor, etc.)
tslib_1.__exportStar(require("./lib/raci"), exports);
// Legacy / misc exports
tslib_1.__exportStar(require("./lib/shared-models"), exports);
tslib_1.__exportStar(require("./lib/ownership"), exports);
tslib_1.__exportStar(require("./lib/nav/role-menu"), exports);
tslib_1.__exportStar(require("./lib/iss/iss.models"), exports);
//# sourceMappingURL=index.js.map