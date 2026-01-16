// libs/data-access/src/index.ts (or libs/data-access/src/lib/index.ts)
// ✅ Clean barrel exports (no duplicates, no double slashes, grouped)

// =====================================
// Compliance domain services
// =====================================
export * from './lib/residential/residential-locations.api';
export * from './lib/programmatic/programmatic.service';
export * from './lib/finance/finance.service';
export * from './lib/behavior/behavior.service';
export * from './lib/ane/ane.service';
export * from './lib/restraints/restraints.service';
export * from './lib/enclosed-beds/enclosed-beds.service';
export * from './lib/protective-devices/protective-devices.service';
export * from './lib/prohibitions/prohibitions.service';
export * from './lib/dashboard/compliance-dashboard.service';

// =====================================
// Auth
// =====================================
export * from './lib/auth/auth-http/auth-http.service';
export * from './lib/auth/auth-http/token-storage.service';
export * from './lib/auth/auth-state/auth-state.service';
export * from './lib/auth/auth-state/dev-auth.options';
export * from './lib/auth/auth-guard';
export * from './lib/auth/role-guard';
export * from './lib/auth/auth-interceptor';

// =====================================
// API Core
// =====================================
export * from './lib/api-core/base-api.service';

// =====================================
// ISS (Feature)
// =====================================
export * from './lib/iss/src/lib/iss-data-access.module';
export * from './lib/api-core/tokens/environment.token';

export * from './lib/iss/src/lib/+state/iss.models';
export * from './lib/iss/src/lib/+state/iss.actions';
export * from './lib/iss/src/lib/+state/iss.selectors';
export * from './lib/iss/src/lib/+state/iss.reducer';
export * from './lib/iss/src/lib/+state/iss.effects';
export * from './lib/iss/src/lib/+state/iss.facade';

export * from './lib/iss/src/lib/services/iss-provider.service';
export * from './lib/iss/src/lib/services/consumers.service';
export * from './lib/iss/src/lib/services/staff-log.service';

// Keep named re-exports only if other code relies on these exact names
export { ISS_FEATURE_KEY } from './lib/iss/src/lib/+state/iss.models';
export { IssFacade } from './lib/iss/src/lib/+state/iss.facade';

// =====================================
// Providers (Feature)
// =====================================
export * from './lib/providers/src/lib/services/providers.api';

export * from './lib/providers/src/lib/+state/providers.models';
export * from './lib/providers/src/lib/+state/providers.actions';
export * from './lib/providers/src/lib/+state/providers.selectors';
export * from './lib/providers/src/lib/+state/providers.reducer';
export * from './lib/providers/src/lib/+state/providers.effects';
export * from './lib/providers/src/lib/+state/providers.facade';

// =====================================
// Http (Feature)
// =====================================
export * from './lib/http/request-id.interceptor';


// optional (module-style feature registration)
export * from './lib/providers/src/lib/providers-data-access.module';
