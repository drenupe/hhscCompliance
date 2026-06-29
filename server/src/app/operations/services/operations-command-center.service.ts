import { Injectable } from '@nestjs/common';

import { ExecutiveIntelligenceService } from './executive-intelligence.service';
import { OperationsCommandCenterView } from '../types/operations.types';

@Injectable()
export class OperationsCommandCenterService {
  constructor(private readonly executive: ExecutiveIntelligenceService) {}

  getCommandCenter(): OperationsCommandCenterView {
    return {
      providerName: 'McCaskill HCS Services',
      title: 'Provider Intelligence Center',
      subtitle: 'Run the business. Stay survey ready. Protect reimbursement.',
      overallSurveyReadiness: 94,
      operationalHealth: 96,
      openTasks: 28,
      criticalItems: 4,
      dueSoon: 12,

      serviceLines: [
        {
          type: 'RESIDENTIAL',
          title: 'Residential Services',
          subtitle:
            'Homes, staffing, daily operations, transportation, and residential oversight.',
          status: 'ATTENTION',
          surveyReadiness: 91,
          activeConsumers: 12,
          openTasks: 14,
          dueSoon: 5,
          criticalItems: 2,
          routeCommands: ['/operations', 'residential'],
        },
        {
          type: 'ISS',
          title: 'ISS Services',
          subtitle:
            'Individualized Skills and Socialization, attendance, activities, goals, and billing readiness.',
          status: 'HEALTHY',
          surveyReadiness: 97,
          activeConsumers: 8,
          openTasks: 6,
          dueSoon: 3,
          criticalItems: 0,
          routeCommands: ['/operations', 'iss'],
        },
        {
          type: 'FOSTER_HOST_HOME',
          title: 'Foster / Host Home',
          subtitle:
            'Host home monitoring, documentation, inspections, training, and provider oversight.',
          status: 'HEALTHY',
          surveyReadiness: 98,
          activeConsumers: 4,
          openTasks: 1,
          dueSoon: 1,
          criticalItems: 0,
          routeCommands: ['/operations', 'foster-host-home'],
        },
        {
          type: 'STAFF_OPERATIONS',
          title: 'Staff Operations',
          subtitle:
            'Employees, training, credentials, schedules, background checks, and workforce readiness.',
          status: 'ATTENTION',
          surveyReadiness: 92,
          activeConsumers: 0,
          openTasks: 15,
          dueSoon: 6,
          criticalItems: 1,
          routeCommands: ['/operations', 'staff'],
        },
        {
          type: 'FINANCE_ADMIN',
          title: 'Finance & Administration',
          subtitle:
            'Provider administration, financial readiness, records, contracts, and oversight.',
          status: 'HEALTHY',
          surveyReadiness: 95,
          activeConsumers: 0,
          openTasks: 9,
          dueSoon: 4,
          criticalItems: 0,
          routeCommands: ['/operations', 'finance-admin'],
        },
      ],

      coreModules: [
        {
          module: 'RESIDENTIAL',
          title: 'Residential Requirements',
          subtitle:
            'Homes, environment, safety, drills, and emergency readiness.',
          status: 'ATTENTION',
          findingCount: 28,
          criticalCount: 2,
          dueSoon: 5,
          routeCommands: ['/dashboard', 'modules', 'RESIDENTIAL'],
        },
        {
          module: 'PROGRAMMATIC',
          title: 'Programmatic Requirements',
          subtitle:
            'IPC, PDP, implementation plans, assessments, and authorizations.',
          status: 'ATTENTION',
          findingCount: 9,
          criticalCount: 0,
          dueSoon: 3,
          routeCommands: ['/dashboard', 'modules', 'PROGRAMMATIC'],
        },
        {
          module: 'MEDICATION',
          title: 'Medication',
          subtitle: 'MAR, physician orders, reviews, errors, and storage.',
          status: 'AT_RISK',
          findingCount: 7,
          criticalCount: 1,
          dueSoon: 2,
          routeCommands: ['/dashboard', 'modules', 'MEDICATION'],
        },
        {
          module: 'NURSING',
          title: 'Nursing',
          subtitle:
            'Assessments, clinical reviews, RN oversight, and documentation.',
          status: 'AT_RISK',
          findingCount: 5,
          criticalCount: 1,
          dueSoon: 2,
          routeCommands: ['/dashboard', 'modules', 'NURSING'],
        },
        {
          module: 'ANE',
          title: 'Abuse, Neglect & Exploitation',
          subtitle:
            'ANE prevention, reporting, training, and investigation readiness.',
          status: 'HEALTHY',
          findingCount: 2,
          criticalCount: 0,
          dueSoon: 1,
          routeCommands: ['/dashboard', 'modules', 'ANE'],
        },
        {
          module: 'BEHAVIOR_SUPPORT',
          title: 'Behavior Support',
          subtitle: 'BSP reviews, data collection, incidents, and approvals.',
          status: 'ATTENTION',
          findingCount: 4,
          criticalCount: 1,
          dueSoon: 1,
          routeCommands: ['/dashboard', 'modules', 'BEHAVIOR_SUPPORT'],
        },
        {
          module: 'RESTRAINTS',
          title: 'Restraints',
          subtitle: 'Restraint use, approvals, documentation, and monitoring.',
          status: 'HEALTHY',
          findingCount: 1,
          criticalCount: 0,
          dueSoon: 0,
          routeCommands: ['/dashboard', 'modules', 'RESTRAINTS'],
        },
        {
          module: 'PROTECTIVE_DEVICES',
          title: 'Protective Devices',
          subtitle: 'Approvals, consents, monitoring, and documentation.',
          status: 'HEALTHY',
          findingCount: 1,
          criticalCount: 0,
          dueSoon: 0,
          routeCommands: ['/dashboard', 'modules', 'PROTECTIVE_DEVICES'],
        },
        {
          module: 'PROHIBITIONS',
          title: 'Prohibitions',
          subtitle: 'Rights restrictions, prohibited practices, and safeguards.',
          status: 'HEALTHY',
          findingCount: 1,
          criticalCount: 0,
          dueSoon: 0,
          routeCommands: ['/dashboard', 'modules', 'PROHIBITIONS'],
        },
        {
          module: 'FINANCES_RENT',
          title: 'Finances / Room & Board',
          subtitle: 'Personal funds, ledgers, receipts, room and board.',
          status: 'ATTENTION',
          findingCount: 3,
          criticalCount: 0,
          dueSoon: 1,
          routeCommands: ['/dashboard', 'modules', 'FINANCES_RENT'],
        },
        {
          module: 'ISS',
          title: 'ISS Compliance',
          subtitle:
            'Attendance, activities, goals, service notes, and billing support.',
          status: 'HEALTHY',
          findingCount: 6,
          criticalCount: 0,
          dueSoon: 2,
          routeCommands: ['/dashboard', 'modules', 'ISS'],
        },
        {
          module: 'FOUR_PERSON_RESIDENCE',
          title: 'Four-Person Residence',
          subtitle:
            'Four-person home requirements, monitoring, and documentation.',
          status: 'ATTENTION',
          findingCount: 4,
          criticalCount: 1,
          dueSoon: 1,
          routeCommands: ['/dashboard', 'modules', 'FOUR_PERSON_RESIDENCE'],
        },
        {
          module: 'QUALITY_ASSURANCE',
          title: 'Quality Assurance',
          subtitle:
            'Internal surveys, CAPs, evidence, audits, and policy monitoring.',
          status: 'ATTENTION',
          findingCount: 8,
          criticalCount: 1,
          dueSoon: 3,
          routeCommands: ['/dashboard', 'modules', 'QUALITY_ASSURANCE'],
        },
      ],

      priorities: [
        {
          id: 'priority-1',
          level: 'Critical',
          title: 'Fire Drill documentation needs review',
          context: 'Residential Requirements',
          due: 'Due today',
          routeCommands: ['/dashboard', 'modules', 'RESIDENTIAL'],
        },
        {
          id: 'priority-2',
          level: 'High',
          title: 'Nursing assessment approaching policy deadline',
          context: 'Nursing',
          due: 'Due in 3 days',
          routeCommands: ['/dashboard', 'modules', 'NURSING'],
        },
        {
          id: 'priority-3',
          level: 'Medium',
          title: 'ISS monthly documentation pending',
          context: 'ISS',
          due: 'Due this week',
          routeCommands: ['/dashboard', 'modules', 'ISS'],
        },
      ],

      
      recentActivity: [
        {
          id: 'activity-1',
          message: 'ISS attendance submitted for 8 consumers.',
          timestamp: '5 minutes ago',
          type: 'OPERATIONS',
        },
        {
          id: 'activity-2',
          message: 'Medication review completed.',
          timestamp: '18 minutes ago',
          type: 'COMPLIANCE',
        },
        {
          id: 'activity-3',
          message: 'Emergency Plan evidence uploaded.',
          timestamp: '32 minutes ago',
          type: 'EVIDENCE',
        },
        {
          id: 'activity-4',
          message: 'Quality Assurance CAP approved.',
          timestamp: '1 hour ago',
          type: 'CAP',
        },
      ],


      
      executive: this.executive.build(),
    };
  }
}