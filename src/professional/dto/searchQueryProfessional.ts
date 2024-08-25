import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class SearchQueryProfessional {
  @IsOptional()
  @Transform(({ value }) => value?.trim().toLocaleLowerCase())
  name: string;
}
