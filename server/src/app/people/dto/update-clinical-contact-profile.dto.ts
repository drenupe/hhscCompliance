import { PartialType } from '@nestjs/mapped-types';
import { CreateClinicalContactProfileDto } from './create-clinical-contact-profile.dto';

export class UpdateClinicalContactProfileDto extends PartialType(
  CreateClinicalContactProfileDto,
) {}