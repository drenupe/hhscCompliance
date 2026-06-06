import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';

import { PersonEntity } from './entities/person.entity';
import { ConsumerRecordEntity } from './entities/consumer-record.entity';
import { ResidentialAssignmentEntity } from './entities/residential-assignment.entity';
import { IssConsumerAssignmentEntity } from './entities/iss-consumer-assignment.entity';

import { IssProvider } from '../iss/entities/iss-provider.entity';
import { ResidentialLocationEntity } from '../residential/residential-location.entity';
import { EmployeeProfileEntity } from './entities/employee-profile.entity';
import { ClinicalContactProfileEntity } from './entities/clinical-contact-profile.entity';
import { ConsumerCareTeamAssignmentEntity } from './entities/consumer-care-team-assignment.entity';
import { CareTeamAssignmentsService } from './services/care-team-assignments.service';
import { ClinicalContactProfilesService } from './services/clinical-contact-profiles.service';
import { ConsumerRecordsService } from './services/consumer-records.service';
import { EmployeeProfilesService } from './services/employee-profiles.service';
import { PersonsService } from './services/persons.service';
import { ResidentialAssignmentsService } from './services/residential-assignments.service';
import { ConsumerDiagnosisEntity } from './entities/consumer-diagnosis.entity';
import { ConsumerDiagnosesService } from './services/consumer-diagnoses.service';
import { ConsumerGuardianEntity } from './entities/consumer-guardian.entity';
import { ConsumerGuardiansService } from './services/consumer-guardians.service';
import { ConsumerLegalStatusEntity } from './entities/consumer-legal-status.entity';
import { ConsumerLegalStatusesService } from './services/consumer-legal-statuses.service';
import { MedicaidBenefitsEntity } from './entities/medicaid-benefits.entity';
import { MedicaidBenefitsService } from './services/medicaid-benefits.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PersonEntity,
      ConsumerRecordEntity,
      ConsumerLegalStatusEntity,
      MedicaidBenefitsEntity,
      ConsumerGuardianEntity,
      ConsumerDiagnosisEntity,
      ResidentialAssignmentEntity,
      IssConsumerAssignmentEntity,
      ResidentialLocationEntity,
      IssProvider,
      EmployeeProfileEntity,
      ClinicalContactProfileEntity,
      ConsumerCareTeamAssignmentEntity
    ]),
  ],
  controllers: [PeopleController],
  providers: [
  PeopleService,
  PersonsService,
  ConsumerRecordsService,
  MedicaidBenefitsService,
  ConsumerGuardiansService,
  ConsumerLegalStatusesService,
  EmployeeProfilesService,
  ClinicalContactProfilesService,
  ResidentialAssignmentsService,
  CareTeamAssignmentsService,
  ConsumerDiagnosesService],
  exports: [ 
  PeopleService,
  PersonsService,
  ConsumerRecordsService,
  EmployeeProfilesService,
  ClinicalContactProfilesService,
  ResidentialAssignmentsService,
  CareTeamAssignmentsService,],
})
export class PeopleModule {}