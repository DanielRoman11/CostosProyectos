import { Inject, Injectable } from "@nestjs/common";
import constants from "../shared/constants";
import { Repository } from "typeorm";
import { Staff } from "./entities/staff.entity";
import { CreateStaffDto } from "./dtos/create-staff.dto";

@Injectable()
export class StaffService{
	constructor(
		@Inject(constants.staff)
    private staffRepo: Repository<Staff>,
	){}

	async createStaff(input: CreateStaffDto){
		await this.staffRepo.save({...input})
	}
}