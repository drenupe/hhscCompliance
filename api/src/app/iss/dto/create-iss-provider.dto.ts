import { IsNotEmpty, IsString } from 'class-validator';

export class CreateIssProviderDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  licenseNumber: string;
}
