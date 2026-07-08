// libs/data-access/src/index.ts
// Clean barrel exports grouped by domain.

// =====================================
// API Core
// =====================================
export * from './lib/api-core/base-api.service';
export * from './lib/api-core/tokens/environment.token';
//export * from './lib/auth/interceptors/auth-token.interceptor';

// =====================================
// Residential API + State
// =====================================
export * from './lib/residential/src/services/residential-locations.api';
export * from './lib/residential/src/services/fire-drills.api';

export * from './lib/residential/src/+state/fire-drills.actions';
export * from './lib/residential/src/+state/fire-drills.selectors';
export * from './lib/residential/src/+state/fire-drills.reducer';
export * from './lib/residential/src/+state/fire-drills.effects';
export * from './lib/residential/src/+state/fire-drills.facade';

export { FIRE_DRILLS_FEATURE_KEY } from './lib/residential/src/+state/fire-drills.models';
export { FireDrillsFacade } from './lib/residential/src/+state/fire-drills.facade';

// =====================================
// Compliance Domain Services
// =====================================
export * from './lib/programmatic/programmatic.service';
export * from './lib/finance/finance.service';
export * from './lib/behavior/behavior.service';
export * from './lib/ane/ane.service';
export * from './lib/restraints/restraints.service';
export * from './lib/enclosed-beds/enclosed-beds.service';
export * from './lib/protective-devices/protective-devices.service';
export * from './lib/prohibitions/prohibitions.service';

// =====================================
// Dashboard
// =====================================
export * from './lib/dashboard/src/services/compliance-dashboard.service';

export * from './lib/dashboard/src/services/module-workbench.service';

// =====================================
// Remediation
// =====================================
export * from './lib/remediation/models/finding-workspace.model';
export * from './lib/remediation/services/finding-workspace.service';

// =====================================
// Compliance Results API + State
// =====================================
export * from './lib/compliance/src/services/compliance-results.api';

export * from './lib/compliance/src/+state/compliance-results.reducer';
export * from './lib/compliance/src/+state/compliance-results.models';
export * from './lib/compliance/src/+state/compliance-results.actions';
export * from './lib/compliance/src/+state/compliance-results.selectors';
export * from './lib/compliance/src/+state/compliance-results.effects';
export * from './lib/compliance/src/+state/compliance-results.facade';

export { COMPLIANCE_RESULTS_FEATURE_KEY } from './lib/compliance/src/+state/compliance-results.models';
export { ComplianceResultsFacade } from './lib/compliance/src/+state/compliance-results.facade';

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
// ISS
// =====================================
export * from './lib/iss/src/+state/iss.models';
export * from './lib/iss/src/+state/iss.actions';
export * from './lib/iss/src/+state/iss.selectors';
export * from './lib/iss/src/+state/iss.reducer';
export * from './lib/iss/src/+state/iss.effects';
export * from './lib/iss/src/+state/iss.facade';

export * from './lib/iss/src/services/iss-provider.service';
export * from './lib/iss/src/services/consumers.service';
export * from './lib/iss/src/services/staff-log.service';

export { ISS_FEATURE_KEY } from './lib/iss/src/+state/iss.models';
export { IssFacade } from './lib/iss/src/+state/iss.facade';

// =====================================
// Providers
// =====================================
export * from './lib/providers/src/lib/services/providers.api';

export * from './lib/providers/src/lib/+state/providers.models';
export * from './lib/providers/src/lib/+state/providers.actions';
export * from './lib/providers/src/lib/+state/providers.selectors';
export * from './lib/providers/src/lib/+state/providers.reducer';
export * from './lib/providers/src/lib/+state/providers.effects';
export * from './lib/providers/src/lib/+state/providers.facade';

// =====================================
// Operations
// =====================================
export * from './lib/operations/types/operations.types';
export * from './lib/operations/services/operations.service';

export * from './lib/operations/+state/operations.actions';
export * from './lib/operations/+state/operations.effects';
export * from './lib/operations/+state/operations.models';
export * from './lib/operations/+state/operations.reducer';
export * from './lib/operations/+state/operations.selectors';
export * from './lib/operations/+state/operations-state.module';
// =====================================
// HTTP
// =====================================
export * from './lib/http/request-id.interceptor';

// =====================================
// Home Environment
// =====================================
export * from './lib/home-environment/src/services/home-environment.api';



export * from '../../data-access/process/src';
export * from '../../data-access/import/src';