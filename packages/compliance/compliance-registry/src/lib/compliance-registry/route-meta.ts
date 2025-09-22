/**
 * Single source of truth for: sidebar, route data, and TAC requirements.
 * Place in: libs/compliance/registry/src/lib/route-meta.ts
 */

/* ---------- Types ---------- */

export type TacCitation = `§${number}.${number}` | string;
export type Evidence = 'document' | 'log' | 'training' | 'policy' | 'attestation' | 'observation';
export type Frequency =
  | 'once'
  | 'per-admission'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'annually'
  | 'per-incident';
export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface Requirement {
  id: string;
  text: string;
  evidence: Evidence[];
  frequency: Frequency;
  ownerRoles?: string[];
  severity: Severity;
  dueDays?: number;      // e.g., complete within X days of admission
  effectiveFrom?: string;
  effectiveTo?: string;
}

export interface CitationBlock {
  citation: TacCitation; // e.g., '§565.25'
  title?: string;
  requirements: Requirement[];
}

export interface ComplianceMeta {
  /** stable key used in code and analytics (usually matches last segment of path) */
  key: string;
  /** page title */
  title: string;
  /** TAC sections for this page (one page can cover multiple citations) */
  sections: CitationBlock[];
  /** optional coarse risk flag for dashboards */
  riskLevel?: Severity;
  /** optional feature flag (for toggling modules) */
  featureFlag?: string;
}

/** Extended with UI and routing fields for the sidebar/app router */
export interface ComplianceNavMeta extends ComplianceMeta {
  label: string; // sidebar label
  icon: string;  // lucide icon name
  path: string;  // router path (absolute)
}

/* ---------- Data (edit these) ---------- */

