import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

import { CreateAuditLogDto } from '../dto/create-audit-log.dto';
import { SearchAuditLogDto } from '../dto/search-audit-log.dto';
import { AuditLogEntity } from '../entities/audit-log.entity';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLogEntity)
    private readonly auditLogsRepo: Repository<AuditLogEntity>,
  ) {}

  create(dto: CreateAuditLogDto): Promise<AuditLogEntity> {
    return this.auditLogsRepo.save(
      this.auditLogsRepo.create({
        userId: dto.userId ?? null,
        action: dto.action,
        resourceType: dto.resourceType,
        resourceId: dto.resourceId ?? null,
        ipAddress: dto.ipAddress ?? null,
        userAgent: dto.userAgent ?? null,
        beforeValue: dto.beforeValue ?? null,
        afterValue: dto.afterValue ?? null,
        metadata: dto.metadata ?? null,
      }),
    );
  }

  findAll(): Promise<AuditLogEntity[]> {
    return this.auditLogsRepo.find({
      order: { createdAt: 'DESC' },
      take: 250,
    });
  }

  search(dto: SearchAuditLogDto): Promise<AuditLogEntity[]> {
    const where: Record<string, unknown> = {};

    if (dto.userId) where.userId = dto.userId;
    if (dto.action) where.action = dto.action;
    if (dto.resourceType) where.resourceType = dto.resourceType;
    if (dto.resourceId) where.resourceId = dto.resourceId;

    if (dto.startDate && dto.endDate) {
      where.createdAt = Between(
        new Date(dto.startDate),
        new Date(dto.endDate),
      );
    } else if (dto.startDate) {
      where.createdAt = MoreThanOrEqual(new Date(dto.startDate));
    } else if (dto.endDate) {
      where.createdAt = LessThanOrEqual(new Date(dto.endDate));
    }

    return this.auditLogsRepo.find({
      where,
      order: { createdAt: 'DESC' },
      take: 500,
    });
  }

  async findOne(id: string): Promise<AuditLogEntity> {
    const auditLog = await this.auditLogsRepo.findOne({
      where: { id },
    });

    if (!auditLog) {
      throw new NotFoundException(`Audit log ${id} not found`);
    }

    return auditLog;
  }
}