import { IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateProviderDto {
  contractNumber(contractNumber: any): string {
    throw new Error('Method not implemented.');
  }
  componentCode(componentCode: any): string {
    throw new Error('Method not implemented.');
  }
  npi(npi: any): string {
    throw new Error('Method not implemented.');
  }
  ein(ein: any): string {
    throw new Error('Method not implemented.');
  }
  address(address: any): string {
    throw new Error('Method not implemented.');
  }
  city(city: any): string {
    throw new Error('Method not implemented.');
  }
  state(state: any): string {
    throw new Error('Method not implemented.');
  }
  zip(zip: any): string {
    throw new Error('Method not implemented.');
  }
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  licenseNumber?: string | null;
}

export class UpdateProviderDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  licenseNumber?: string | null;

  @IsOptional()
  @IsIn(['ACTIVE', 'INACTIVE'])
  status?: 'ACTIVE' | 'INACTIVE';
  contractNumber: any;
  componentCode: any;
  npi: any;
  ein: any;
  address: any;
  city: any;
  state: any;
  zip: any;
}
