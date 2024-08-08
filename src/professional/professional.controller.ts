import { Body, Controller, Get, Logger, Post } from "@nestjs/common";

@Controller('profesional')
export class ProfessionalController{
	logger = new Logger(ProfessionalController.name)
	constructor(

	){}

	@Post()
	create(@Body() input){

	}
}