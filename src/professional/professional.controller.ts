import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { CreateProfessionalDto } from './dto/createProfessional.dto';

@Controller('profesional')
export class ProfessionalController {
  logger = new Logger(ProfessionalController.name);
  constructor() {}

  @Post()
  create(@Body() input: CreateProfessionalDto) {
		console.log(input);
		return "Hola mundo!!"
	}
}
