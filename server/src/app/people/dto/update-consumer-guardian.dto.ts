// server/src/app/people/dto/update-consumer-guardian.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateConsumerGuardianDto } from './create-consumer-guardian.dto';

export class UpdateConsumerGuardianDto extends PartialType(
  CreateConsumerGuardianDto,
) {}