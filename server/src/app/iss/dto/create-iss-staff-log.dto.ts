import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class CreateIssStaffLogDto {
  @IsInt()
  @IsPositive()
  consumerId!: number;

  @IsDateString()
  serviceDate!: string; // ISO date string "YYYY-MM-DD"

  /**
   * Top header block from the form:
   * {
   *   individualName: string;
   *   date: string;
   *   lon: string;
   *   provider: string;
   *   license: string;
   *   staffNameTitle: string;
   * }
   */
  @IsObject()
  @IsNotEmpty()
  header!: Record<string, unknown>;

  /**
   * M–F service rows from the form:
   * Array of objects like:
   * {
   *   day: string;
   *   date: string;
   *   providerName: string;
   *   providerSignature: string;
   *   start: string;
   *   end: string;
   *   minutes: number;
   *   setting: 'on_site' | 'off_site';
   *   individualsCount?: number;
   *   staffCount?: number;
   * }
   */
  @IsArray()
  @IsNotEmpty()
  serviceWeek!: Array<Record<string, unknown>>;

  /**
   * Weekly initials sections:
   * {
   *   socialization: Array<...>;
   *   selfHelp: Array<...>;
   *   adaptive: Array<...>;
   *   implementation: Array<...>;
   *   community: Array<...>;
   * }
   */
  @IsObject()
  @IsNotEmpty()
  weeklySections!: Record<string, unknown>;

  /**
   * Notes rows:
   * Array of { date: string; initials: string; comment: string }
   */
  @IsArray()
  @IsOptional()
  notes?: Array<Record<string, unknown>>;
}
