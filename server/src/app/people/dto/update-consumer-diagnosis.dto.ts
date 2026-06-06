// server/src/app/people/dto/update-consumer-diagnosis.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateConsumerDiagnosisDto } from './create-consumer-diagnosis.dto';

export class UpdateConsumerDiagnosisDto extends PartialType(CreateConsumerDiagnosisDto) {}