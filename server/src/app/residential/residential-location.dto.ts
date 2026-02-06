import {
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateResidentialLocationDto {
  // ✅ REQUIRED
  @IsString()
  @MinLength(4)
  @MaxLength(4)
  @Matches(/^[A-Z0-9]{4}$/, {
    message: 'locationCode must be 4 letters/numbers (A–Z, 0–9)',
  })
  locationCode!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @IsIn(['THREE_PERSON', 'FOUR_PERSON', 'HOST_HOME'])
  type!: 'THREE_PERSON' | 'FOUR_PERSON' | 'HOST_HOME';

  // Optional (if omitted, server will attach first/only provider)
  @IsOptional()
  @IsString()
  providerId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  address?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  city?: string | null;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z]{2}$/, { message: 'state must be 2 letters' })
  state?: string | null;

  @IsOptional()
  @IsString()
  @Matches(/^\d{5}(-\d{4})?$/, {
    message: 'zip must be 5 digits (or 9 with dash)',
  })
  zip?: string | null;
}

export class UpdateResidentialLocationDto {
  // ✅ OPTIONAL on update
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(4)
  @Matches(/^[A-Z0-9]{4}$/, {
    message: 'locationCode must be 4 letters/numbers (A–Z, 0–9)',
  })
  locationCode?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @IsIn(['THREE_PERSON', 'FOUR_PERSON', 'HOST_HOME'])
  type?: 'THREE_PERSON' | 'FOUR_PERSON' | 'HOST_HOME';

  @IsOptional()
  @IsString()
  @MaxLength(180)
  address?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  city?: string | null;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z]{2}$/, { message: 'state must be 2 letters' })
  state?: string | null;

  @IsOptional()
  @IsString()
  @Matches(/^\d{5}(-\d{4})?$/, {
    message: 'zip must be 5 digits (or 9 with dash)',
  })
  zip?: string | null;

  @IsOptional()
  @IsIn(['ACTIVE', 'INACTIVE'])
  status?: 'ACTIVE' | 'INACTIVE';
}
