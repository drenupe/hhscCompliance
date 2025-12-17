"use strict";
// libs/shared-models/src/lib/ownership.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.OWNERSHIP_OWNER = void 0;
/**
 * Single "owner" role for each domain.
 * Adjust mappings to whatever fits your org.
 */
exports.OWNERSHIP_OWNER = {
    dashboard: 'ProgramDirector',
    residential: 'ProgramDirector',
    iss: 'ISSManager',
    billing: 'FinanceOfficer',
    settings: 'Admin',
    raci: 'ComplianceOfficer',
    programmatic: 'ProgramDirector',
    finance: 'FinanceOfficer',
};
//# sourceMappingURL=ownership.js.map