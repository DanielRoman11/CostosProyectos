import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class SearchQuerysStaff {
  @IsOptional()
	@Transform(({ value }) => value?.trim().toLocaleLowerCase())
  name?: string;
}