export const ROUTE_COMPLIANCE_META: ComplianceNavMeta[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: 'layout-dashboard',
    path: '/dashboard',
    title: 'Dashboard',
    sections: [],
  },
  {
    key: 'residents',
    label: 'Locations',
    icon: 'map-pin-house',
    path: '/residents',
    title: 'Locations / Residences',
    sections: [
      {
        citation: '§565.23',
        title: 'Residential Requirements',
        requirements: [
          {
            id: 'res-001',
            text: 'Maintain habitable environment: sanitation, water, utilities, temperature control.',
            evidence: ['observation', 'log'],
            frequency: 'daily',
            ownerRoles: ['Admin'],
            severity: 'high',
          },
          {
            id: 'res-002',
            text: 'Document fire/evacuation drills per cadence and retain logs.',
            evidence: ['log'],
            frequency: 'monthly',
            ownerRoles: ['Admin'],
            severity: 'high',
          },
          {
            id: 'res-003',
            text: 'Emergency preparedness plan current and posted; staff trained.',
            evidence: ['policy', 'training'],
            frequency: 'annually',
            ownerRoles: ['Admin'],
            severity: 'high',
          },
        ],
      },
    ],
  },
  {
    key: 'consumers',
    label: 'Consumers',
    icon: 'users-round',
    path: '/consumers',
    title: 'Consumers',
    sections: [
      {
        citation: '§565.25',
        title: 'Programmatic Requirements',
        requirements: [
          {
            id: 'con-001',
            text: 'Individual Service Plan (ISP)/IPC current and implemented as written.',
            evidence: ['document'],
            frequency: 'per-admission',
            ownerRoles: ['QIDP'],
            severity: 'high',
            dueDays: 7,
          },
          {
            id: 'con-002',
            text: 'Monthly progress notes aligned to outcomes and supports.',
            evidence: ['document', 'log'],
            frequency: 'monthly',
            ownerRoles: ['QIDP', 'DSP'],
            severity: 'medium',
          },
        ],
      },
      {
        citation: '§565.31',
        title: 'Rights & ANE Protections',
        requirements: [
          {
            id: 'con-101',
            text: 'Rights notification provided and acknowledged; grievance process available.',
            evidence: ['document'],
            frequency: 'once',
            ownerRoles: ['Admin'],
            severity: 'high',
          },
        ],
      },
    ],
  },
  {
    key: 'medicals',
    label: 'Medicals',
    icon: 'stethoscope',
    path: '/medicals',
    title: 'Medicals',
    sections: [
      {
        citation: '§565.25',
        title: 'Health Services',
        requirements: [
          {
            id: 'med-001',
            text: 'Nursing service plans current; orders followed; reviews documented.',
            evidence: ['document', 'log'],
            frequency: 'per-admission',
            ownerRoles: ['RN'],
            severity: 'critical',
          },
          {
            id: 'med-002',
            text: 'MAR complete; variances (errors/refusals) investigated and documented.',
            evidence: ['log', 'document'],
            frequency: 'daily',
            ownerRoles: ['RN', 'LVN'],
            severity: 'critical',
          },
        ],
      },
      {
        citation: '§565.33',
        title: 'Restraints (if used)',
        requirements: [
          {
            id: 'med-101',
            text: 'Physician order & justification; least restrictive; monitoring documented.',
            evidence: ['document', 'log'],
            frequency: 'per-incident',
            ownerRoles: ['RN'],
            severity: 'high',
          },
        ],
      },
      {
        citation: '§565.37',
        title: 'Protective Devices (if used)',
        requirements: [
          {
            id: 'med-201',
            text: 'Assessment, consent, and review schedule documented.',
            evidence: ['document'],
            frequency: 'per-incident',
            ownerRoles: ['RN', 'QIDP'],
            severity: 'high',
          },
        ],
      },
    ],
  },
  {
    key: 'behaviors',
    label: 'Behavior Support',
    icon: 'brain',
    path: '/behaviors',
    title: 'Behavior Support',
    sections: [
      {
        citation: '§565.29',
        title: 'Behavior Support Plan',
        requirements: [
          {
            id: 'bsp-001',
            text: 'BSP authored by qualified professional; integrates with ISP and consent.',
            evidence: ['document'],
            frequency: 'per-admission',
            ownerRoles: ['BCBA', 'QIDP'],
            severity: 'high',
          },
          {
            id: 'bsp-002',
            text: 'Data collection on target behaviors and interventions; review cadence documented.',
            evidence: ['log', 'document'],
            frequency: 'daily',
            ownerRoles: ['DSP', 'BCBA'],
            severity: 'medium',
          },
        ],
      },
      {
        citation: '§565.33',
        title: 'Restraints (if applicable)',
        requirements: [
          {
            id: 'bsp-101',
            text: 'Crisis plan; de-escalation attempts documented before/after restraint.',
            evidence: ['log'],
            frequency: 'per-incident',
            ownerRoles: ['Staff'],
            severity: 'critical',
          },
        ],
      },
      {
        citation: '§565.39',
        title: 'Prohibitions',
        requirements: [
          {
            id: 'bsp-201',
            text: 'No prohibited practices (e.g., seclusion/aversives); periodic audits recorded.',
            evidence: ['observation', 'log'],
            frequency: 'per-incident',
            ownerRoles: ['Admin'],
            severity: 'critical',
          },
        ],
      },
    ],
  },
  {
    key: 'dayhabs',
    label: 'Day Hab',
    icon: 'calendar-range',
    path: '/dayhabs',
    title: 'Day Habilitation',
    sections: [
      {
        citation: '§565.25',
        title: 'Programmatic Delivery',
        requirements: [
          {
            id: 'day-001',
            text: 'Service notes reflect outcomes, schedules, and staffing ratios.',
            evidence: ['log'],
            frequency: 'daily',
            ownerRoles: ['DSP', 'Supervisor'],
            severity: 'medium',
          },
          {
            id: 'day-002',
            text: 'Transportation safety checks and rosters retained.',
            evidence: ['log', 'observation'],
            frequency: 'daily',
            ownerRoles: ['Supervisor'],
            severity: 'high',
          },
        ],
      },
    ],
  },
  {
    key: 'program-requirements/staff',
    label: 'Staff',
    icon: 'id-card',
    path: '/program-requirements/staff',
    title: 'Staff',
    sections: [
      {
        citation: '§565.25',
        title: 'Staffing & Qualifications',
        requirements: [
          {
            id: 'stf-001',
            text: 'Role qualifications verified (licenses/certs/background) and current.',
            evidence: ['document'],
            frequency: 'per-admission',
            ownerRoles: ['HR'],
            severity: 'high',
          },
        ],
      },
      {
        citation: '§565.31',
        title: 'ANE Awareness & Reporting',
        requirements: [
          {
            id: 'stf-101',
            text: 'ANE/reporter training completed and refreshed per policy.',
            evidence: ['training'],
            frequency: 'annually',
            ownerRoles: ['HR'],
            severity: 'high',
          },
        ],
      },
      {
        citation: '§565.33',
        title: 'Restraints Training (if applicable)',
        requirements: [
          {
            id: 'stf-201',
            text: 'Approved crisis/restraint training current before use.',
            evidence: ['training', 'attestation'],
            frequency: 'annually',
            ownerRoles: ['HR'],
            severity: 'critical',
          },
        ],
      },
    ],
  },
  {
    key: 'program-requirements/training',
    label: 'Training',
    icon: 'school',
    path: '/program-requirements/training',
    title: 'Training',
    sections: [
      {
        citation: '§565.25',
        title: 'Core Training',
        requirements: [
          {
            id: 'trn-001',
            text: 'Orientation & role-specific competencies completed and documented.',
            evidence: ['training', 'attestation'],
            frequency: 'per-admission',
            ownerRoles: ['HR'],
            severity: 'high',
          },
          {
            id: 'trn-002',
            text: 'Annual refreshers (First Aid/CPR/Med Aide as applicable).',
            evidence: ['training'],
            frequency: 'annually',
            ownerRoles: ['HR'],
            severity: 'high',
          },
        ],
      },
      {
        citation: '§565.31',
        title: 'Rights & ANE',
        requirements: [
          {
            id: 'trn-101',
            text: 'Rights, reporting timelines, and retaliation protections training.',
            evidence: ['training'],
            frequency: 'annually',
            ownerRoles: ['HR'],
            severity: 'high',
          },
        ],
      },
    ],
  },
] as const;

/* ---------- Helpers ---------- */

/** Sidebar items (label, icon, path) derived from the meta. */
export function getNavItems() {
  return ROUTE_COMPLIANCE_META.map(({ label, icon, path }) => ({ label, icon, path }));
}

/** Find meta by absolute path (e.g., '/behaviors'). */
export function findRouteMeta(path: string): ComplianceNavMeta | undefined {
  return ROUTE_COMPLIANCE_META.find((m) => m.path === path);
}

/** Find meta by key (e.g., 'behaviors' or 'program-requirements/training'). */
export function metaByKey(key: string): ComplianceNavMeta | undefined {
  return ROUTE_COMPLIANCE_META.find((m) => m.key === key);
}

/** Flatten requirements with their citation (useful for dashboards). */
export function flattenRequirements(meta: ComplianceMeta) {
  return meta.sections.flatMap((s) => s.requirements.map((r) => ({ ...r, citation: s.citation })));
}
