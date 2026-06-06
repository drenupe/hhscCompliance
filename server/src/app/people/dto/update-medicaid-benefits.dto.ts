// server/src/app/people/dto/update-medicaid-benefits.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicaidBenefitsDto } from './create-medicaid-benefits.dto';

export class UpdateMedicaidBenefitsDto extends PartialType(
  CreateMedicaidBenefitsDto,
) {}