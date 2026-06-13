import {
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateAuditLogDto {
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsString()
  @MaxLength(100)
  action!: string;

  @IsString()
  @MaxLength(100)
  resourceType!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  resourceId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  ipAddress?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;

  @IsOptional()
  @IsObject()
  beforeValue?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  afterValue?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}