import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { Repository } from 'typeorm';

import { AuditLogsService } from './audit-logs.service';

import { DisableMfaDto } from '../dto/disable-mfa.dto';
import { EnableMfaDto } from '../dto/enable-mfa.dto';
import { VerifyMfaDto } from '../dto/verify-mfa.dto';

import { MfaBackupCodeEntity } from '../entities/mfa-backup-code.entity';
import { MfaSecretEntity } from '../entities/mfa-secret.entity';

@Injectable()
export class MfaService {
  constructor(
    @InjectRepository(MfaSecretEntity)
    private readonly mfaSecretsRepo: Repository<MfaSecretEntity>,

    @InjectRepository(MfaBackupCodeEntity)
    private readonly backupCodesRepo: Repository<MfaBackupCodeEntity>,

    private readonly auditLogs: AuditLogsService,
  ) {}

  async initialize(userId: string) {
    let record = await this.mfaSecretsRepo.findOne({
      where: { userId },
    });

    if (record) {
      return record;
    }

    const secret = randomBytes(32).toString('hex');

    record = await this.mfaSecretsRepo.save(
      this.mfaSecretsRepo.create({
        userId,
        encryptedSecret: secret, // TODO encrypt before production
        status: 'PENDING',
        isEnabled: false,
      }),
    );

    await this.auditLogs.create({
      userId,
      action: 'MFA_INITIALIZED',
      resourceType: 'MFA',
      resourceId: record.id,
    });

    return record;
  }

  async enable(dto: EnableMfaDto) {
    const record = await this.mfaSecretsRepo.findOne({
      where: { userId: dto.userId },
    });

    if (!record) {
      throw new NotFoundException('MFA setup not found');
    }

    // TODO verify TOTP token
    record.isEnabled = true;
    record.status = 'ACTIVE';
    record.enabledAt = new Date();

    await this.mfaSecretsRepo.save(record);

    await this.auditLogs.create({
      userId: dto.userId,
      action: 'MFA_ENABLED',
      resourceType: 'MFA',
      resourceId: record.id,
    });

    return record;
  }

  async verify(dto: VerifyMfaDto) {
    const record = await this.mfaSecretsRepo.findOne({
      where: { userId: dto.userId },
    });

    if (!record || !record.isEnabled) {
      throw new BadRequestException('MFA is not enabled');
    }

    // TODO actual TOTP validation

    await this.auditLogs.create({
      userId: dto.userId,
      action: 'MFA_VERIFIED',
      resourceType: 'MFA',
      resourceId: record.id,
    });

    return {
      success: true,
      userId: dto.userId,
    };
  }

  async disable(dto: DisableMfaDto) {
    const record = await this.mfaSecretsRepo.findOne({
      where: { userId: dto.userId },
    });

    if (!record) {
      throw new NotFoundException('MFA setup not found');
    }

    record.isEnabled = false;
    record.status = 'DISABLED';
    record.disabledAt = new Date();

    await this.mfaSecretsRepo.save(record);

    await this.auditLogs.create({
      userId: dto.userId,
      action: 'MFA_DISABLED',
      resourceType: 'MFA',
      resourceId: record.id,
      metadata: {
        reason: dto.reason,
      },
    });

    return record;
  }

  async getStatus(userId: string) {
    return this.mfaSecretsRepo.findOne({
      where: { userId },
    });
  }
}