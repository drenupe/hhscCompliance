import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateConsumerRecordDto {
  @IsUUID()
  personId!: string;

  @IsOptional()
  @IsString()
  medicaidNumber?: string | null;

  @IsOptional()
  @IsString()
  levelOfNeed?: string | null;

  @IsOptional()
  @IsString()
  placeOfService?: string | null;

  @IsOptional()
  @IsString()
  serviceGroup?: string | null;

  @IsOptional()
    @IsString()
    status?: 'ACTIVE' | 'INACTIVE';
}