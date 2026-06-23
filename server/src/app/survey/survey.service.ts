import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { ComplianceResultEntity } from '../compliance/entities/compliance-result.entity';

@Injectable()
export class SurveyService {
  constructor(
    @InjectRepository(ComplianceResultEntity)
    private readonly complianceResultsRepo: Repository<ComplianceResultEntity>,
  ) {}

  async dashboard(locationId: string) {
    const findings = await this.complianceResultsRepo.find({
      where: [
        { locationId, status: 'NON_COMPLIANT' },
        { locationId, status: 'UNKNOWN' },
      ],
      order: {
        module: 'ASC',
        subcategory: 'ASC',
        severity: 'DESC',
      },
    });

    return findings.map((finding) => ({
      module: finding.module,
      subcategory: finding.subcategory,
      ruleCode: finding.ruleCode,
      status: finding.status,
      severity: finding.severity,
      message: finding.message,
      lastCheckedAt: finding.lastCheckedAt,
      routeCommands: finding.routeCommands,
      queryParams: finding.queryParams,
    }));
  }

  async findings(locationId: string) {
    const findings = await this.complianceResultsRepo.find({
      where: [
        { locationId, status: 'NON_COMPLIANT' },
        { locationId, status: 'UNKNOWN' },
      ],
      order: {
        module: 'ASC',
        subcategory: 'ASC',
        ruleCode: 'ASC',
      },
    });

    return findings.map((finding) => ({
      module: finding.module,
      subcategory: finding.subcategory,
      ruleCode: finding.ruleCode,
      status: finding.status,
      severity: finding.severity,
      message: finding.message,
      lastCheckedAt: finding.lastCheckedAt,
    }));
  }
}