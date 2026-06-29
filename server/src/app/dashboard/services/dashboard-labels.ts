export type DashboardEntityType =
  | 'RESIDENTIAL'
  | 'CONSUMER'
  | 'EMPLOYEE'
  | 'PROVIDER';

export const DASHBOARD_MODULES: Array<{ key: string; title: string }> = [
  { key: 'RESIDENTIAL', title: 'Residential Requirements' },
  { key: 'PROGRAMMATIC', title: 'Programmatic Requirements' },
  { key: 'FINANCES_RENT', title: 'Finances & Rent' },
  { key: 'BEHAVIOR_SUPPORT', title: 'Behavior Support Plan' },
  { key: 'ANE', title: 'Abuse/Neglect/Exploitation' },
  { key: 'RESTRAINTS', title: 'Restraints' },
  { key: 'ENCLOSED_BEDS', title: 'Enclosed Beds' },
  { key: 'PROTECTIVE_DEVICES', title: 'Protective Devices' },
  { key: 'PROHIBITIONS', title: 'Prohibitions' },
];

export function titleFor(moduleKey: string): string {
  return (
    DASHBOARD_MODULES.find((module) => module.key === moduleKey)?.title ??
    moduleKey
  );
}

export function titleForSection(module: string, sectionKey: string): string {
  if (module !== 'RESIDENTIAL') {
    return titleFor(module);
  }

  switch (sectionKey) {
    case 'HOME_ENVIRONMENT':
      return 'Home & Environment';
    case 'HOT_WATER':
      return 'Hot Water Safety';
    case 'LIFE_SAFETY':
      return 'Life Safety';
    case 'FIRE_DRILLS':
      return 'Fire Drills';
    case 'EMERGENCY_PLANS':
      return 'Emergency Plans';
    case 'INFECTION_CONTROL':
      return 'Infection Control';
    case 'MEDICATION':
      return 'Medication';
    case 'NURSING':
      return 'Nursing';
    case 'FOUR_PERSON':
      return 'Four-Person Residence';
    case 'GENERAL':
      return 'General';
    default:
      return sectionKey.replace(/_/g, ' ');
  }
}

export function defaultEntityTypeForModule(
  module: string,
): DashboardEntityType {
  switch (module) {
    case 'RESIDENTIAL':
    case 'PROTECTIVE_DEVICES':
    case 'RESTRAINTS':
    case 'ENCLOSED_BEDS':
    case 'PROHIBITIONS':
      return 'RESIDENTIAL';

    case 'MEDICATION':
    case 'NURSING':
    case 'PROGRAMMATIC':
    case 'BEHAVIOR_SUPPORT':
    case 'FINANCES_RENT':
    case 'ISS':
      return 'CONSUMER';

    case 'ANE':
    case 'TRAINING':
    case 'STAFF_CREDENTIALS':
      return 'EMPLOYEE';

    default:
      return 'PROVIDER';
  }
}

export function entityLabel(entityType: string, entityId: string): string {
  switch (entityType) {
    case 'RESIDENTIAL':
      return `Location ${entityId}`;
    case 'CONSUMER':
      return `Consumer ${entityId}`;
    case 'EMPLOYEE':
      return `Employee ${entityId}`;
    case 'PROVIDER':
      return 'Provider';
    default:
      return `${entityType} ${entityId}`;
  }
}

export function normalizeSeverity(
  value: unknown,
): 'LOW' | 'MED' | 'HIGH' | 'CRITICAL' {
  const severity = String(value ?? '').toUpperCase();

  if (severity === 'CRITICAL') return 'CRITICAL';
  if (severity === 'HIGH') return 'HIGH';
  if (severity === 'MEDIUM' || severity === 'MED') return 'MED';

  return 'LOW';
}