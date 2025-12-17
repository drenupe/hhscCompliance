/** Optional: a constant list of module keys for UI/validation */
export declare const MODULE_KEYS: readonly ["residential", "programmatic", "finance", "behavior", "ane", "restraints", "enclosed-beds", "protective-devices", "prohibitions", "iss", "staff", "cost-report", "medical-nursing", "medical-med-admin"];
/** Optional: type guard using MODULE_KEYS (does not export ModuleKey) */
export declare function isKnownModuleKey(val: unknown): val is (typeof MODULE_KEYS)[number];
