import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

import { PeopleService } from './people.service';

import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';

import { CreateConsumerRecordDto } from './dto/create-consumer-record.dto';
import { UpdateConsumerRecordDto } from './dto/update-consumer-record.dto';

import { CreateResidentialAssignmentDto } from './dto/create-residential-assignment.dto';
import { EndResidentialAssignmentDto } from './dto/end-residential-assignment.dto';

import { CreateEmployeeProfileDto } from './dto/create-employee-profile.dto';
import { UpdateEmployeeProfileDto } from './dto/update-employee-profile.dto';

import { CreateClinicalContactProfileDto } from './dto/create-clinical-contact-profile.dto';

import { CreateConsumerCareTeamAssignmentDto } from './dto/create-consumer-care-team-assignment.dto';
import { UpdateConsumerCareTeamAssignmentDto } from './dto/update-consumer-care-team-assignment.dto';
import { EndCareTeamAssignmentDto } from './dto/end-care-team-assignment.dto';
import { CreateConsumerDiagnosisDto } from './dto/create-consumer-diagnosis.dto';
import { UpdateConsumerDiagnosisDto } from './dto/update-consumer-diagnosis.dto';
import { CreateConsumerGuardianDto } from './dto/create-consumer-guardian.dto';
import { UpdateConsumerGuardianDto } from './dto/update-consumer-guardian.dto';
import { CreateConsumerLegalStatusDto } from './dto/create-consumer-legal-status.dto';
import { UpdateConsumerLegalStatusDto } from './dto/update-consumer-legal-status.dto';
import { CreateMedicaidBenefitsDto } from './dto/create-medicaid-benefits.dto';
import { UpdateMedicaidBenefitsDto } from './dto/update-medicaid-benefits.dto';

