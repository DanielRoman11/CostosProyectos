import { IsOptional } from "class-validator";

export class FindByInputStaffDto{
	@IsOptional()
	name?: string
}