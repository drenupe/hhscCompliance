import { Injectable } from '@nestjs/common';

import { PersonsService } from './services/persons.service';
import { ConsumerRecordsService } from './services/consumer-records.service';
import { EmployeeProfilesService } from './services/employee-profiles.service';
import { ClinicalContactProfilesService } from './services/clinical-contact-profiles.service';
import { ResidentialAssignmentsService } from './services/residential-assignments.service';
import { CareTeamAssignmentsService } from './services/care-team-assignments.service';
import { ConsumerDiagnosesService } from './services/consumer-diagnoses.service';
import { ConsumerGuardiansService } from './services/consumer-guardians.service';
import { ConsumerLegalStatusesService } from './services/consumer-legal-statuses.service';
import { MedicaidBenefitsService } from './services/medicaid-benefits.service';

@Injectable()
export class PeopleService {
  constructor(
    public readonly persons: PersonsService,
    public readonly consumerGuardians: ConsumerGuardiansService,
    public readonly consumerRecords: ConsumerRecordsService,
    public readonly employeeProfiles: EmployeeProfilesService,
    public readonly clinicalContacts: ClinicalContactProfilesService,
    public readonly residentialAssignments: ResidentialAssignmentsService,
    public readonly careTeamAssignments: CareTeamAssignmentsService,
    public readonly consumerDiagnoses: ConsumerDiagnosesService,
    public readonly consumerLegalStatuses: ConsumerLegalStatusesService,
    public readonly medicaidBenefits: MedicaidBenefitsService,
  ) {}
}