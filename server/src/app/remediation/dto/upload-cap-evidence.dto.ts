import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UploadCapEvidenceDto {
  @IsString()
  @IsNotEmpty()
  fileName!: string;

  @IsString()
  @IsNotEmpty()
  fileType!: string;

  @IsString()
  @IsNotEmpty()
  storagePath!: string;

  @IsOptional()
  @IsIn(['PHOTO', 'PDF', 'POLICY', 'TRAINING_RECORD', 'FORM', 'OTHER'])
  evidenceType?: 'PHOTO' | 'PDF' | 'POLICY' | 'TRAINING_RECORD' | 'FORM' | 'OTHER';
}