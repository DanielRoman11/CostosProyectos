import { PartialType } from "@nestjs/mapped-types";
import { CreateStaffDto } from "./create-staff.dto";

export class Update extends PartialType(CreateStaffDto) {}