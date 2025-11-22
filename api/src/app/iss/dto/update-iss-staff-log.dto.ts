import { PartialType } from '@nestjs/mapped-types';
import { CreateIssStaffLogDto } from './create-iss-staff-log.dto';

export class UpdateIssStaffLogDto extends PartialType(CreateIssStaffLogDto) {}
