import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';

export class GetToolDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  pageSize: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  page: number;

  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  order: 'ASC' | 'DESC';

  @IsOptional()
  @IsString()
  sort: string;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  id: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  status: 0 | 1;
}
