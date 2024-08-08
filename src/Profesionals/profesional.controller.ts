import { Body, Controller, Get, Logger, Post } from "@nestjs/common";

@Controller('profesional')
export class ProfesionalController{
	logger = new Logger(ProfesionalController.name)
	constructor(

	){}

	@Post()
	create(@Body() input){
		
	}
}