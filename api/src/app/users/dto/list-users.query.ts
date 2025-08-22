// api/src/app/users/dto/list-users.query.ts
import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class ListUsersQuery {
  @Transform(({ value }) => (value !== undefined ? parseInt(value, 10) : 1))
  @IsInt()
  @Min(1)
  @IsOptional()
  page = 1;

  @Transform(({ value }) => (value !== undefined ? parseInt(value, 10) : 25))
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit = 25;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : undefined))
  @IsString()
  @IsOptional()
  search?: string;

  @IsIn(['createdAt', 'email'])
  @IsOptional()
  sort: 'createdAt' | 'email' = 'createdAt';

  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  order: 'ASC' | 'DESC' = 'DESC';
}