@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Post()
  createPerson(@Body() dto: CreatePersonDto) {
    return this.peopleService.persons.create(dto);
  }

  @Get()
  findPeople() {
    return this.peopleService.persons.findAll();
  }

  @Get(':id')
  findPerson(@Param('id') id: string) {
    return this.peopleService.persons.findOne(id);
  }

  @Patch(':id')
  updatePerson(@Param('id') id: string, @Body() dto: UpdatePersonDto) {
    return this.peopleService.persons.update(id, dto);
  }

  @Delete(':id')
  removePerson(@Param('id') id: string) {
    return this.peopleService.persons.remove(id);
  }

  @Post('consumer-records')
  createConsumerRecord(@Body() dto: CreateConsumerRecordDto) {
    return this.peopleService.consumerRecords.create(dto);
  }

  @Get('consumer-records/all')
  findConsumerRecords() {
    return this.peopleService.consumerRecords.findAll();
  }

  @Get('consumer-records/:id')
  findConsumerRecord(@Param('id') id: string) {
    return this.peopleService.consumerRecords.findOne(id);
  }

  @Patch('consumer-records/:id')
  updateConsumerRecord(
    @Param('id') id: string,
    @Body() dto: UpdateConsumerRecordDto,
  ) {
    return this.peopleService.consumerRecords.update(id, dto);
  }

  @Post('residential-assignments')
  createResidentialAssignment(@Body() dto: CreateResidentialAssignmentDto) {
    return this.peopleService.residentialAssignments.create(dto);
  }

  @Get('residential-assignments/location/:locationId')
  findResidentialAssignmentsByLocation(@Param('locationId') locationId: string) {
    return this.peopleService.residentialAssignments.findByLocation(locationId);
  }

  @Get('residential-assignments/consumer/:consumerRecordId')
  findResidentialAssignmentsByConsumer(
    @Param('consumerRecordId') consumerRecordId: string,
  ) {
    return this.peopleService.residentialAssignments.findByConsumer(
      consumerRecordId,
    );
  }

  @Patch('residential-assignments/:id/end')
  endResidentialAssignment(
    @Param('id') id: string,
    @Body() dto: EndResidentialAssignmentDto,
  ) {
    return this.peopleService.residentialAssignments.end(id, dto.endDate);
  }

  @Post('employee-profiles')
  createEmployeeProfile(@Body() dto: CreateEmployeeProfileDto) {
    return this.peopleService.employeeProfiles.create(dto);
  }

  @Get('employee-profiles/all')
  findEmployeeProfiles() {
    return this.peopleService.employeeProfiles.findAll();
  }

  @Get('employee-profiles/:id')
  findEmployeeProfile(@Param('id') id: string) {
    return this.peopleService.employeeProfiles.findOne(id);
  }

  @Patch('employee-profiles/:id')
  updateEmployeeProfile(
    @Param('id') id: string,
    @Body() dto: UpdateEmployeeProfileDto,
  ) {
    return this.peopleService.employeeProfiles.update(id, dto);
  }

  @Post('clinical-contact-profiles')
  createClinicalContactProfile(@Body() dto: CreateClinicalContactProfileDto) {
    return this.peopleService.clinicalContacts.create(dto);
  }

  @Get('clinical-contact-profiles/all')
  findClinicalContactProfiles() {
    return this.peopleService.clinicalContacts.findAll();
  }

  @Get('clinical-contact-profiles/:id')
  findClinicalContactProfile(@Param('id') id: string) {
    return this.peopleService.clinicalContacts.findOne(id);
  }

  @Post('care-team-assignments')
  createConsumerCareTeamAssignment(
    @Body() dto: CreateConsumerCareTeamAssignmentDto,
  ) {
    return this.peopleService.careTeamAssignments.create(dto);
  }

  @Get('care-team-assignments/consumer/:consumerRecordId')
  findCareTeamByConsumerRecord(
    @Param('consumerRecordId') consumerRecordId: string,
  ) {
    return this.peopleService.careTeamAssignments.findByConsumer(
      consumerRecordId,
    );
  }

  @Get('care-team-assignments/:id')
  findConsumerCareTeamAssignment(@Param('id') id: string) {
    return this.peopleService.careTeamAssignments.findOne(id);
  }

  @Patch('care-team-assignments/:id')
  updateConsumerCareTeamAssignment(
    @Param('id') id: string,
    @Body() dto: UpdateConsumerCareTeamAssignmentDto,
  ) {
    return this.peopleService.careTeamAssignments.update(id, dto);
  }

  @Patch('care-team-assignments/:id/end')
  endConsumerCareTeamAssignment(
    @Param('id') id: string,
    @Body() dto: EndCareTeamAssignmentDto,
  ) {
    return this.peopleService.careTeamAssignments.end(id, dto.endDate);
  }

    @Post('consumer-diagnoses')
  createConsumerDiagnosis(@Body() dto: CreateConsumerDiagnosisDto) {
    return this.peopleService.consumerDiagnoses.create(dto);
  }

  @Get('consumer-diagnoses/all')
  findAllConsumerDiagnoses() {
    return this.peopleService.consumerDiagnoses.findAll();
  }

  @Get('consumer-diagnoses/consumer/:consumerRecordId')
  findDiagnosesByConsumer(@Param('consumerRecordId') consumerRecordId: string) {
    return this.peopleService.consumerDiagnoses.findByConsumer(consumerRecordId);
  }

  @Get('consumer-diagnoses/:id')
  findOneConsumerDiagnosis(@Param('id') id: string) {
    return this.peopleService.consumerDiagnoses.findOne(id);
  }

  @Patch('consumer-diagnoses/:id')
  updateConsumerDiagnosis(
    @Param('id') id: string,
    @Body() dto: UpdateConsumerDiagnosisDto,
  ) {
    return this.peopleService.consumerDiagnoses.update(id, dto);
  }

  @Delete('consumer-diagnoses/:id')
  removeConsumerDiagnosis(@Param('id') id: string) {
    return this.peopleService.consumerDiagnoses.remove(id);
  }

  @Post('consumer-guardians')
  createConsumerGuardian(@Body() dto: CreateConsumerGuardianDto) {
    return this.peopleService.consumerGuardians.create(dto);
  }

  @Get('consumer-guardians/all')
  findAllConsumerGuardians() {
    return this.peopleService.consumerGuardians.findAll();
  }

  @Get('consumer-guardians/consumer/:consumerRecordId')
  findGuardiansByConsumer(@Param('consumerRecordId') consumerRecordId: string) {
    return this.peopleService.consumerGuardians.findByConsumer(consumerRecordId);
  }

  @Get('consumer-guardians/:id')
  findOneConsumerGuardian(@Param('id') id: string) {
    return this.peopleService.consumerGuardians.findOne(id);
  }

  @Patch('consumer-guardians/:id')
  updateConsumerGuardian(
    @Param('id') id: string,
    @Body() dto: UpdateConsumerGuardianDto,
  ) {
    return this.peopleService.consumerGuardians.update(id, dto);
  }

  @Delete('consumer-guardians/:id')
  removeConsumerGuardian(@Param('id') id: string) {
    return this.peopleService.consumerGuardians.remove(id);
  }
    @Post('consumer-legal-statuses')
  createConsumerLegalStatus(@Body() dto: CreateConsumerLegalStatusDto) {
    return this.peopleService.consumerLegalStatuses.create(dto);
  }

  @Get('consumer-legal-statuses/all')
  findAllConsumerLegalStatuses() {
    return this.peopleService.consumerLegalStatuses.findAll();
  }

  @Get('consumer-legal-statuses/consumer/:consumerRecordId')
  findLegalStatusesByConsumer(@Param('consumerRecordId') consumerRecordId: string) {
    return this.peopleService.consumerLegalStatuses.findByConsumer(consumerRecordId);
  }

  @Get('consumer-legal-statuses/:id')
  findOneConsumerLegalStatus(@Param('id') id: string) {
    return this.peopleService.consumerLegalStatuses.findOne(id);
  }

  @Patch('consumer-legal-statuses/:id')
  updateConsumerLegalStatus(
    @Param('id') id: string,
    @Body() dto: UpdateConsumerLegalStatusDto,
  ) {
    return this.peopleService.consumerLegalStatuses.update(id, dto);
  }

  @Delete('consumer-legal-statuses/:id')
  removeConsumerLegalStatus(@Param('id') id: string) {
    return this.peopleService.consumerLegalStatuses.remove(id);
  }

  @Post('medicaid-benefits')
createMedicaidBenefits(
  @Body() dto: CreateMedicaidBenefitsDto,
) {
  return this.peopleService.medicaidBenefits.create(dto);
}

@Get('medicaid-benefits/all')
findAllMedicaidBenefits() {
  return this.peopleService.medicaidBenefits.findAll();
}

@Get('medicaid-benefits/consumer/:consumerRecordId')
findMedicaidBenefitsByConsumer(
  @Param('consumerRecordId') consumerRecordId: string,
) {
  return this.peopleService.medicaidBenefits.findByConsumer(
    consumerRecordId,
  );
}

@Get('medicaid-benefits/:id')
findOneMedicaidBenefits(
  @Param('id') id: string,
) {
  return this.peopleService.medicaidBenefits.findOne(id);
}

@Patch('medicaid-benefits/:id')
updateMedicaidBenefits(
  @Param('id') id: string,
  @Body() dto: UpdateMedicaidBenefitsDto,
) {
  return this.peopleService.medicaidBenefits.update(id, dto);
}

@Delete('medicaid-benefits/:id')
removeMedicaidBenefits(
  @Param('id') id: string,
) {
  return this.peopleService.medicaidBenefits.remove(id);
}
}