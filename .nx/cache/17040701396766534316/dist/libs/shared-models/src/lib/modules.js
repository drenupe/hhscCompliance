"use strict";
// Keep only non-overlapping exports here.
// If you previously exported `ModuleKey` here, REMOVE that export
// (it's now defined in ownership.ts to avoid collisions).
Object.defineProperty(exports, "__esModule", { value: true });
exports.MODULE_KEYS = void 0;
exports.isKnownModuleKey = isKnownModuleKey;
/** Optional: a constant list of module keys for UI/validation */
exports.MODULE_KEYS = [
    'residential',
    'programmatic',
    'finance',
    'behavior',
    'ane',
    'restraints',
    'enclosed-beds',
    'protective-devices',
    'prohibitions',
    'iss',
    'staff',
    'cost-report',
    'medical-nursing',
    'medical-med-admin',
];
/** Optional: type guard using MODULE_KEYS (does not export ModuleKey) */
function isKnownModuleKey(val) {
    return typeof val === 'string' && exports.MODULE_KEYS.includes(val);
}
//# sourceMappingURL=modules.js.map