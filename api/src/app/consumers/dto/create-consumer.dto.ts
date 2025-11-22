import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsDateString,
  MaxLength,
} from 'class-validator';

export class CreateConsumerDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName!: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string; // maps to DATE in entity

  @IsOptional()
  @IsString()
  @MaxLength(64)
  medicaidNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  levelOfNeed?: string; // e.g. "5"

  @IsOptional()
  @IsString()
  @MaxLength(32)
  placeOfService?: string; // e.g. "OFF_SITE"

  @IsInt()
  @IsPositive()
  issProviderId!: number;
}
