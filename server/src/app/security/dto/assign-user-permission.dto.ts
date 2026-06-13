import { IsIn, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class AssignUserPermissionDto {
  @IsUUID()
  userId!: string;

  @IsString()
  @MaxLength(150)
  permissionCode!: string;

  @IsOptional()
  @IsIn(['ALLOW', 'DENY'])
  effect?: 'ALLOW' | 'DENY';

  @IsOptional()
  @IsString()
  @MaxLength(255)
  reason?: string;
}