import { PartialType } from '@nestjs/mapped-types';
import { CreateConsumerRecordDto } from './create-consumer-record.dto';

export class UpdateConsumerRecordDto extends PartialType(CreateConsumerRecordDto) {}