import { PartialType } from '@nestjs/mapped-types';
import { CreateIssProviderDto } from './create-iss-provider.dto';

export class UpdateIssProviderDto extends PartialType(CreateIssProviderDto) {}
