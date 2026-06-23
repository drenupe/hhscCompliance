import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { ComplianceEngineService } from '../../compliance/engine/compliance-engine.service';
import { ComplianceResultEntity } from '../../compliance/entities/compliance-result.entity';


@Injectable()
export class ComplianceRecheckService {
  private readonly logger = new Logger(ComplianceRecheckService.name);

  constructor(
    @InjectRepository(ComplianceResultEntity)
    private readonly complianceResultsRepo: Repository<ComplianceResultEntity>,

    private readonly complianceEngine: ComplianceEngineService,
  ) {}

  @Cron('*/30 * * * * *')
  async processRecheckQueue(): Promise<void> {
    const now = new Date();

    const findings = await this.complianceResultsRepo.find({
      where: {
        needsRecheck: true,
        nextCheckAt: LessThanOrEqual(now),
      },
      order: {
        nextCheckAt: 'ASC',
      },
      take: 25,
    });

    if (!findings.length) {
      return;
    }

    this.logger.log(`Processing ${findings.length} compliance recheck(s)`);

    for (const finding of findings) {
      await this.recheckFinding(finding);
    }
  }

  private async recheckFinding(finding: ComplianceResultEntity): Promise<void> {
    if (!finding.locationId) {
      await this.markRechecked(finding.id, 'Skipped: finding has no locationId');
      return;
    }

    try {
      await this.complianceEngine.evaluateLocation(finding.locationId);

      await this.complianceResultsRepo.update(
        { id: finding.id },
        {
          needsRecheck: false,
          lastRecheckedAt: new Date(),
          recheckReason: null,
        },
      );

      this.logger.log(
        `Rechecked finding ${finding.id} for location ${finding.locationId}`,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown recheck error';

      this.logger.error(
        `Failed recheck for finding ${finding.id}: ${message}`,
      );

      await this.complianceResultsRepo.update(
        { id: finding.id },
        {
          nextCheckAt: new Date(Date.now() + 5 * 60 * 1000),
          recheckReason: `Retry scheduled: ${message}`,
        },
      );
    }
  }

  private async markRechecked(
    id: string,
    reason: string,
  ): Promise<void> {
    await this.complianceResultsRepo.update(
      { id },
      {
        needsRecheck: false,
        lastRecheckedAt: new Date(),
        recheckReason: reason,
      },
    );
  }
}