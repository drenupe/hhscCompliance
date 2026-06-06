import { PartialType } from '@nestjs/mapped-types';
import { CreateConsumerCareTeamAssignmentDto } from './create-consumer-care-team-assignment.dto';

export class UpdateConsumerCareTeamAssignmentDto extends PartialType(
  CreateConsumerCareTeamAssignmentDto,
) {}