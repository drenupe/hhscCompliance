// server/src/app/people/dto/update-consumer-legal-status.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateConsumerLegalStatusDto } from './create-consumer-legal-status.dto';

export class UpdateConsumerLegalStatusDto extends PartialType(
  CreateConsumerLegalStatusDto,
) {}