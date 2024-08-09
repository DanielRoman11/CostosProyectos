import { IsOptional } from 'class-validator';

export class SearchQueryProfessional {
  @IsOptional()
  name: string;
}
