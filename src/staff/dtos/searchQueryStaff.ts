import { IsOptional } from 'class-validator';

export class SearchQuerysStaff {
  @IsOptional()
  name?: string;
}
